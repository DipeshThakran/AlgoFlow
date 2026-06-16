const fs = require('fs');
const serverPkgStr = fs.readFileSync('server/package.json', 'utf8');
const serverPkg = JSON.parse(serverPkgStr);
serverPkg.dependencies['@google/genai'] = "*";
fs.writeFileSync('server/package.json', JSON.stringify(serverPkg, null, 2));
