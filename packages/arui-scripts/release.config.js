const betaChannelName = process.env.NPM_CHANNEL || 'next';

if (betaChannelName === 'latest') {
    throw new Error('You should not publish latest channel with manual workflow');
}

module.exports = {
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/github',
        '@semantic-release/npm',
    ],
    branches: [
        { name: 'master' },
        { name: '*', channel: betaChannelName, prerelease: true },
        { name: '*/*', channel: betaChannelName, prerelease: '${name.replace(/\\//g, "-")}' },
    ],
    repositoryUrl: 'https://github.com/alfa-laboratory/arui-scripts',
};
