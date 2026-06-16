const fs = require('fs');

// 1. Root package.json
const rootPkg = {
  name: "algo-flow-monorepo",
  version: "1.0.0",
  private: true,
  scripts: {
    "dev": "concurrently \"npm run dev --prefix client\" \"npm run dev --prefix server\"",
    "install-all": "npm install && npm install --prefix client && npm install --prefix server"
  },
  dependencies: {
    "concurrently": "^8.2.2"
  }
};
fs.writeFileSync('package.json', JSON.stringify(rootPkg, null, 2));

// 2. Client package.json
const clientPkgStr = fs.readFileSync('client/package.json', 'utf8');
const clientPkg = JSON.parse(clientPkgStr);
clientPkg.name = "algo-flow-client";
delete clientPkg.scripts.dev;
clientPkg.scripts.dev = "vite";
delete clientPkg.dependencies.express;
delete clientPkg.dependencies.cors;
delete clientPkg.dependencies.dotenv;
delete clientPkg.dependencies['@google/genai'];
fs.writeFileSync('client/package.json', JSON.stringify(clientPkg, null, 2));

// 3. Server package.json
const serverPkgStr = fs.readFileSync('server/package.json', 'utf8');
const serverPkg = JSON.parse(serverPkgStr);
serverPkg.name = "algo-flow-server";
serverPkg.scripts = {
  "dev": "node src/server.js",
  "start": "node src/server.js"
};
serverPkg.dependencies = {
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "@google/genai": "^0.1.0"
};
serverPkg.devDependencies = {};
fs.writeFileSync('server/package.json', JSON.stringify(serverPkg, null, 2));

console.log("Package files updated successfully!");
