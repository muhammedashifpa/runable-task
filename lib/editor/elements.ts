export type ElementType =
  | "text"
  | "image"
  | "container"
  | "button"
  | "link"
  | "input"
  | "video"
  | "list"
  | "unknown";
export function getElementType(el: HTMLElement): ElementType {
  const tag = el.tagName.toLowerCase();

  // TEXT & HEADINGS
  if (
    [
      "p",
      "span",
      "label",
      "strong",
      "em",
      "small",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "a",
    ].includes(tag)
  )
    return "text";

  // IMAGE & MEDIA
  if (tag === "img") return "image";
  if (tag === "video") return "video";

  // CONTAINER / LAYOUT ELEMENTS
  if (
    ["div", "section", "header", "footer", "article", "main", "aside"].includes(
      tag
    )
  )
    return "container";

  // BUTTONS & LINKS
  if (tag === "button") return "button";
  if (tag === "a") return "link";

  // FORMS
  if (["input", "textarea", "select"].includes(tag)) return "input";

  // LISTS
  if (["ul", "ol", "li"].includes(tag)) return "list";

  return "unknown";
}
