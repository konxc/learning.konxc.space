#!/bin/bash

# Script deploy yang kompatibel dengan CI/CD (GitHub Pages, Vercel, Cloudflare)
# Usage: pnpm run deploy

set -e

echo "🚀 Starting deployment to GitHub Pages..."

# Check if we're on the right branch (skip if in CI)
if [ -z "$CI" ]; then
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo "❌ Error: You must be on 'main' branch"
        echo "Current branch: $CURRENT_BRANCH"
        exit 1
    fi
    
    # Check if there are uncommitted changes (skip in CI)
    if ! git diff-index --quiet HEAD --; then
        echo "⚠️  Warning: You have uncommitted changes"
        echo "Please commit or stash them first"
        exit 1
    fi
fi

# Build aplikasi
echo "📦 Building application..."
pnpm run build

# Verify build output
if [ ! -d "build" ]; then
    echo "❌ Error: Build directory not found"
    exit 1
fi

echo "✅ Build completed successfully"
echo "📁 Build directory: build/"
ls -lh build/ | head -10

# Update gh-pages branch
echo "📂 Updating gh-pages branch..."

# Remove existing worktree if exists
if [ -d ".build" ]; then
    echo "Removing existing worktree..."
    git worktree remove .build --force 2>/dev/null || true
fi

# Create new worktree for gh-pages
echo "Creating new worktree..."
git worktree add .build gh-pages

# Copy build files - CLEAN INSTALL (only build files)
echo "📋 Copying build files..."
cd .build

# Remove ALL files except .git
echo "Cleaning existing files..."
find . -mindepth 1 -not -path '*/.git*' -delete || true

# Copy ONLY build directory contents
echo "Copying from build/..."
cp -r ../build/* .
cp ../static/CNAME .

# Commit and push
echo "💾 Committing changes..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
git push origin gh-pages --force

# Cleanup
echo "🧹 Cleaning up..."
cd ..
git worktree remove .build

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://learning.konxc.space"
echo ""
echo "Build output structure:"
ls -la build/
