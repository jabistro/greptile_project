const pool = require('../config/db');

class CommitModel {
    static async create(hash, message, author) {
        try {
            const result = await pool.query(
                'INSERT INTO commits (hash, message, author) VALUES ($1, $2, $3) RETURNING *',
                [hash, message, author]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating commit: ${error.message}`);
        }
    }

    static async getRecent() {
        try {
            const result = await pool.query(
                'SELECT * FROM commits ORDER BY date DESC LIMIT 50'
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching commits: ${error.message}`);
        }
    }
}

module.exports = CommitModel;