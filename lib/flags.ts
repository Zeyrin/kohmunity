/** Country code → flag emoji. Hostelworld uses ISO-2 plus ENG/SCO/WAL/NIR for the UK nations. */
const SUBDIVISIONS: Record<string, string> = { ENG: "gbeng", SCO: "gbsct", WAL: "gbwls" };

export function flag(code: string | null): string {
  if (!code) return "🌍";
  const sub = SUBDIVISIONS[code];
  if (sub) return String.fromCodePoint(0x1f3f4, ...[...sub].map((c) => 0xe0000 + c.charCodeAt(0)), 0xe007f);
  if (code === "NIR") return "🇬🇧";
  if (code.length !== 2) return "🌍";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
