const express = require('express');
const router = express.Router();
const simpleGit = require('simple-git');
const fs = require('fs');

router.get('/commits', async (req, res) => {
    try {
        const repositoryUrl = req.query.repositoryUrl;

        if (!repositoryUrl) {
            return res.status(400).json({
                error: 'Repository URL is required',
                success: false,
                commits: []
            });
        }

        try {
            new URL(repositoryUrl);
        } catch (e) {
            return res.status(400).json({
                error: 'Invalid repository URL format. Please provide a valid Git repository URL.',
                success: false,
                commits: []
            });
        }

        const repoDir = '/tmp/repo';

        if (fs.existsSync(repoDir)) {
            fs.rmSync(repoDir, { recursive: true, force: true });
        }

        const repo = simpleGit();
        try {
            await repo.clone(repositoryUrl, repoDir);
        } catch (error) {
            return res.status(404).json({
                error: 'Unable to access repository. Please verify that the repository exists and is accessible.',
                success: false,
                commits: []
            });
        }

        const commits = await simpleGit(repoDir).log();

        const commitsWithRepo = commits.all.map(commit => ({
            hash: commit.hash,
            message: commit.message,
            author: commit.author_name,
            date: commit.date,
            repository: repositoryUrl
        }));

        res.json({
            success: true,
            commits: commitsWithRepo,
            error: null
        });
    } catch (error) {
        console.error('Error fetching commits:', error);

        const errorMessage = error.message.includes('Authentication failed')
            ? 'Authentication failed. Please check if the repository is private and your credentials are correct.'
            : 'Failed to fetch commits from the repository. Please verify the repository URL and try again.';

        res.status(500).json({
            success: false,
            commits: [],
            error: errorMessage
        });
    }
});

module.exports = router;