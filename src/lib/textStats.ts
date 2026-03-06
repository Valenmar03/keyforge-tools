/**
 * Shared text statistics for Word Counter and Character Counter tools.
 */
export function getTextStats(text: string) {
  const lines = text ? text.split(/\r?\n/).length : 0;
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const paragraphs = text
    ? text
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0).length
    : 0;
  const chars = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;

  return {
    words,
    lines,
    paragraphs,
    chars,
    charsWithoutSpaces,
  };
}
