import DOMPurify from "isomorphic-dompurify";

export default function ProductDescription({ description }: { description: string }) {
  // Configure DOMPurify to allow the specific formatting attributes TipTap injects
  const sanitizedDescription = DOMPurify.sanitize(description || "", {
    ADD_ATTR: ["target", "class", "style"], // Preserves Link targets, Tailwind classes, and Text Alignment
  });

  // Optional: If you want links to open in a new tab securely, you can add a hook to DOMPurify
  DOMPurify.addHook("afterSanitizeAttributes", function (node) {
    if ("target" in node) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });

  return (
    <div
      className="
        product-description-container 
        prose prose-sm md:prose-base dark:prose-invert 
        max-w-none 
        wrap-break-word mt-3 
      "
    >
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
    </div>
  );
}
