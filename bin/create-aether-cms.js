#!/usr/bin/env node

/**
 * @file Initializes a new Aether CMS project by cloning the GitHub repository.
 * @module create-aether-cms
 */

import readline from "readline"
import {
    checkNodeVersion,
    parseArguments,
    showHelp,
    validateProjectName,
    validateTarget,
    installProject,
} from "./helpers.js"

// Create readline interface at the top level
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// Promisify the question method
const question = (query) => new Promise((resolve) => rl.question(query, resolve))

/**
 * The main function to initialize a new Aether CMS project.
 */
async function main() {
    try {
        // Parse and validate input
        const options = parseArguments()

        if (options.help) {
            showHelp()
            process.exit(0)
        }

        // Check if the project name is provided
        if (!options.projectName) {
            console.error("❌ Please specify the project name")
            console.log("Usage: npx create-aether-cms my-cms-site")
            process.exit(1)
        }

        // Validate project name
        if (!validateProjectName(options.projectName)) {
            console.error("❌ Invalid project name. Use only letters, numbers, hyphens, and underscores.")
            process.exit(1)
        }

        // Handle target determination and validation
        const targetInfo = determineTarget(options)
        if (targetInfo.target !== "latest") {
            const isValid = await validateTarget(targetInfo.target, targetInfo.targetType)
            if (!isValid) process.exit(1)
        }

        // Execute installation - PASS the question function
        await installProject({
            ...options,
            ...targetInfo,
            question, // Pass the question function to helpers
        })

        console.log("🎉 Installation completed successfully!")
    } catch (error) {
        console.error("❌ Installation failed:", error.message)
        process.exit(1)
    } finally {
        rl.close() // Always close readline interface
    }
}

// TARGET DETERMINATION LOGIC
function determineTarget(options) {
    // Priority: hash > tag > version
    if (options.hash) {
        return { targetType: "hash", target: options.hash }
    }
    if (options.tag) {
        return { targetType: "tag", target: options.tag }
    }
    if (options.version && options.version !== "latest") {
        return { targetType: "version", target: options.version }
    }
    return { targetType: "latest", target: "latest" }
}

// Check Node.js version
checkNodeVersion()

// Run the installation
main().catch(console.error)
