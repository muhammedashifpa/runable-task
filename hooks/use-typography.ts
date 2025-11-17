import { useEditor } from "@/components/editor-components/editor-provider";
import React, { useState, useEffect, useMemo } from "react";
const TYPO_CLASSES = {
  fontSize: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
  fontWeight:
    /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  tracking: /^tracking-(tighter|tight|normal|wide|wider|widest)$/,
  leading: /^leading-(none|tight|snug|normal|relaxed|loose|\d+)$/,
  textAlign: /^text-(left|center|right|justify)$/,
  textDecoration: /^(underline|line-through|overline|no-underline)$/,
  fontStyle: /^(italic|not-italic)$/,
};

export function useTypography(el: HTMLElement | null) {
  const [classes, setClasses] = useState<string[]>([]);
  const [textClasses, setTextClasses] = useState<string[]>([]);
  const { updateBoundingClients } = useEditor();

  // Extract all classes when element changes
  useEffect(() => {
    if (!el) return;

    const processClasses = () => {
      const all = el.className
        .split(" ")
        .map((c) => c.trim())
        .filter(Boolean);

      setClasses(all);

      // Filter only typography classes
      const onlyTypography = all.filter((cls) =>
        Object.values(TYPO_CLASSES).some((regex) => regex.test(cls))
      );

      // Sort alphabetically for stable UI
      const sorted = onlyTypography.sort((a, b) => a.localeCompare(b));
      setTextClasses(sorted);
    };
    processClasses();
  }, [el]);

  // Utility: remove previous typography class before adding new one
  function updateTypography(type: keyof typeof TYPO_CLASSES, newClass: string) {
    console.log("updating typography", type, newClass);
    if (!el) return;
    console.log(el.classList, "updating typography classes");
    const regex = TYPO_CLASSES[type];

    // Remove existing relevant class
    el.classList.forEach((cls) => {
      //   debugger;
      if (regex.test(cls)) el.classList.remove(cls);
    });

    // --- If newClass is empty, do NOT add a new class ---
    if (!newClass || newClass.trim() === "") {
      // Sync local state after removing
      setTextClasses((prev) => prev.filter((cls) => !regex.test(cls)));
      return;
    }

    // Add new class
    el.classList.add(newClass);

    // Update local state
    setTextClasses((prev) => {
      const filtered = prev.filter((cls) => !regex.test(cls));
      return [...filtered, newClass].sort((a, b) => a.localeCompare(b));
    });
    updateBoundingClients();
  }

  const currentWeight = useMemo(() => {
    return (
      textClasses.find((cls) => cls.match(TYPO_CLASSES.fontWeight)) ||
      "font-normal"
    );
  }, [el, textClasses]);

  const currentAlign = useMemo(() => {
    return (
      textClasses.find((cls) => cls.match(TYPO_CLASSES.textAlign)) ||
      "text-left"
    );
  }, [el, textClasses]);

  const currentFontSize = useMemo(() => {
    return (
      textClasses.find((cls) => cls.match(TYPO_CLASSES.fontSize)) || "text-base"
    );
  }, [el, textClasses]);

  const showTextAlignControls = React.useMemo(() => {
    if (!el || !el.parentElement) return true;

    const parent = el.parentElement;
    const parentClasses = parent.className.split(" ");

    const isFlexParent = parentClasses.some((cls) =>
      /^(flex|inline-flex)$/.test(cls)
    );

    return !isFlexParent; // hide when flex
  }, [el]);

  return {
    classes,
    textClasses,
    showTextAlignControls,
    // Current values
    currentWeight,
    currentAlign,
    currentFontSize,
    // Setters
    setFontSize: (size: string) => updateTypography("fontSize", size),
    setFontWeight: (weight: string) => updateTypography("fontWeight", weight),
    setLineHeight: (lh: string) => updateTypography("leading", lh),
    setTracking: (tracking: string) => updateTypography("tracking", tracking),
    setTextAlign: (align: string) => updateTypography("textAlign", align),

    // Raw update in case you add custom rules later
    updateTypography,
  };
}
