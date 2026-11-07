const COLOR_PRESETS: Record<string, string> = {
  "dusty pink": "#C9827E",
  "rose deep": "#9B625F",
  ivory: "#FBF7F3",
  charcoal: "#342A28",
  putih: "#FFFFFF",
  white: "#FFFFFF",
  hitam: "#000000",
  black: "#000000",
  pink: "#F8C8D8",
  sage: "#B2AC88",
  biru: "#7AA2C4",
  blue: "#7AA2C4",
  merah: "#D9534F",
  red: "#D9534F",
  hijau: "#5B8C5A",
  green: "#5B8C5A",
  kuning: "#F2D16B",
  yellow: "#F2D16B",
  ungu: "#9274B8",
  purple: "#9274B8",
  cokelat: "#8B5E3C",
  coklat: "#8B5E3C",
  brown: "#8B5E3C",
  abu: "#9E9E9E",
  "abu-abu": "#9E9E9E",
  grey: "#9E9E9E",
  gray: "#9E9E9E",
  krem: "#F5E6C8",
  cream: "#F5E6C8",
  navy: "#253858",
  gold: "#D4AF37",
  silver: "#C0C0C0",
};

function normalizeColorName(name: string): string {
  return name.trim().toLocaleLowerCase("id-ID").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
}

export function resolveProductColorHex(name: string): string {
  return COLOR_PRESETS[normalizeColorName(name)] ?? "#C9827E";
}
