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

  console.log("Postbuild: successfully generated .nojekyll, index.html, and resilient 404.html in out/");
}
