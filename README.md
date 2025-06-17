# Create Aether CMS

Create Aether CMS projects with no build configuration and seamless update capabilities.

## Quick Overview

```bash
npx create-aether-cms my-cms-site
cd my-cms-site
npm start
```

Then open [http://localhost:8080](http://localhost:8080) to see your site.

When you're ready to deploy to production, create a static build with `npm run build`.

## Creating a Project

### Basic Installation

```bash
npx create-aether-cms my-cms-site
```

### Version-Specific Installation

Install a specific version, tag, or commit:

```bash
# Install specific version
npx create-aether-cms my-blog --version v1.0.0

# Install specific git tag
npx create-aether-cms my-blog --tag stable

# Install specific commit
npx create-aether-cms my-blog --hash abc1234

# Show all available options
npx create-aether-cms --help
```

### Alternative Package Managers

```bash
# Using npm init
npm init aether-cms my-cms-site

# Using yarn create
yarn create aether-cms my-cms-site
```

This will create a directory called `my-cms-site` inside the current folder.  
Inside that directory, it will generate the initial project structure and install the dependencies.

```txt
my-cms-site/
├── README.md
├── node_modules/
├── package.json
├── package-lock.json
├── .gitignore
├── .gitattributes           # ← NEW: Conflict-free updates
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
│   └── js/                  # ← CONTAINS: New Update utilities
└── content/
    ├── data/
    │   └── settings.json    # ← Enhanced with update preferences
    ├── themes/
    └── uploads/
```

No configuration or complicated folder structures. Just the files you need to build your site.

## Requirements

-   Node.js 18.0.0 or later
-   npm 8.6.0 or later
-   Git (for version targeting and updates)
-   macOS, Windows, and Linux are supported

## Advantages Over Traditional npm Installation

Using `create-aether-cms` offers several key benefits:

1. **Direct Code Access**: All CMS code is directly in your project directory (not in node_modules)
2. **Easier Customization**: Modify any file without ejecting or complex overrides
3. **Seamless Updates**: Automated conflict-free updates with your customizations preserved
4. **Version Control**: Install any specific version, tag, or commit
5. **Complete Application**: Creates a fully functional project in one command
6. **Modern Defaults**: Follows modern JavaScript practices with ESM support

## What Happens During Installation

When you run `create-aether-cms`, it:

1. **Clones the Repository**: Downloads the complete Aether CMS codebase
2. **Version Targeting**: Switches to your specified version (if provided)
3. **Git Configuration**: Sets up remotes and conflict-free update system:
    - `upstream` points to the original Aether CMS repo (for updates)
    - `origin` can be set to your own repository (optional)
4. **Project Customization**: Updates package.json with your project details
5. **Update System**: Creates helper scripts and configuration for seamless updates
6. **Dependency Installation**: Installs all required npm packages
7. **Initialization Commit**: Creates a commit marking your project start

## Update System

Your project includes a powerful update system that preserves your customizations while applying upstream improvements.

### Check for Updates

```bash
# Using npm script (recommended)
npm run check-updates

# Using CLI directly
node assets/js/check-updates.js

# Using git directly
git fetch upstream
git log HEAD..upstream/main --oneline  # See what's new
```

### Apply Updates

```bash
# Automated update (preserves your settings)
npm run update-aether

# Manual git approach
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

The update system automatically preserves your customizations:

✅ **Always Protected**:

-   Your project name and version
-   Environment variables (`.env`)
-   Content and uploads (`/content/`)
-   Custom settings (`settings.json`)
-   Git ignore rules (`.gitignore`)

✅ **Intelligently Merged**:

-   New features and bug fixes
-   Security updates
-   Performance improvements
-   New dependencies

⚠️ **May Require Attention**:

-   Core files you've modified (will show merge conflicts)
-   Changes to the default theme

## Version Management

### Available Options

| Option      | Description                  | Example            |
| ----------- | ---------------------------- | ------------------ |
| `--version` | Install specific version tag | `--version v1.2.0` |
| `--tag`     | Install specific git tag     | `--tag stable`     |
| `--hash`    | Install specific commit      | `--hash abc1234`   |

### Installation Metadata

Each installation stores metadata for better update management:

```json
{
    "aetherCMS": {
        "templateName": "aether-cms",
        "installedVersion": "v1.0.0",
        "installedAt": "2025-01-15T10:30:00.000Z",
        "installOptions": {
            "version": "v1.0.0",
            "tag": null,
            "hash": null
        }
    }
}
```

## Setting Up Your Own Repository

During installation, you can optionally connect to your own Git repository:

```bash
# During installation, when prompted:
# "Connect to your own Git repository? (y/n): y"
# "Repository URL: https://github.com/YOUR_USERNAME/your-project.git"

# Or add it later:
git remote add origin https://github.com/YOUR_USERNAME/your-project.git
git push -u origin main
```

## Advanced Git Configuration

The installer automatically configures Git for optimal update handling:

-   **Conflict Resolution**: Uses `.gitattributes` to prevent conflicts on user files
-   **Remote Management**: Properly configured upstream for updates
-   **Branch Strategy**: Creates a clean main branch for your project

## CLI Reference

```bash
# Basic usage
npx create-aether-cms <project-name> [options]

# Options
--version, -v <version>   Install specific version (e.g., v1.2.0)
--tag, -t <tag>          Install specific git tag (e.g., stable)
--hash, --commit <hash>  Install specific commit hash
--help, -h               Show help message

# Examples
npx create-aether-cms my-blog
npx create-aether-cms my-blog --version v1.0.0
npx create-aether-cms my-blog --tag stable
npx create-aether-cms my-blog --hash abc1234
```

## Troubleshooting

### Update Issues

If updates fail, the system automatically creates a backup:

```bash
# Check available branches
git branch -a

# Restore from backup if needed
git checkout backup-[timestamp]
git checkout main
git reset --hard backup-[timestamp]
```

### Manual Update Recovery

```bash
# Reset to clean state
git fetch upstream
git reset --hard upstream/main

# Restore your settings
git checkout HEAD~1 -- .env package.json content/data/settings.json
```

### Missing Upstream Remote

```bash
# Re-add upstream remote
git remote add upstream https://github.com/LebCit/aether-cms.git
git fetch upstream
```

## Alternative: Fork-Based Approach

For maximum control, you can also fork the repository:

1. Fork https://github.com/LebCit/aether-cms on GitHub
2. Use create-aether-cms with your fork:
    ```bash
    git clone https://github.com/YOUR_USERNAME/aether-cms.git my-site
    cd my-site
    git remote add upstream https://github.com/LebCit/aether-cms.git
    ```

## Learn More

-   [Aether CMS Documentation](https://aether-cms.pages.dev/)
-   [Theme Development Guide](https://aether-cms.pages.dev/documentation/theming/)
-   [API Reference](https://aether-cms.pages.dev/documentation/api-reference/)
-   [Update System Guide](https://aether-cms.pages.dev/documentation/getting-started/update/)

## License

Create Aether CMS is open source software licensed under the **[GNU General Public License version 3.0 or later (GPL-3.0-or-later)](https://www.gnu.org/licenses/gpl-3.0.html)**.  
See the [LICENSE](LICENSE) file for full license details.
