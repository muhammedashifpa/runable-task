import { useEditor } from "@/context/editor-provider";
import { TYPO_CLASSES } from "@/lib/editor/utils";
import { useState, useEffect, useMemo } from "react";

export function useTypography() {
  const [classes, setClasses] = useState<string[]>([]);
  const [textClasses, setTextClasses] = useState<string[]>([]);
  const {
    updateBoundingClients,
    activeElement: el,
    setSaveState,
  } = useEditor();

  // Extract all classes when element changes
  useEffect(() => {
    if (!el) return;

    const processClasses = () => {
      const rawClass =
        typeof el.className === "string"
          ? el.className
          : (el as unknown as SVGElement).className?.baseVal || "";

      const all = rawClass
        .split(" ")
        .map((c: string) => c.trim())
        .filter(Boolean);

      setClasses(all);

      // Filter only typography classes
      const onlyTypography = all.filter((cls: string) =>
        Object.values(TYPO_CLASSES).some((regex) => regex.test(cls))
      );

      // Sort alphabetically for stable UI
      const sorted: string[] = onlyTypography.sort((a: string, b: string) =>
        a.localeCompare(b)
      );
      setTextClasses(sorted);
    };
    processClasses();
  }, [el]);

  // Utility: remove previous typography class before adding new one
  function updateTypography(type: keyof typeof TYPO_CLASSES, newClass: string) {
    if (!el) return;
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
    setSaveState((prev) => ({ ...prev, dirty: true }));
  }

  const currentWeight = useMemo(() => {
    return (
      textClasses.find((cls) => cls.match(TYPO_CLASSES.fontWeight)) ||
      "font-normal"
    );
  }, [textClasses]);

  const currentAlign = useMemo(() => {
    return (
      textClasses.find((cls) => cls.match(TYPO_CLASSES.textAlign)) ||
      "text-left"
    );
  }, [textClasses]);

  const currentFontSize = useMemo(() => {
    return (
      textClasses.find((cls) => cls.match(TYPO_CLASSES.fontSize)) || "text-base"
    );
  }, [textClasses]);

  const currentFontColor = useMemo(() => {
    return (
      textClasses.find((cls) => cls.match(TYPO_CLASSES.color)) || "text-inherit"
    );
  }, [textClasses]);

  const currentTextDecoration = useMemo(() => {
    return (
      textClasses.find((cls) => cls.match(TYPO_CLASSES.textDecoration)) ||
      "no-underline"
    );
  }, [textClasses]);

  return {
    classes,
    textClasses,
    // Current values
    currentWeight,
    currentAlign,
    currentFontSize,
    currentFontColor,
    currentTextDecoration,
    // Setters
    setFontSize: (size: string) => updateTypography("fontSize", size),
    setFontWeight: (weight: string) => updateTypography("fontWeight", weight),
    setLineHeight: (lh: string) => updateTypography("leading", lh),
    setTracking: (tracking: string) => updateTypography("tracking", tracking),
    setTextAlign: (align: string) => updateTypography("textAlign", align),
    setFontColor: (color: string) => updateTypography("color", color),

    // Raw update
    updateTypography,
  };
}
