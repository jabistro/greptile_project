CREATE TABLE IF NOT EXISTS commits (
    id SERIAL PRIMARY KEY,
    hash VARCHAR(255),
    message TEXT,
    author VARCHAR(255),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS changelogs (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50),
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    entries TEXT[],
    generated BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ai_models (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255),
    api_key VARCHAR(255),
    base_url VARCHAR(255)
);