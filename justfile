default: build

install:
    bun install

build:
    bun run build

dev:
    bun run dev

release version:
    bun run build
    bun -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.version='{{version}}';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n')"
    git add dist/ package.json
    git commit -m "release: v{{version}}"
    git tag "v{{version}}"
    git push && git push --tags
