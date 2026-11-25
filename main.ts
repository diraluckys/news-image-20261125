// main.ts — news-image-20261125 entry program (Node 22, stdlib only, no network).
// The newspaper image is entry.png in this repo; this program copies it to
// the output directory as entry.png, byte for byte.
// Determinism: the copy is a pure byte copy of a fixed asset, so every run
// writes identical output. The size check below guards against a truncated
// or partial write — if the destination size differs from the source, the
// run fails loudly instead of submitting a corrupt image.
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

if (!existsSync(source)) {
  throw new Error(`entry.png not found in ${repoDir}`);
}
mkdirSync(outDir, { recursive: true });
const destination = join(outDir, "entry.png");
copyFileSync(source, destination);

// Guard: the copied file must be exactly as large as the source image.
const sourceSize = statSync(source).size;
const destSize = statSync(destination).size;
if (destSize !== sourceSize) {
  throw new Error(
    `entry.png copy incomplete: wrote ${destSize} bytes, expected ${sourceSize}`,
  );
}
