// Script to replace workspace:* with file: references for Vercel deployment
const fs = require('fs');
const path = require('path');

const packages = ['@fountain-quiz/db', '@fountain-quiz/shared'];

function updatePackageJson(filePath) {
  const pkgPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(pkgPath)) return;
  
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  let changed = false;
  
  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      if (version === 'workspace:*') {
        const relativePath = path.relative(
          path.dirname(pkgPath),
          path.join(__dirname, '..', 'packages', dep.replace('@fountain-quiz/', ''))
        ).replace(/\\/g, '/');
        pkg.dependencies[dep] = `file:${relativePath}`;
        changed = true;
      }
    }
  }
  
  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Updated ${filePath}`);
  }
}

// Update web app package.json
updatePackageJson('apps/web/package.json');

