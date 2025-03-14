import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const isValidVersion = (version) => {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
};

const DeveloperTool = () => {
    const [commits, setCommits] = useState([]);
    const [repositoryUrl, setRepositoryUrl] = useState('');
    const [version, setVersion] = useState('');
    const [versionError, setVersionError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedEntries, setGeneratedEntries] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        let timer;
        if (showSuccess) {
            timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [showSuccess]);

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset? This will clear all current information.')) {
            setCommits([]);
            setRepositoryUrl('');
            setVersion('');
            setVersionError('');
            setError(null);
            setGeneratedEntries([]);
            setIsGenerating(false);
            setLoading(false);
        }
    };

    const handleVersionChange = (e) => {
        const newVersion = e.target.value;
        setVersion(newVersion);
        if (newVersion && !isValidVersion(newVersion)) {
            setVersionError('Please use semantic versioning (e.g., 1.0.0)');
        } else {
            setVersionError('');
        }
    };

    const fetchCommits = async () => {
        if (!repositoryUrl) {
            setError('Please enter a repository URL');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const params = new URLSearchParams();
            params.append('repositoryUrl', repositoryUrl);

            const response = await api.get(`/commits?${params.toString()}`);
            
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to fetch commits');
            }

            const commitsWithRepo = response.data.commits || [];
            setCommits(commitsWithRepo);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(errorMessage);
            console.error('Error fetching commits:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateChangelog = async () => {
        if (!version) {
            setError('Please enter a version number');
            return;
        }

        if (!isValidVersion(version)) {
            setError('Please use semantic versioning (e.g., 1.0.0)');
            return;
        }

        if (commits.length === 0) {
            setError('Please fetch commits first');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const response = await api.post('/generate', {
                version,
                commits: commits.slice(0, 10)
            });

            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to generate changelog');
            }

            setGeneratedEntries(response.data.entries);
        } catch (error) {
            setError(error.message);
            console.error('Error generating changelog:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const publishChangelog = async () => {
        if (!version || generatedEntries.length === 0) {
            setError('Please generate a changelog first');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/publish', {
                version,
                entries: generatedEntries,
                repositoryUrl: commits[0]?.repository || repositoryUrl
            });

            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to publish changelog');
            }

            setVersion('');
            setCommits([]);
            setGeneratedEntries([]);
            setRepositoryUrl('');
            setShowSuccess(true);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(errorMessage);
            console.error('Error publishing changelog:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="developer-tool">
            {showSuccess && (
                <div className="notification-banner">
                    Changelog published successfully! View it in the{' '}
                    <Link to="/public">Public View</Link>
                </div>
            )}
            
            <div className="tool-header">
                <h1>Changelog Generator</h1>
                {(commits.length > 0 || generatedEntries.length > 0) && (
                    <button 
                        onClick={handleReset}
                        className="reset-button"
                        aria-label="Reset all fields"
                    >
                        Reset
                    </button>
                )}
            </div>
            
            <div className="input-group">
                <label htmlFor="repositoryUrl">Repository URL:</label>
                <input
                    id="repositoryUrl"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="Enter repository URL (e.g., https://github.com/user/repo.git)"
                />
                <button 
                    onClick={fetchCommits}
                    disabled={loading}
                    className="button"
                >
                    {loading ? 'Loading...' : 'Fetch Latest Commits'}
                </button>
            </div>

            {commits.length > 0 && (
                <div className="input-group">
                    <label htmlFor="version">Version Number:</label>
                    <input
                        id="version"
                        value={version}
                        onChange={handleVersionChange}
                        placeholder="e.g., 1.0.0"
                        className={versionError ? 'error' : ''}
                    />
                    {versionError && <div className="error-message">{versionError}</div>}
                    <button 
                        onClick={generateChangelog}
                        disabled={isGenerating || !!versionError}
                        className="button"
                    >
                        {isGenerating ? 'Generating...' : 'Generate Changelog'}
                    </button>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {generatedEntries.length > 0 && (
                <div className="generated-changelog">
                    <h3>Generated Changelog</h3>
                    <ul className="changes-list">
                        {generatedEntries.map((entry, index) => (
                            <li key={index}>{entry}</li>
                        ))}
                    </ul>
                    <button 
                        onClick={publishChangelog}
                        disabled={loading}
                        className="button"
                    >
                        {loading ? 'Publishing...' : 'Publish Changelog'}
                    </button>
                </div>
            )}

            {commits.length > 0 && (
                <div className="recent-commits">
                    <h3>Recent Commits</h3>
                    <div className="commit-grid">
                        {commits.slice(0, 10).map(commit => (
                            <div key={commit.hash} className="commit-item">
                                <p>{commit.message}</p>
                                <small>Author: {commit.author} • {new Date(commit.date).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeveloperTool;
