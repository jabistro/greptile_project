import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <h1>Welcome to Changelog Generator</h1>
                <p className="subtitle">
                    Generate beautiful, organized changelogs from your Git commits using AI.
                </p>
            </section>

            <section className="features">
                <h2>How It Works</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>1. Fetch Commits</h3>
                        <p>
                            Simply provide your Git repository URL, and we'll fetch the latest commits
                            automatically.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>2. Generate Changelog</h3>
                        <p>
                            Our AI analyzes your commits and generates human-readable changelog entries,
                            focusing on what matters to your users.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>3. Publish & Share</h3>
                        <p>
                            Review, edit if needed, and publish your changelog. Share it with your users
                            through the public changelog page.
                        </p>
                    </div>
                </div>
            </section>

            <section className="cta">
                <h2>Ready to Get Started?</h2>
                <div className="button-group">
                    <Link to="/developer" className="button primary">
                        Generate Changelog
                    </Link>
                    <Link to="/public" className="button secondary">
                        View Public Changelogs
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home; 