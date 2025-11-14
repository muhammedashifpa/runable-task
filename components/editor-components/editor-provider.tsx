"use client";

import React, { createContext, useContext, useState } from "react";

interface EditorContextType {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  editableMode: boolean;
  toggleEditableMode: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editableMode, setEditableMode] = useState(true);

  const toggleEditableMode = () => setEditableMode((prev) => !prev);

  return (
    <EditorContext.Provider
      value={{ selectedId, setSelectedId, editableMode, toggleEditableMode }}
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
