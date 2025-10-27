#!/bin/bash

# Script deploy manual ke GitHub Pages
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting deployment to GitHub Pages..."

# 1. Build aplikasi
echo "📦 Building application..."
pnpm run build

# 2. Clone branch gh-pages
echo "📂 Preparing gh-pages branch..."
git stash
git checkout gh-pages

# 3. Copy build files
echo "📋 Copying build files..."
rm -rf !(.git|node_modules)
cp -r build/. .

# 4. Commit and push
echo "💾 Committing changes..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin gh-pages

# 5. Kembali ke branch manual
echo "🔄 Switching back to manual branch..."
git checkout manual
git stash pop

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://learning.konxc.space"
