#!/bin/bash
# ============================================================
# PeakRoutine — setup.sh
# Run this from the ROOT of your peak-routine-webpage folder
# ============================================================

set -e

echo ""
echo "🚀 PeakRoutine UI Upgrade — Setup Script"
echo "==========================================="
echo ""

# 1. Check we're in the right directory
if [ ! -f "index.html" ]; then
  echo "❌ ERROR: Run this script from your peak-routine-webpage root folder."
  echo "   cd path/to/peak-routine-webpage && bash setup.sh"
  exit 1
fi

echo "✅ Detected project root: $(pwd)"
echo ""

# 2. Backup existing files
echo "📦 Step 1: Backing up existing files..."
mkdir -p _backup
cp index.html _backup/index.html.bak 2>/dev/null && echo "  • Backed up index.html" || echo "  • index.html not found (skipping)"
cp css/style.css _backup/style.css.bak 2>/dev/null && echo "  • Backed up style.css" || true
cp css/animations.css _backup/animations.css.bak 2>/dev/null && echo "  • Backed up animations.css" || true
cp js/main.js _backup/main.js.bak 2>/dev/null && echo "  • Backed up main.js" || true
echo "  ✅ Backups saved to ./_backup/"
echo ""

# 3. Create css directory if needed
mkdir -p css js

# 4. Copy new CSS files
echo "🎨 Step 2: Installing new CSS files..."

# theme.css — design tokens & base
cat > css/theme.css << 'THEME_CSS'
/* PLACEHOLDER — replace with theme.css content from Claude */
/* See: css/theme.css in the files provided */
THEME_CSS

# navbar.css
cat > css/navbar.css << 'NAVBAR_CSS'
/* PLACEHOLDER — replace with navbar.css content from Claude */
NAVBAR_CSS

# sections.css
cat > css/sections.css << 'SECTIONS_CSS'
/* PLACEHOLDER — replace with sections.css content from Claude */
SECTIONS_CSS

echo "  ✅ CSS file placeholders created (paste actual content from Claude)"
echo ""

# 5. Copy new JS
echo "⚡ Step 3: Installing new JS..."
cat > js/main-v2.js << 'MAIN_JS'
/* PLACEHOLDER — replace with main-v2.js content from Claude */
MAIN_JS
echo "  ✅ js/main-v2.js placeholder created"
echo ""

# 6. Replace index.html
echo "📄 Step 4: Replacing index.html..."
echo "  ⚠️  index.html needs to be replaced manually with the new version from Claude."
echo "  (Old version safely backed up at _backup/index.html.bak)"
echo ""

# 7. Keep original CSS files intact for about/privacy/terms pages
echo "🔒 Step 5: Preserving original CSS for other pages..."
echo "  • css/style.css — KEPT (used by about.html, privacy-policy.html, terms-conditions.html)"
echo "  • css/animations.css — KEPT"
echo "  • js/main.js — KEPT (old, not needed but kept for safety)"
echo ""

# 8. Final summary
echo "════════════════════════════════════════════"
echo "✅ SETUP COMPLETE"
echo "════════════════════════════════════════════"
echo ""
echo "📋 NEXT STEPS (Manual):"
echo ""
echo "1️⃣  PASTE CSS content:"
echo "   → Open css/theme.css    → paste theme.css content from Claude"
echo "   → Open css/navbar.css   → paste navbar.css content from Claude"
echo "   → Open css/sections.css → paste sections.css content from Claude"
echo ""
echo "2️⃣  PASTE JS content:"
echo "   → Open js/main-v2.js → paste main-v2.js content from Claude"
echo ""
echo "3️⃣  REPLACE index.html:"
echo "   → Copy the new index.html from Claude and save it to your root"
echo "   → Your backup is at: _backup/index.html.bak"
echo ""
echo "4️⃣  TEST locally:"
echo "   → Open index.html in browser (or use Live Server in VS Code)"
echo "   → Check navbar, hero phones, animations, pricing toggle"
echo "   → Test contact form + payment buttons"
echo ""
echo "5️⃣  DEPLOY:"
echo "   → git add . && git commit -m 'feat: premium UI upgrade'"
echo "   → git push origin main"
echo ""
echo "💡 TIP: Use VS Code Live Server extension for local preview"
echo ""