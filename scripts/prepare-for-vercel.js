// Script to replace workspace:* with file: references for Vercel deployment
const fs = require('fs');
const path = require('path');

function updatePackageJson(filePath) {
  const pkgPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(pkgPath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }
  
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  let changed = false;
  
  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      if (version === 'workspace:*') {
        const packageName = dep.replace('@fountain-quiz/', '');
        const relativePath = path.relative(
          path.dirname(pkgPath),
          path.join(__dirname, '..', 'packages', packageName)
        ).replace(/\\/g, '/');
        pkg.dependencies[dep] = `file:${relativePath}`;
        changed = true;
        console.log(`  ${dep}: workspace:* -> file:${relativePath}`);
      }
    }
  }
  
  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✓ Updated ${filePath}`);
  } else {
    console.log(`- No changes needed for ${filePath}`);
  }
}

console.log('Converting workspace:* to file: references...');
updatePackageJson('apps/web/package.json');
updatePackageJson('packages/shared/package.json');
console.log('Done!');

