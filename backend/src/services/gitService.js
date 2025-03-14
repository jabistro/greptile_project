const simpleGit = require('simple-git');

class GitService {
    constructor() {
        this.git = simpleGit();
    }

    async getCommits(repositoryUrl) {
        if (!repositoryUrl || typeof repositoryUrl !== 'string') {
            throw new Error('Invalid repository URL');
        }

        try {
            const commits = await this.git.listRemote([repositoryUrl]);

            if (!commits.refs) {
                console.error(`No commit references found for repository: ${repositoryUrl}`);
                return [];
            }

            return commits.refs.map(ref => ({
                hash: ref.hash,
                message: ref.name,
                author: ref.name,
                date: new Date()
            }));
        } catch (error) {
            console.error('Error fetching commits from Git repository:', error.message);
            throw new Error(`Failed to fetch commits from repository: ${repositoryUrl}`);
        }
    }
}

module.exports = new GitService();
