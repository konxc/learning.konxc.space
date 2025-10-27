#!/bin/bash

# Script deploy manual yang lebih aman
# Usage: pnpm run deploy

set -e

echo "🚀 Starting deployment to GitHub Pages..."

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: You must be on 'main' branch"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "Please commit or stash them first"
    exit 1
fi

# Build aplikasi
echo "📦 Building application..."
pnpm run build

# Update gh-pages branch
echo "📂 Updating gh-pages branch..."

# Create or checkout gh-pages branch di .build subdirectory
git worktree add .build gh-pages 2>/dev/null || git worktree remove .build 2>/dev/null && git worktree add .build gh-pages

# Copy build files ke worktree
echo "📋 Copying build files..."
cd .build
git rm -r . --quiet || true
cp -r ../build/* .
cp ../static/CNAME .

# Commit changes
echo "💾 Committing changes..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
git push origin gh-pages

# Cleanup
echo "🧹 Cleaning up..."
cd ..
git worktree remove .build

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://learning.konxc.space"
