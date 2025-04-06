#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import ora from 'ora';
import cliProgress from 'cli-progress';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a multibar container
const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format: ' {bar} | {percentage}% | {value}/{total} | {task}',
  },
  cliProgress.Presets.shades_classic,
);

function capitalizeWords(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(new RegExp(search, 'g'), replace);
  }
  fs.writeFileSync(filePath, content);
}

function copyDirectory(src, dest, progressBar) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  const excludeDirs = ['node_modules', '.turbo', 'dist'];
  let processed = 0;

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (excludeDirs.includes(entry.name)) {
      processed++;
      progressBar.update(processed);
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, progressBar);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }

    processed++;
    progressBar.update(processed);
  }
}

function updatePackageJson(packagePath, options, processSpinner) {
  try {
    const { name: packageName, description, author } = options;
    processSpinner.text = 'Updating package.json...';
    const packageJsonPath = path.join(packagePath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    packageJson.name = `@corebits/${packageName}`;
    packageJson.description = description ?? `CoreBits ${capitalizeWords(packageName)} package`;
    packageJson.repository.directory = `packages/${packageName}`;
    packageJson.private = undefined;

    if (author) {
      packageJson.author = author;
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    processSpinner.text = 'Successfully updated package.json';
  } catch (error) {
    processSpinner.fail(chalk.red('Failed to update package.json: ' + error.message));
    console.error(chalk.red(error.stack));
    process.exit(1);
  }
}

function updateReadme(packagePath, options, processSpinner) {
  try {
    const { name: packageName } = options;
    processSpinner.text = 'Updating README.md...';
    const readmePath = path.join(packagePath, 'README.md');

    replaceInFile(readmePath, [
      ['{{@package-name}}', `@corebits/${packageName}`],
      ['{{package-name}}', packageName],
      ['{{Package Name}}', capitalizeWords(packageName)],
      ['{{package name}}', packageName.split('-').join(' ')],
    ]);

    processSpinner.text = 'Successfully updated README.md';
  } catch (error) {
    processSpinner.fail(chalk.red('Failed to update README.md: ' + error.message));
    console.error(chalk.red(error.stack));
    process.exit(1);
  }
}

async function createPackage(options) {
  options.name = options.name.trim();
  const { name: packageName, skipInstall } = options;

  const rootDir = path.resolve(__dirname, '..');
  const templateDir = path.join(rootDir, 'packages', 'template');
  const newPackageDir = path.join(rootDir, 'packages', packageName);

  console.log(chalk.blue('\n📦 Creating new package...'));

  // Validation spinner
  const validateSpinner = ora('Validating package configuration...').start();

  // Check if package name is valid
  if (!/^[a-z0-9-]+$/.test(packageName)) {
    validateSpinner.fail(chalk.red('Package name can only contain lowercase letters, numbers, and hyphens'));
    process.exit(1);
  }

  // Check if template directory exists
  if (!fs.existsSync(templateDir)) {
    validateSpinner.fail(chalk.red(`Template directory '${templateDir}' does not exist`));
    process.exit(1);
  }

  // Check if package already exists
  if (fs.existsSync(newPackageDir)) {
    validateSpinner.fail(chalk.red(`Package '${packageName}' already exists`));
    process.exit(1);
  }

  validateSpinner.succeed(chalk.green('Validation completed'));

  // Copy files with progress bar
  const copySpinner = ora('Copying template files...').start();
  const entries = fs.readdirSync(templateDir, { withFileTypes: true });
  const copyBar = multibar.create(entries.length, 0, { task: 'Copying files' });

  copyDirectory(templateDir, newPackageDir, copyBar);
  copySpinner.succeed(chalk.green('Template files copied'));

  // Process files with progress bar
  const processSpinner = ora('Processing files...').start();

  updatePackageJson(newPackageDir, options, processSpinner);

  updateReadme(newPackageDir, options, processSpinner);

  processSpinner.succeed(chalk.green('Files processed'));

  // Install dependencies if needed
  if (!skipInstall) {
    const installSpinner = ora('Installing dependencies...').start();
    try {
      execSync('pnpm install', { stdio: 'pipe', cwd: rootDir });
      installSpinner.succeed(chalk.green('Dependencies installed'));
    } catch (error) {
      installSpinner.fail(chalk.red('Failed to install dependencies: ' + error.message));
      console.error(chalk.red(error.stack));
      process.exit(1);
    }
  }

  // Stop all progress bars
  multibar.stop();

  console.log(chalk.green(`\n✨ Package '${chalk.bold(`@corebits/${packageName}`)}' created successfully!\n`));
}

// Parse command line arguments using yargs
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --name <package-name> [options]')
  .option('name', {
    alias: 'n',
    describe: 'Name of the new package',
    type: 'string',
    demandOption: true,
  })
  .option('description', {
    alias: 'd',
    describe: 'Package description',
    type: 'string',
  })
  .option('author', {
    alias: 'a',
    describe: 'Package author',
    type: 'string',
  })
  .option('skip-install', {
    alias: 's',
    describe: 'Skip running pnpm install after creating the package',
    type: 'boolean',
    default: false,
  })
  .example('$0 --name my-package', 'Create a new package named my-package')
  .example('$0 -n my-package -d "My awesome package" -a "John Doe"', 'Create a new package with description and author')
  .check((argv) => {
    if (!/^[a-z0-9-]+$/.test(argv.name)) {
      throw new Error('Package name can only contain lowercase letters, numbers, and hyphens');
    }
    return true;
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .wrap(null)
  .parseSync();

// Handle async operations
createPackage(argv).catch((error) => {
  console.error(chalk.red('\n❌ Error:', error.stack));
  process.exit(1);
});
