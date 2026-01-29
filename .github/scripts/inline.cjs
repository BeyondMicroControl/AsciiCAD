const fs = require("fs");
const path = require("path");

// Find repo root by stripping everything after "/.github"
const marker = `${path.sep}.github${path.sep}`;
const idx = __dirname.lastIndexOf(marker);
const repoRoot = idx >= 0 ? __dirname.slice(0, idx) : path.resolve(__dirname, "..");

const srcHtmlPath = path.join(repoRoot, "index.html");
const outDir = path.join(repoRoot, "dist");
const outHtmlPath = path.join(outDir, "AsciiCAD.html");

function readUtf8(p) {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing file: ${p}`);
  }
  return fs.readFileSync(p, "utf8");
}

function isRemote(url) {
  return /^(https?:)?\/\//i.test(url) || /^data:/i.test(url);
}

function inlineBuild(html) {
  // Inline stylesheet links
  const linkRe = /<link\b[^>]*\brel\s*=\s*["']stylesheet["'][^>]*>/gi;
  html = html.replace(linkRe, (tag) => {
    const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) return tag;

    const href = hrefMatch[1].trim();
    if (isRemote(href)) return tag;

    const cssPath = path.join(repoRoot, href);
    const css = readUtf8(cssPath);
    return `<style>\n${css}\n</style>`;
  });

  // Inline scripts with src=
  const scriptRe =
    /<script\b([^>]*)\bsrc\s*=\s*["']([^"']+)["']([^>]*)>\s*<\/script>/gi;

  html = html.replace(scriptRe, (full, preAttrs, src, postAttrs) => {
    const s = src.trim();
    if (isRemote(s)) return full;

    const jsPath = path.join(repoRoot, s);
    const js = readUtf8(jsPath);

    const attrs = (preAttrs + " " + postAttrs).replace(/\s+/g, " ").trim();
    const cleanedAttrs = attrs.replace(/\bsrc\s*=\s*["'][^"']+["']/i, "").trim();

    return `<script${cleanedAttrs ? " " + cleanedAttrs : ""}>\n${js}\n</script>`;
  });

  return html;
}

function main() {
  console.log("repoRoot   =", repoRoot);
  console.log("srcHtml    =", srcHtmlPath);
  console.log("outDir     =", outDir);
  console.log("outHtml    =", outHtmlPath);

  const srcHtml = readUtf8(srcHtmlPath);
  const built = inlineBuild(srcHtml);

  // Ensure dist exists (and is a directory)
  if (fs.existsSync(outDir) && !fs.lstatSync(outDir).isDirectory()) {
    throw new Error(`'${outDir}' exists but is not a directory.`);
  }
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outHtmlPath, built, "utf8");

  // Confirm the file is really there
  const st = fs.statSync(outHtmlPath);
  console.log(`Wrote ${outHtmlPath} (${st.size} bytes)`);


  fs.writeFileSync(outHtmlPath, built, "utf8");

  const outStat = fs.statSync(outHtmlPath);
  console.log(`Wrote ${outHtmlPath} (${outStat.size} bytes)`);
  
  if (st.size < 1000) {
    throw new Error("Output looks too small—build likely failed or inlining did nothing.");
  }

}

main();
