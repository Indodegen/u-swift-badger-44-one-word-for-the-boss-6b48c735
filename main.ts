import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");

function fail(message) {
  console.error("entry invalid: " + message);
  process.exit(1);
}

if (text.length === 0) fail("entry is empty");
if (text !== text.trim()) fail("entry has leading or trailing whitespace");
if (/\s/.test(text)) fail("entry must be a single word with no whitespace");
if (/[\u0000-\u001F\u007F]/.test(text)) fail("entry contains a control character");
if (/[\u200B\u200C\u200D\uFEFF\uFFFD]/.test(text)) fail("entry contains a forbidden invisible character");
if (!/\p{L}/u.test(text)) fail("entry must contain a letter");
if (!/^\p{L}+$/u.test(text)) fail("entry must contain only letters (no digits, punctuation, or symbols)");
const length = [...text].length;
if (length < 1 || length > 30) fail("entry must be 1 to 30 characters, got " + length);

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) fail("MAKEFUN_OUTPUT_DIR is not set");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
console.log("wrote entry: " + text);
