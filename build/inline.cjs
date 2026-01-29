/* build/inline.cjs
   Create dist/AsciiCAD.html by inlining <link rel="stylesheet" href="...">
   and <script src="..."></script> from index.html.
*/
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const srcHtmlPath = path.join(repoRoot, "index.html");
const outDir = path.join(repoRoot, "dist");
const outHtmlPath = path.join(outDir, "AsciiCAD.html");


function readUtf8(p) {
  return fs.readFileSync(p, "utf8");
}

function isRemote(url) {
  return /^(https?:)?\/\//i.test(url) || /^data:/i.test(url);
}

function inlineBuild(html) {
  // Inline CSS <link rel="stylesheet" href="...">
  // Handles attribute order variations (href before rel, etc.)
  const linkRe = /<link\b[^>]*\brel\s*=\s*["']stylesheet["'][^>]*>/gi;

  html = html.replace(linkRe, (tag) => {
    // extract href
    const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) return tag;

    const href = hrefMatch[1].trim();
    if (isRemote(href)) return tag;

    const filePath = path.join(repoRoot, href);
    const css = readUtf8(filePath);
    return `<style>\n${css}\n</style>`;
  });

  // Inline JS <script ... src="..."></script>
  // Keeps inline scripts untouched; only replaces those with src=
  const scriptRe = /<script\b([^>]*)\bsrc\s*=\s*["']([^"']+)["']([^>]*)>\s*<\/script>/gi;

  html = html.replace(scriptRe, (_m, preAttrs, src, postAttrs) => {
    const s = src.trim();
    if (isRemote(s)) return _m;

    const filePath = path.join(repoRoot, s);
    const js = readUtf8(filePath);

    // Return a plain script tag (no src), preserving other attributes except src.
    // We keep any attributes around src (type, defer, etc.) except src itself.
    const attrs = (preAttrs + " " + postAttrs).replace(/\s+/g, " ").trim();
    // Remove any leftover src= that might appear oddly
    const cleanedAttrs = attrs.replace(/\bsrc\s*=\s*["'][^"']+["']/i, "").trim();

    return `<script${cleanedAttrs ? " " + cleanedAttrs : ""}>\n${js}\n</script>`;
  });

  return html;
}

function main()
{
  const srcHtml = readUtf8(srcHtmlPath);
  const built = inlineBuild(srcHtml);

   if (fs.existsSync(outDir)) {
     const st = fs.lstatSync(outDir);
     if (!st.isDirectory())
     {
       fs.unlinkSync(outDir);            // remove file/symlink
       fs.mkdirSync(outDir, { recursive: true });
       fs.writeFileSync(outHtmlPath, built, "utf8");
       console.log(`Wrote ${outHtmlPath}`);
     }
   } else {
     fs.mkdirSync(outDir, { recursive: true });
   }


  console.log(`Wrote ${path.relative(repoRoot, outHtmlPath)}`);
}

main();
