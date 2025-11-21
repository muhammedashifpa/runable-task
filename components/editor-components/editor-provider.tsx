"use client";

import { ElementType, getElementType } from "@/lib/editor/elements";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { lockedType } from "../types";
import { serializeRootToString } from "@/lib/editor/serializeDomToString";
import { compileJsxToComponent } from "@/lib/editor/serializeStringToJsx";
import { toast } from "sonner";

interface EditorContextType {
  Component: React.ComponentType | "loading" | "error";
  editableMode: boolean;
  activeElement: HTMLElement | null;
  elementType: ElementType;
  lockedBoundingClients: lockedType | null;
  toggleEditableMode: () => void;
  setActiveElement: (element: HTMLElement | null) => void;
  updateBoundingClients: () => void;
  saveComponent: () => void;
  setSaveState: React.Dispatch<
    React.SetStateAction<EditorContextType["saveState"]>
  >;
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

  const [saveState, setSaveState] = useState<EditorContextType["saveState"]>({
    dirty: false,
    saving: false,
    error: null,
    success: false,
  });

  const userAppAreaRef = useRef<HTMLDivElement>(null);

  const resetProvider = () => {
    setActiveElement(null);
    setElementType("unknown");
    setLockedBoundingClients(null);
  };

  const toggleEditableMode = () => {
    setEditableMode((prev) => !prev);
    resetProvider();
  };
  // Update bounding clients of the active element
  const updateBoundingClients = () => {
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
  };
  const saveComponent = async () => {
    if (!userAppAreaRef.current) return;
    setSaveState((s) => ({
      ...s,
      saving: true,
      error: null,
      success: false,
    }));
    const appArea = userAppAreaRef.current;
    const serialized = serializeRootToString(appArea);
    const res = await fetch(`/api/component/${componentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: serialized }),
    });
    if (!res.ok) {
      setSaveState((s) => ({
        ...s,
        saving: false,
        error: "Failed to save",
        success: false,
      }));
      toast.error("Error saving component");
      throw new Error("Failed to update component");
    }
    const data = await res.json();
    setSaveState({
      dirty: false,
      saving: false,
      error: null,
      success: true,
    });
    toast.success("Component saved successfully!");
    return data;
  };

  useEffect(() => {
    // Update element type and bounding clients when active element changes
    const updateElTypeAndBoudingClients = () => {
      if (activeElement) {
        const type = getElementType(activeElement);
        setElementType(type);
      }
      updateBoundingClients();
    };
    updateElTypeAndBoudingClients();
  }, [activeElement]);

  useEffect(() => {
    async function load() {
      try {
        setComponent("loading");

        const res = await fetch(`/api/component/hero`);

        if (!res.ok) {
          console.error("Fetch failed:", res.status);
          setComponent("error");
          return;
        }

        const data = await res.json();

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
        setSaveState,
        userAppAreaRef,
        setActiveElement,
        toggleEditableMode,
        updateBoundingClients,
        saveComponent,
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
