const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const configs = require('../../configs/app-configs');

const extensions = ['ts', 'tsx', 'js', 'jsx'];

const files = [
    configs.serverEntry,
    configs.clientEntry,
    configs.clientPolyfillsEntry
];

function checkFileWithExtensions(filePath, extensions) {
    if (extensions.some(ext => filePath.endsWith(`.${ext}`))) {
        try {
            fs.accessSync(filePath);
            return true;
        }
        catch (err) {}
    }

    for (let i = 0; i < extensions.length; i++) {
        try {
            fs.accessSync(`${filePath}.${extensions[i]}`);
            return true;
        }
        catch (err) {}
    }

    return false;
}

function checkRequiredFiles() {
    const unavailableFilePaths = files
        .reduce((result, filePath) => {
            if (filePath && !checkFileWithExtensions(filePath, extensions)) {
                result.push(filePath);
            }
            return result;
        }, [])

    if (unavailableFilePaths.length !== 0) {
        console.log(chalk.red('Could not find required files.'));
        const extensionsString = extensions.join(',');
        unavailableFilePaths.forEach(filePath => {
            const dirName = path.dirname(filePath);
            const fileName = path.basename(filePath);
            console.log(chalk.red('  Name: ') + chalk.cyan(`${fileName}.{${extensionsString}}`));
            console.log(chalk.red('  Searched in: ') + chalk.cyan(dirName));
        });
        return false;
    }

    return true;
}


module.exports = checkRequiredFiles;
