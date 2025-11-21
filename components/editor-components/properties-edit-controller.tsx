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
import { Label } from "../ui/label";
interface TypographyEditControllerProps {
  activeElement: HTMLElement | null;
}

export const FONT_WEIGHT_OPTIONS: { label: string; value: string }[] = [
  { label: "Thin", value: "font-thin" },
  { label: "Extra Light", value: "font-extralight" },
  { label: "Light", value: "font-light" },
  { label: "Normal", value: "font-normal" },
  { label: "Medium", value: "font-medium" },
  { label: "Semi Bold", value: "font-semibold" },
  { label: "Bold", value: "font-bold" },
  { label: "Extra Bold", value: "font-extrabold" },
  { label: "Black", value: "font-black" },
];

export const FONT_SIZE_OPTIONS: { label: string; value: string }[] = [
  { label: "Xs", value: "text-xs" },
  { label: "Sm", value: "text-sm" },
  { label: "Base", value: "text-base" },
  { label: "Lg", value: "text-lg" },
  { label: "Xl", value: "text-xl" },
  { label: "2xl", value: "text-2xl" },
  { label: "3xl", value: "text-3xl" },
  { label: "4xl", value: "text-4xl" },
  { label: "5xl", value: "text-5xl" },
  { label: "6xl", value: "text-6xl" },
  { label: "7xl", value: "text-7xl" },
  { label: "8xl", value: "text-8xl" },
  { label: "9xl", value: "text-9xl" },
];

const COLORS: { label: string; value: string }[] = [
  { label: "Default", value: "text-inherit" },
  { label: "Black", value: "text-black" },
  { label: "White", value: "text-white" },

  { label: "Slate", value: "text-slate-500" },
  { label: "Gray", value: "text-gray-500" },
  { label: "Gray 600", value: "text-gray-600" },
  { label: "Gray 700", value: "text-gray-700" },
  { label: "Gray 800", value: "text-gray-800" },
  { label: "Gray 900", value: "text-gray-900" },

  { label: "Zinc", value: "text-zinc-500" },
  { label: "Neutral", value: "text-neutral-500" },
  { label: "Stone", value: "text-stone-500" },

  { label: "Red", value: "text-red-500" },
  { label: "Orange", value: "text-orange-500" },
  { label: "Amber", value: "text-amber-500" },
  { label: "Yellow", value: "text-yellow-500" },

  { label: "Lime", value: "text-lime-500" },
  { label: "Green", value: "text-green-500" },
  { label: "Emerald", value: "text-emerald-500" },

  { label: "Teal", value: "text-teal-500" },
  { label: "Cyan", value: "text-cyan-500" },
  { label: "Sky", value: "text-sky-500" },

  { label: "Blue", value: "text-blue-500" },
  { label: "Indigo", value: "text-indigo-500" },
  { label: "Violet", value: "text-violet-500" },
  { label: "Purple", value: "text-purple-500" },
  { label: "Fuchsia", value: "text-fuchsia-500" },
  { label: "Pink", value: "text-pink-500" },
  { label: "Rose", value: "text-rose-500" },
];
export function PropertiesEditController({
  activeElement,
}: TypographyEditControllerProps) {
  const {
    setTextAlign,
    setFontWeight,
    setFontSize,
    setFontColor,
    currentWeight,
    currentAlign,
    currentFontSize,
    currentFontColor,
    showTextAlignControls,
    updateTypography,
  } = useTypography();

  return (
    // const {typographySettings, setTypographySettings} = useTypographySettings();
    <div className="flex items-center gap-2">
      <Label>Font size</Label>
      <Select value={currentFontSize} onValueChange={(v) => setFontSize(v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Font Size" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Font Size</SelectLabel>

            {FONT_SIZE_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label>Font weight</Label>
      <Select
        value={currentWeight ?? undefined}
        onValueChange={(v) => setFontWeight(v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Font Weight" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Font Weight</SelectLabel>
            {FONT_WEIGHT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
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
      <Select
        value={currentFontColor ?? undefined}
        onValueChange={(v) => setFontColor(v)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Color" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {COLORS.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                {color.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
