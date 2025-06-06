#!/usr/bin/env node

/**
 * @file Initializes a new Aether CMS project by cloning the GitHub repository.
 * @module create-aether-cms
 */

import { execSync } from "child_process"
import path from "path"
import fs from "fs"
import readline from "readline"

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// Promisify the question method
const question = (query) => new Promise((resolve) => rl.question(query, resolve))

/**
 * Checks the Node.js version and exits if the version is less than 18.
 */
function checkNodeVersion() {
    const currentVersion = process.versions.node
    const majorVersion = parseInt(currentVersion.split(".")[0], 10)

    if (majorVersion < 18) {
        console.error(`Node.js v${currentVersion} is not supported. Please upgrade to Node.js v18 or higher.`)
        process.exit(1)
    }
}

/**
 * Validates the project name.
 * @param {string} projectName - The name to validate
 * @returns {boolean} - Whether the name is valid
 */
function validateProjectName(projectName) {
    // Check if the name is valid for npm
    return /^[a-z0-9-_]+$/i.test(projectName)
}

/**
 * Creates a .env file with initial settings.
 * @param {string} targetPath - The project directory
 */
function createEnvFile(targetPath) {
    const envContent = `PORT=8080
NODE_ENV=development`

    fs.writeFileSync(path.join(targetPath, ".env"), envContent)
    console.log("📄 Created .env file with default settings")
}

/**
 * Updates package.json with the project name.
 * @param {string} targetPath - The project directory
 * @param {string} projectName - The name of the project
 */
function updatePackageJson(targetPath, projectName) {
    const packageJsonPath = path.join(targetPath, "package.json")

    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

        // Update name and reset version
        packageJson.name = projectName
        packageJson.version = "0.1.0"
        packageJson.private = true

        // Add scripts if they don't exist
        packageJson.scripts = packageJson.scripts || {}
        packageJson.scripts.start = packageJson.scripts.start || "node index.js"
        packageJson.scripts.build = packageJson.scripts.build || "node assets/js/generate-static.js --"

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
        console.log("📦 Updated package.json with your project details")
    }
}

/**
 * Creates default content structure.
 * @param {string} targetPath - The project directory
 */
function createDefaultContent(targetPath) {
    // Create content directories
    const contentDirs = [
        "content/data",
        "content/themes",
        "content/uploads/images",
        "content/uploads/documents",
        "content/cache/marketplace",
    ]

    contentDirs.forEach((dir) => {
        const dirPath = path.join(targetPath, dir)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
    })

    // Create default settings file
    const settingsFile = path.join(targetPath, "content/data/settings.json")
    if (!fs.existsSync(settingsFile)) {
        const settingsContent = {
            siteTitle: "My Aether Site",
            siteDescription: "A site built with Aether",
            postsPerPage: 10,
            activeTheme: "default",
            footerCode: "Content in Motion. Powered by Aether.",
        }

        fs.writeFileSync(settingsFile, JSON.stringify(settingsContent, null, 2))
    }

    console.log("📁 Created default content structure")
}

/**
 * setupGitRepository function that preserves git history
 */
async function setupGitRepository(targetPath) {
    try {
        process.chdir(targetPath)

        console.log("🔄 Setting up git repository...")

        // The repository was cloned, so origin already points to the template repo
        // Rename origin to upstream for future updates
        try {
            execSync("git remote rename origin upstream", { stdio: "ignore" })
            console.log("✅ Renamed origin remote to upstream")
        } catch (error) {
            // If rename fails, try the manual approach
            try {
                execSync("git remote remove origin", { stdio: "ignore" })
                execSync("git remote add upstream https://github.com/LebCit/aether-cms.git", { stdio: "ignore" })
                console.log("✅ Set up upstream remote")
            } catch (error2) {
                console.log("⚠️ Could not set up upstream remote:", error2.message)
            }
        }

        // Ask if user wants to create a new origin remote for their own repo
        const answer = await question("Do you want to set up a new git origin for your project? (y/n): ")

        if (answer.toLowerCase() === "y") {
            const repoUrl = await question("Enter your repository URL (or press Enter to skip): ")
            if (repoUrl.trim()) {
                try {
                    execSync(`git remote add origin ${repoUrl.trim()}`, { stdio: "ignore" })
                    console.log("✅ Added new origin remote")
                } catch (error) {
                    console.log("⚠️ Could not add origin remote:", error.message)
                }
            }
        }

        // Create a commit to mark the project initialization
        execSync("git add .", { stdio: "ignore" })
        execSync('git commit -m "Initialize project from Aether CMS template"', { stdio: "ignore" })

        console.log("🔄 Git repository configured with update capabilities")
    } catch (error) {
        console.log("⚠️ Could not set up git repository:", error.message)
    }
}

/**
 * The main function to initialize a new Aether CMS project.
 * @param {string} projectName - The name of the project directory to create.
 */
async function main(projectName) {
    try {
        // Check if the project name is provided
        if (!projectName) {
            console.error("❌ Please specify the project name")
            console.log("Usage: npx create-aether-cms my-cms-site")
            process.exit(1)
        }

        // Validate project name
        if (!validateProjectName(projectName)) {
            console.error("❌ Invalid project name. Use only letters, numbers, hyphens, and underscores.")
            process.exit(1)
        }

        const targetPath = path.resolve(process.cwd(), projectName)

        // Check if the target directory already exists
        if (fs.existsSync(targetPath)) {
            console.error(`❌ The directory ${projectName} already exists.`)
            process.exit(1)
        }

        console.log(`🌳 Creating a new Aether CMS project in ${projectName}...`)

        // Clone the repository
        const repoUrl = "https://github.com/LebCit/aether-cms.git"
        execSync(`git clone ${repoUrl} ${targetPath}`, { stdio: "inherit" })

        // Set up the environment
        createEnvFile(targetPath)
        updatePackageJson(targetPath, projectName)
        createDefaultContent(targetPath)

        // Change to project directory and install dependencies
        process.chdir(targetPath)
        console.log("📦 Installing dependencies (this might take a few minutes)...")
        execSync("npm install", { stdio: "inherit" })

        // Set up Git repository (optional)
        await setupGitRepository(targetPath)

        console.log(`
🎉 Success! Created ${projectName} at ${targetPath}
🚀 Get started with the following commands:

    cd ${projectName}
    npm start

🔑 Default admin credentials:
    Username: admin
    Password: admin

📚 For documentation, visit: https://aether-cms.pages.dev/
    `)
    } catch (error) {
        console.error("❌ Failed to create the project:", error.message)
    } finally {
        rl.close()
    }
}

// Check Node.js version
checkNodeVersion()

// Get the project name from command line arguments and run the main function
main(process.argv[2])
