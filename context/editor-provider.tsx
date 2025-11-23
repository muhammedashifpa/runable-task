"use client";

import { ElementType, getElementType } from "@/lib/editor/utils";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { lockedType } from "../components/types";
import { serializeRootToString } from "@/lib/editor/serializeDomToString";
import { compileJsxToComponent } from "@/lib/editor/serializeStringToJsx";
import { toast } from "sonner";
import {
  LoadComponentResponse,
  useComponentApi,
} from "@/hooks/useComponentApi";

interface EditorContextType {
  Component: React.ComponentType | "loading" | "error";
  editableMode: boolean;
  activeElement: HTMLElement | null;
  elementType: ElementType;
  lockedBoundingClients: lockedType | null;
  isResetting: boolean;
  toggleEditableMode: () => void;
  setActiveElement: (element: HTMLElement | null) => void;
  updateBoundingClients: () => void;
  saveComponentHandler: () => void;
  setSaveState: React.Dispatch<
    React.SetStateAction<EditorContextType["saveState"]>
  >;
  resetToOriginalComponent: () => Promise<void>;
  userAppAreaRef: React.RefObject<HTMLDivElement | null>;
  saveState: {
    dirty: boolean;
    saving: boolean;
    error: string | null;
    success: boolean;
  };
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [Component, setComponent] =
    useState<EditorContextType["Component"]>("loading");
  const [componentId, setComponentId] = useState<string>("hero");
  const [editableMode, setEditableMode] = useState(true);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [elementType, setElementType] = useState<ElementType>("unknown");
  const [lockedBoundingClients, setLockedBoundingClients] =
    useState<lockedType | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [saveState, setSaveState] = useState<EditorContextType["saveState"]>({
    dirty: false,
    saving: false,
    error: null,
    success: false,
  });

  const { loadComponent, saveComponent, resetComponent } =
    useComponentApi(componentId);
  const userAppAreaRef = useRef<HTMLDivElement>(null);

  const resetProvider = () => {
    setActiveElement(null);
    setElementType("unknown");
    setLockedBoundingClients(null);
    setSaveState({
      dirty: false,
      saving: false,
      error: null,
      success: false,
    });
  };

  const toggleEditableMode = () => {
    setEditableMode((prev) => !prev);
    resetProvider();
  };
  // Update bounding clients of the active element
  const updateBoundingClients = useCallback(() => {
    if (activeElement) {
      const rect = structuredClone(activeElement.getBoundingClientRect());
      setLockedBoundingClients({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        tagName: activeElement.tagName.toLowerCase(),
      });
    }
  }, [activeElement]);

  // Save component to backend
  const saveComponentHandler = async () => {
    if (!userAppAreaRef.current) {
      setSaveState((s) => ({
        ...s,
        error: "Editor area not found",
        saving: false,
        success: false,
      }));
      toast.error("Editor not found");
      return;
    }

    try {
      // Begin saving
      setSaveState((s) => ({
        ...s,
        saving: true,
        error: null,
        success: false,
      }));

      const appArea = userAppAreaRef.current;

      // Serialize UI → JSX string
      let serialized = "";
      try {
        serialized = serializeRootToString(appArea);
        if (!serialized || typeof serialized !== "string") {
          throw new Error("Serialization failed");
        }
      } catch (err: unknown) {
        setSaveState((s) => ({
          ...s,
          saving: false,
          error: "Failed to serialize component",
          success: false,
        }));
        console.error("Serialization error:", err);
        toast.error("Failed to serialize component");
        return;
      }

      // Send save request
      let res: Response;
      try {
        res = await saveComponent(serialized);
      } catch (networkError) {
        console.error("Network error while saving:", networkError);
        setSaveState((s) => ({
          ...s,
          saving: false,
          error: "Network error while saving",
          success: false,
        }));
        toast.error("Network error while saving");
        return;
      }

      // API returned error status
      if (!res.ok) {
        let errMsg = "Failed to save component";

        try {
          const errJSON = await res.json();
          errMsg = errJSON?.error || errMsg;
        } catch {
          /* JSON parse failed — ignore */
        }

        setSaveState((s) => ({
          ...s,
          saving: false,
          error: errMsg,
          success: false,
        }));

        toast.error(errMsg);
        return;
      }

      // Parse response JSON safely
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse save response:", jsonErr);
        setSaveState((s) => ({
          ...s,
          saving: false,
          error: "Invalid server response",
          success: false,
        }));
        toast.error("Invalid server response");
        return;
      }

      // Save was successful
      setSaveState({
        dirty: false,
        saving: false,
        error: null,
        success: true,
      });

      toast.success("Component saved successfully!");
      return data;
    } catch (err: unknown) {
      // Handle absolutely any unexpected failure
      console.error("Unexpected save error:", err);

      setSaveState((s) => ({
        ...s,
        saving: false,
        error: "Unexpected error occurred",
        success: false,
      }));

      toast.error("Unexpected error occurred");
    }
  };

  async function resetToOriginalComponent() {
    setIsResetting(true);
    try {
      const res = await resetComponent();

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Restore failed");
      }

      const data = await res.json();

      toast.success("Component restored to original!");

      // Recompile JSX → Component
      const Comp = compileJsxToComponent(data.code);

      // Update Editor State
      setComponent(() => Comp);
      resetProvider();

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reset failed";
      setComponent("error");
      toast.error(message);

      return null;
    } finally {
      setIsResetting(false);
    }
  }

  useEffect(() => {
    // Update element type and bounding clients when active element changes
    const updateElTypeAndBoundingClients = () => {
      if (activeElement) {
        const type = getElementType(activeElement);
        setElementType(type);
      }
      updateBoundingClients();
    };
    updateElTypeAndBoundingClients();
  }, [activeElement, updateBoundingClients]);

  // Load component on mount
  useEffect(() => {
    async function load() {
      try {
        setComponent("loading");

        const res = await loadComponent();

        if (!res.ok) {
          console.error("Fetch failed:", res.status);
          setComponent("error");
          return;
        }

        const data = (await res.json()) as LoadComponentResponse;

        if (!data?.code || typeof data.code !== "string") {
          console.error("Invalid or missing code");
          setComponent("error");
          return;
        }

        let Comp;

        try {
          Comp = compileJsxToComponent(data.code);
        } catch (err) {
          console.error("JSX compile error:", err);
          setComponent("error");
          return;
        }

        if (typeof Comp !== "function") {
          console.error("Compiled output is not a component");
          setComponent("error");
          return;
        }
        setComponentId(data.id);
        setComponent(() => Comp);
      } catch (err) {
        console.error("Unexpected error:", err);
        setComponent("error");
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <EditorContext.Provider
      value={{
        Component,
        editableMode,
        activeElement,
        elementType,
        lockedBoundingClients,
        saveState,
        isResetting,
        setSaveState,
        userAppAreaRef,
        setActiveElement,
        toggleEditableMode,
        updateBoundingClients,
        saveComponentHandler,
        resetToOriginalComponent,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <EditorProvider>");
  return ctx;
}
