import fs from "fs";
import path from "path";

const outDir = path.resolve("out");

if (fs.existsSync(outDir)) {
  // 1. Create .nojekyll
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

  // 2. Create root index.html redirecting to ./en/
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

  // 3. Ensure 404.html exists at root of out/
  const notFoundPath = path.join(outDir, "404", "index.html");
  if (fs.existsSync(notFoundPath)) {
    fs.copyFileSync(notFoundPath, path.join(outDir, "404.html"));
  }

  console.log("Postbuild: successfully generated .nojekyll, index.html, and 404.html in out/");
}
