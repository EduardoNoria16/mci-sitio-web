const { execSync } = require('child_process');
try {
  const stdout = execSync('unzip -l public/codigo-polycovers.zip');
  console.log(stdout.toString());
} catch (e) {
  console.error("Exec failed", e.message);
}
