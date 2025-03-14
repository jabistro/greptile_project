import React from 'react';
import { useChangelog } from '../hooks/useChangelog';

const getRepositoryName = (url) => {
  if (!url) return null;
  try {
    const cleanUrl = url.replace(/\.git$/, '');
    const match = cleanUrl.match(/github\.com\/([^/]+\/[^/]+)$/);
    return match ? match[1] : new URL(cleanUrl).pathname.replace(/^\//, '');
  } catch (e) {
    return null;
  }
};

const PublicChangelog = () => {
  const { changelogs, loading, error, fetchChangelogs, deleteChangelog } = useChangelog();

  React.useEffect(() => {
    fetchChangelogs();
  }, []);

  const handleDelete = async (version, repositoryUrl) => {
    if (window.confirm(`Are you sure you want to delete changelog version ${version}?`)) {
      try {
        await deleteChangelog(version, repositoryUrl);
        await fetchChangelogs();
      } catch (err) {
        console.error('Error deleting changelog:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading changelogs...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error loading changelogs</h2>
        <p>{error}</p>
        <button onClick={fetchChangelogs} className="button">
          Try again
        </button>
      </div>
    );
  }

  if (changelogs.length === 0) {
    return (
      <div className="no-changelogs">
        <h2>No changelogs available</h2>
        <p>There are currently no changelogs to display. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="public-changelog">
      <h1>Release Notes</h1>
      {[...changelogs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(changelog => (
        <article 
          key={`${changelog.repositoryUrl}-${changelog.version}`} 
          className="changelog-entry"
        >
          <header>
            <h2>Version {changelog.version}</h2>
            <div className="changelog-meta">
              <time>{changelog.createdAt ? new Date(changelog.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              }) : 'Date not available'}</time>
              {changelog.repositoryUrl && (
                <div className="repository-info">
                  <span className="repository-name">{getRepositoryName(changelog.repositoryUrl)}</span>
                  <a 
                    href={changelog.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="repository-link"
                  >
                    View Repository
                  </a>
                </div>
              )}
            </div>
            <button 
              onClick={() => handleDelete(changelog.version, changelog.repositoryUrl)}
              className="delete-button"
              aria-label={`Delete version ${changelog.version}`}
            >
              Delete
            </button>
          </header>
          <ul className="changes-list">
            {changelog.entries?.map((entry, index) => (
              <li key={`${changelog.version}-${index}`}>{entry}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
};

export default PublicChangelog;