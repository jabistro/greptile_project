const pool = require('../config/db');

class AIModel {
    static async create(modelName, apiKey, baseUrl) {
        try {
            const result = await pool.query(
                'INSERT INTO ai_models (model_name, api_key, base_url) VALUES ($1, $2, $3) RETURNING *',
                [modelName, apiKey, baseUrl]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating AI model: ${error.message}`);
        }
    }

    static async getDefault() {
        try {
            const result = await pool.query(
                'SELECT * FROM ai_models WHERE is_default = true LIMIT 1'
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching default AI model: ${error.message}`);
        }
    }
}

module.exports = AIModel;