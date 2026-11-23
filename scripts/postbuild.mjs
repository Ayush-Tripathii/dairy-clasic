import fs from "fs";
import path from "path";

const outDir = path.resolve("out");

if (fs.existsSync(outDir)) {
  // 1. Create .nojekyll
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

  // 2. Create root index.html redirecting cleanly to ./en/
  const redirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dairy Classic</title>
  <meta http-equiv="refresh" content="0; url=./en/">
  <script>
    window.location.replace("./en/" + window.location.search + window.location.hash);
  </script>
</head>
<body>
  <p>Redirecting to <a href="./en/">Dairy Classic</a>...</p>
</body>
</html>`;
  fs.writeFileSync(path.join(outDir, "index.html"), redirectHtml);

  // 3. Smart 404.html: Auto-heals malformed URLs (like &alias=...) back to /en/
  const notFoundPath = path.join(outDir, "404", "index.html");
  let notFoundContent = fs.existsSync(notFoundPath)
    ? fs.readFileSync(notFoundPath, "utf-8")
    : redirectHtml;

  const recoveryScript = `
  <script>
    (function() {
      var href = window.location.href;
      if (href.indexOf('&alias') !== -1 || href.indexOf('%26alias') !== -1) {
        window.location.replace('/dairy-clasic/en/');
      }
    })();
  </script>
`;
  if (notFoundContent.includes("<head>")) {
    notFoundContent = notFoundContent.replace("<head>", "<head>" + recoveryScript);
  } else {
    notFoundContent = recoveryScript + notFoundContent;
  }
  fs.writeFileSync(path.join(outDir, "404.html"), notFoundContent);

  // 4. Prefix all public assets (/images/, /videos/) with /dairy-clasic in exported files
  function patchAssetPaths(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        patchAssetPaths(fullPath);
      } else if (/\.(html|js|json|txt|css)$/.test(entry.name)) {
        let content = fs.readFileSync(fullPath, "utf-8");
        const updated = content
          .replace(/(?<!\/dairy-clasic)\/images\//g, "/dairy-clasic/images/")
          .replace(/(?<!\/dairy-clasic)\/videos\//g, "/dairy-clasic/videos/");
        if (updated !== content) {
          fs.writeFileSync(fullPath, updated, "utf-8");
        }
      }
    }
  }
  patchAssetPaths(outDir);

  console.log("Postbuild: successfully generated .nojekyll, index.html, resilient 404.html, and patched asset paths in out/");
}
