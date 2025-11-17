"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Italic,
  Underline,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  Strikethrough,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTypography } from "@/hooks/use-typography";
import { Toggle } from "../ui/toggle";
interface TypographyEditControllerProps {
  activeElement: HTMLElement | null;
}

const FONT_WEIGHT_MAP: Record<string, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};
const FONT_SIZE_LABELS: Record<string, string> = {
  "text-xs": "Xs",
  "text-sm": "Sm",
  "text-base": "Base",
  "text-lg": "Lg",
  "text-xl": "Xl",
  "text-2xl": "2xl",
  "text-3xl": "3xl",
  "text-4xl": "4xl",
  "text-5xl": "5xl",
  "text-6xl": "6xl",
  "text-7xl": "7xl",
  "text-8xl": "8xl",
  "text-9xl": "9xl",
};

export function TypographyEditController({
  activeElement,
}: TypographyEditControllerProps) {
  const {
    setTextAlign,
    setFontWeight,
    setFontSize,
    currentWeight,
    currentAlign,
    currentFontSize,
    showTextAlignControls,
    updateTypography,
  } = useTypography(activeElement);

  return (
    // const {typographySettings, setTypographySettings} = useTypographySettings();
    <div className="flex items-center gap-2">
      <Select value={currentFontSize} onValueChange={(v) => setFontSize(v)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Font Size" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Font Size</SelectLabel>

            {Object.entries(FONT_SIZE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={currentWeight ?? undefined}
        onValueChange={(v) => setFontWeight(v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Font Weight" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Weight</SelectLabel>
            <SelectItem value="font-thin">Thin</SelectItem>
            <SelectItem value="font-extralight">Extra Light</SelectItem>
            <SelectItem value="font-light">Light</SelectItem>
            <SelectItem value="font-normal">Normal</SelectItem>
            <SelectItem value="font-medium">Medium</SelectItem>
            <SelectItem value="font-semibold">Semi Bold</SelectItem>
            <SelectItem value="font-bold">Bold</SelectItem>
            <SelectItem value="font-extrabold">Extra Bold</SelectItem>
            <SelectItem value="font-black">Black</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Toggle
        aria-label="Toggle italic"
        size="sm"
        variant="outline"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        pressed={activeElement?.classList.contains("italic") || false}
        onPressedChange={(pressed) =>
          updateTypography("fontStyle", pressed ? "italic" : "not-italic")
        }
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <ToggleGroup
        type="single"
        variant="outline"
        onValueChange={(value) => updateTypography("textDecoration", value)}
      >
        <ToggleGroupItem value="line-through" aria-label="Toggle line through">
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle strikethrough">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="overline" aria-label="Toggle italic">
          <Underline className="h-4 w-4 rotate-180" />
        </ToggleGroupItem>
      </ToggleGroup>
      {/*  Text align */}
      {showTextAlignControls && (
        <ToggleGroup
          type="single"
          variant="outline"
          value={currentAlign || undefined}
          onValueChange={(value) => setTextAlign(value)}
        >
          <ToggleGroupItem value="text-left" aria-label="Align left">
            <TextAlignStart className="h-4 w-4" />
          </ToggleGroupItem>

          <ToggleGroupItem value="text-center" aria-label="Align center">
            <TextAlignCenter className="h-4 w-4" />
          </ToggleGroupItem>

          <ToggleGroupItem value="text-right" aria-label="Align right">
            <TextAlignEnd className="h-4 w-4" />
          </ToggleGroupItem>

          <ToggleGroupItem value="text-justify" aria-label="Align justify">
            <TextAlignJustify className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      )}
      <Select>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Color" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Color</SelectLabel>
            <SelectItem value="apple">Color 1</SelectItem>
            <SelectItem value="banana">Color 2</SelectItem>
            <SelectItem value="blueberry">Color 3</SelectItem>
            <SelectItem value="grapes">Color 4</SelectItem>
            <SelectItem value="pineapple">Color 5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
