type ProductDescriptionProps = {
  description: string;
  fallback: string;
};

const UNIT_PATTERN = /\b(?:oz|ml)\b/i;

function parseDescription(description: string): string[] {
  const parts = description
    .split(/\r?\n|\s+-\s+/)
    .map((part) => part.replace(/^\s*[-•]\s*/, "").trim())
    .filter(Boolean);

  return parts.reduce<string[]>((items, part) => {
    const previous = items.at(-1);
    if (previous && UNIT_PATTERN.test(previous) && UNIT_PATTERN.test(part)) {
      items[items.length - 1] = `${previous} / ${part}`;
    } else {
      items.push(part);
    }
    return items;
  }, []);
}

export function ProductDescription({ description, fallback }: ProductDescriptionProps) {
  const items = parseDescription(description || fallback);
  return <ul className="detail-description">{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>;
}
