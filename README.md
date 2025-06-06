# Create Aether CMS

Create Aether CMS projects with no build configuration.

## Quick Overview

```bash
npx create-aether-cms my-cms-site
cd my-cms-site
npm start
```

Then open [http://localhost:8080](http://localhost:8080) to see your site.

When you're ready to deploy to production, create a static build with `npm run build`.

## Creating a Project

### Option 1: Using npx (recommended)

```bash
npx create-aether-cms my-cms-site
```

### Option 2: Using npm init

```bash
npm init aether-cms my-cms-site
```

### Option 3: Using yarn create

```bash
yarn create aether-cms my-cms-site
```

This will create a directory called `my-cms-site` inside the current folder.  
Inside that directory, it will generate the initial project structure and install the dependencies.

```txt
my-cms-site/
├── README.md
├── node_modules/
├── package.json
├── .gitignore
├── .env
├── index.js
├── core/
│   ├── admin/
│   ├── api/
│   ├── lib/
│   ├── routes/
│   └── utils/
├── assets/
│   ├── css/
│   └── js/
└── content/
    ├── data/
    ├── themes/
    └── uploads/
```

No configuration or complicated folder structures. Just the files you need to build your site.

## Requirements

-   Node.js 18.0.0 or later
-   npm 8.6.0 or later
-   macOS, Windows, and Linux are supported

## Advantages Over Traditional npm Installation

Using `create-aether-cms` offers several key benefits:

1. **Direct Code Access**: All CMS code is directly in your project directory (not in node_modules)
2. **Easier Customization**: Modify any file without ejecting or complex overrides
3. **Simpler Updates**: Use git to pull updates or make custom changes
4. **Complete Application**: Creates a fully functional project in one command
5. **Modern Defaults**: Follows modern JavaScript practices with ESM support

## What Happens During Installation

When you run `create-aether-cms`, it:

1. Clones the Aether CMS repository
2. Sets up the git remotes:
    - `upstream` points to the original Aether CMS repo (for updates)
    - `origin` can be set to your own repository (optional)
3. Creates a new commit marking your project initialization
4. Installs dependencies

## Updating Your Project

Your project maintains a connection to the original Aether CMS repository, making updates straightforward:

### Check for Updates

```bash
git fetch upstream
git log HEAD..upstream/main --oneline  # See what's new
```

### Apply Updates

```bash
# Apply all updates
git merge upstream/main

# Or apply specific updates
git cherry-pick <commit-hash>
```

### Resolve Conflicts

If you've customized core files, you may encounter merge conflicts:

```bash
# After running git merge upstream/main
# Edit files to resolve conflicts, then:
git add .
git commit -m "Resolve merge conflicts"
```

**Note**: The `upstream` remote is automatically configured during project creation, so you don't need to add it manually.

### If You Need to Re-add the Upstream Remote

If for some reason the upstream remote is missing, you can add it:

```bash
# Check existing remotes
git remote -v

# Add upstream if it doesn't exist
git remote add upstream https://github.com/LebCit/aether-cms.git
```

## What's Protected During Updates

✅ **Always Safe** (these are ignored by git):

-   Your content in `/content/data/`
-   Your uploads in `/content/uploads/`
-   Your custom themes (except `/content/themes/default/`)

⚠️ **May Require Attention**:

-   Core files you've modified (will show merge conflicts)
-   Changes to the default theme

## Setting Up Your Own Repository

If you want to push your project to your own GitHub repository:

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/your-project.git
git push -u origin main
```

## Alternative: Fork-Based Approach

For maximum control, you can also fork the repository directly:

1. Fork https://github.com/LebCit/aether-cms on GitHub
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/aether-cms.git my-site`
3. Add upstream: `git remote add upstream https://github.com/LebCit/aether-cms.git`

## Learn More

-   [Aether CMS Documentation](https://aether-cms.pages.dev/)
-   [Theme Development Guide](https://aether-cms.pages.dev/documentation/theming)
-   [API Reference](https://aether-cms.pages.dev/documentation/api-reference)

## License

Create Aether CMS is open source software licensed under the **[GNU General Public License version 3.0 or later (GPL-3.0-or-later)](https://www.gnu.org/licenses/gpl-3.0.html)**.  
See the [LICENSE](LICENSE) file for full license details.
