const express = require('express');
const router = express.Router();
const ChangelogModel = require('../models/changelog');
const AIService = require('../services/aiService');

const changelogModel = new ChangelogModel();

router.post('/generate', async (req, res) => {
  try {
    const { version, commits } = req.body;
    
    if (!version || !commits || !Array.isArray(commits)) {
      return res.status(400).json({
        success: false,
        entries: [],
        error: 'Version and commits array are required'
      });
    }

    try {
      const entries = await AIService.generateChangelog(commits);

      if (!entries || entries.length === 0) {
        return res.status(500).json({
          success: false,
          entries: [],
          error: 'Failed to generate changelog entries'
        });
      }

      res.json({
        success: true,
        entries,
        error: null
      });
    } catch (error) {
      // Handle AI service specific errors
      if (error.message.includes('API quota exceeded')) {
        return res.status(429).json({
          success: false,
          entries: [],
          error: 'AI service quota exceeded. Please try again later.'
        });
      }
      if (error.message.includes('Invalid API key')) {
        return res.status(401).json({
          success: false,
          entries: [],
          error: 'AI service configuration error. Please contact support.'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error generating changelog:', error);
    res.status(500).json({
      success: false,
      entries: [],
      error: 'Failed to generate changelog entries'
    });
  }
});

router.post('/publish', async (req, res) => {
  try {
    const { version, entries, repositoryUrl } = req.body;
    
    if (!version || !entries || !Array.isArray(entries) || !repositoryUrl) {
      return res.status(400).json({
        success: false,
        error: 'Version, entries array, and repository URL are required'
      });
    }

    try {
      const changelog = changelogModel.create(version, entries, repositoryUrl);
      res.json({
        success: true,
        changelog,
        error: null
      });
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error publishing changelog:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish changelog. Please try again.'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const changelogs = changelogModel.getAll();
    res.json({
      success: true,
      changelogs,
      error: null
    });
  } catch (error) {
    console.error('Error fetching changelogs:', error);
    res.status(500).json({
      success: false,
      changelogs: [],
      error: 'Failed to fetch changelogs'
    });
  }
});

router.get('/changelogs/:version', async (req, res) => {
  try {
    const changelog = await ChangelogModel.getByVersion(req.params.version);
    if (!changelog) {
      return res.status(404).json({
        error: 'Changelog not found',
        success: false
      });
    }
    res.json({
      success: true,
      changelog
    });
  } catch (error) {
    console.error('Error fetching changelog version:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch changelog version',
      success: false
    });
  }
});

router.delete('/:version', async (req, res) => {
  try {
    const { version } = req.params;
    const { repositoryUrl } = req.query;

    if (!repositoryUrl) {
      return res.status(400).json({
        success: false,
        error: 'Repository URL is required'
      });
    }

    try {
      changelogModel.delete(version, repositoryUrl);
      res.json({
        success: true,
        error: null
      });
    } catch (error) {
      if (error.message === 'Changelog not found') {
        return res.status(404).json({
          success: false,
          error: 'Changelog not found for this version and repository'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting changelog:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete changelog'
    });
  }
});

module.exports = router;