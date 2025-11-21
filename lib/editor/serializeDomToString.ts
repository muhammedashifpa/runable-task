// utils/serializeDomToJsx.ts
const EDITOR_SKIP_CLASSES = [
  "editor-overlay",
  "editor-selection-box",
  "cursor-overlay",
  "editor-ignore",
];

function escapeText(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function shouldSkipElement(el: HTMLElement) {
  return EDITOR_SKIP_CLASSES.some((cls) => el.classList.contains(cls));
}

function serializeAttributes(el: HTMLElement) {
  const attrs: string[] = [];

  for (const attr of Array.from(el.attributes)) {
    const name = attr.name;
    const value = attr.value;

    // skip editor / runtime attributes
    if (
      name === "contenteditable" ||
      name.startsWith("data-editor") ||
      name.startsWith("_react") ||
      name === "style"
    ) {
      continue;
    }

    // convert class → className
    if (name === "class") {
      if (value.trim() !== "")
        attrs.push(`className="${value.replace(/"/g, '\\"')}"`);
      continue;
    }

    // data attributes (you may keep or remove)
    if (name.startsWith("data-")) {
      attrs.push(`${name}="${value.replace(/"/g, '\\"')}"`);
      continue;
    }

    // boolean attributes
    if (value === "") {
      attrs.push(`${name}`);
      continue;
    }

    attrs.push(`${name}="${value.replace(/"/g, '\\"')}"`);
  }

  return attrs.join(" ");
}

export function serializeElementToJsx(
  el: HTMLElement,
  indent = 2,
  level = 0
): string {
  // Skip internal editor elements entirely
  if (shouldSkipElement(el)) return "";

  const pad = " ".repeat(level * indent);
  const tag = el.tagName.toLowerCase();

  // Text-only leaf node
  if (
    el.childNodes.length === 1 &&
    el.childNodes[0].nodeType === Node.TEXT_NODE
  ) {
    const text = escapeText(el.textContent || "");
    const attrs = serializeAttributes(el);
    const attrStr = attrs ? " " + attrs : "";
    return `${pad}<${tag}${attrStr}>${text}</${tag}>`;
  }

  const attrs = serializeAttributes(el);
  const attrStr = attrs ? " " + attrs : "";

  const children: string[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const txt = (child.textContent || "").trim();
      if (txt) children.push(pad + " ".repeat(indent) + escapeText(txt));
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const jsx = serializeElementToJsx(
        child as HTMLElement,
        indent,
        level + 1
      );
      if (jsx.trim() !== "") children.push(jsx);
    }
  }

  if (children.length === 0) return `${pad}<${tag}${attrStr} />`;

  return `${pad}<${tag}${attrStr}>\n${children.join("\n")}\n${pad}</${tag}>`;
}

// ------------------------
// NEW: Skip wrapper div
// ------------------------
export function serializeRootToString(wrapper: HTMLElement) {
  // Serialize only the REAL component (first child)
  const componentRoot = wrapper.firstElementChild as HTMLElement;

  if (!componentRoot) {
    throw new Error("Component root not found in editor wrapper");
  }

  return serializeElementToJsx(componentRoot, 2, 0);
}
