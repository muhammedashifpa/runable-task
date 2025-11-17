"use client";

import { ElementType, getElementType } from "@/lib/editor/elements";
import React, { createContext, useContext, useEffect, useState } from "react";
import { lockedType } from "../types";

interface EditorContextType {
  editableMode: boolean;
  activeElement: HTMLElement | null;
  elementType: ElementType;
  locked: lockedType | null;
  toggleEditableMode: () => void;
  setActiveElement: (element: HTMLElement | null) => void;
  updateBoundingClients: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [editableMode, setEditableMode] = useState(true);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [elementType, setElementType] = useState<ElementType>("unknown");
  const [locked, setLocked] = useState<lockedType | null>(null);

  console.log(elementType, "elementType in provider");

  const resetProvider = () => {
    setActiveElement(null);
    setElementType("unknown");
  };
  const toggleEditableMode = () => {
    setEditableMode((prev) => !prev);
    resetProvider();
  };
  const updateBoundingClients = () => {
    if (activeElement) {
      const rect = structuredClone(activeElement.getBoundingClientRect());
      setLocked({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        tagName: activeElement.tagName.toLowerCase(),
      });
    }
  };
  useEffect(() => {
    const updateElementType = () => {
      if (activeElement) {
        const type = getElementType(activeElement);
        setElementType(type);
      }
      updateBoundingClients();
    };
    updateElementType();
  }, [activeElement]);
  return (
    <EditorContext.Provider
      value={{
        editableMode,
        activeElement,
        elementType,
        locked,
        setActiveElement,
        toggleEditableMode,
        updateBoundingClients,
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
