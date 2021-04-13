// Do this as the first thing so that any code reading it knows the right env.

/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */
import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import checkRequiredFiles from '../util/check-required-files';
import configs from '../../configs/app-configs';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.BROWSERSLIST_CONFIG = process.env.BROWSERSLIST_CONFIG || require.resolve('../../../.browserslistrc');
if (!checkRequiredFiles()) {
    process.exit(1);
}

if (fs.pathExistsSync(configs.serverOutputPath)) {
    fs.removeSync(configs.serverOutputPath);
}

const compileServer = spawn('node', [path.join(__dirname, './server')], { stdio: 'inherit' });
const compileClient = spawn('node', [path.join(__dirname, './client')], { stdio: 'inherit' });

const onProcessExit = (code: number) => {
    if (code !== 0) {
        compileServer.kill();
        compileClient.kill();
        process.exit(code);
    }
};

compileClient.on('error', onProcessExit);
compileServer.on('error', onProcessExit);
compileServer.on('close', onProcessExit);
compileClient.on('close', onProcessExit);
