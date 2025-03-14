const fs = require('fs');
const path = require('path');

class ChangelogModel {
    constructor() {
        this.dataDir = path.join(__dirname, '../../data');
        this.dataFile = path.join(this.dataDir, 'changelogs.json');
        this.initializeDataFile();
    }

    initializeDataFile() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        if (!fs.existsSync(this.dataFile)) {
            fs.writeFileSync(this.dataFile, JSON.stringify([]));
        }
    }

    getAll() {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        return JSON.parse(data);
    }

    create(version, entries, repositoryUrl) {
        const changelogs = this.getAll();
        
        const versionExists = changelogs.some(changelog => 
            changelog.version === version && changelog.repositoryUrl === repositoryUrl
        );

        if (versionExists) {
            throw new Error(`Version ${version} already exists for this repository. Please use a different version number.`);
        }

        const changelog = {
            version,
            entries,
            repositoryUrl,
            createdAt: new Date().toISOString()
        };

        changelogs.push(changelog);
        fs.writeFileSync(this.dataFile, JSON.stringify(changelogs, null, 2));
        return changelog;
    }

    delete(version, repositoryUrl) {
        const changelogs = this.getAll();
        const index = changelogs.findIndex(log => 
            log.version === version && log.repositoryUrl === repositoryUrl
        );

        if (index === -1) {
            throw new Error('Changelog not found');
        }

        changelogs.splice(index, 1);
        fs.writeFileSync(this.dataFile, JSON.stringify(changelogs, null, 2));
    }
}

module.exports = ChangelogModel;