#!/bin/bash

# Treasure Finder - Initialize Git Repository
# This script helps you quickly set up version control for your Chrome extension

echo "💎 Initializing Treasure Finder Git Repository..."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   https://git-scm.com/downloads"
    exit 1
fi

# Initialize git repository
echo "🔄 Initializing git repository..."
git init

# Add all files
echo "📁 Adding files to repository..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Treasure Finder Chrome Extension v1.0.0

Features:
- Direct page area selection for precise bug reporting
- JIRA Cloud integration with automatic issue creation  
- Beautiful progress animations and celebrations
- Professional deployment guides for organizations
- Comprehensive user documentation and setup guides"

echo ""
echo "✅ Git repository initialized successfully!"
echo ""
echo "🚀 Next Steps:"
echo "1. Create a new repository on GitHub.com"
echo "2. Add remote origin:"
echo "   git remote add origin https://github.com/yourusername/treasure-finder-extension.git"
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo "4. Create your first release:"
echo "   git tag v1.0.0"
echo "   git push origin v1.0.0"
echo ""
echo "📚 See GITHUB-SETUP-GUIDE.md for detailed instructions!"
echo ""
echo "💎 Happy treasure hunting!"
