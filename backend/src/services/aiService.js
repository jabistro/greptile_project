const axios = require('axios');

class AIService {
    constructor() {
        if (!process.env.AI_API_KEY) {
            console.error('AI API Key not found in environment variables');
        }
        
        this.api = axios.create({
            baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
            headers: {
                'Authorization': `Bearer ${process.env.AI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async generateChangelog(commits) {
        try {
            const commitMessages = commits.map(commit => `- ${commit.message}`).join('\n');
            const prompt = `You are a technical writer creating a changelog entry. Your task is to create a clear and informative changelog from the provided git commits.

Guidelines for generating changelog entries:
1. Create between 3-6 bullet points, favoring more entries when there are distinct meaningful changes.
2. If there are fewer than 4 commits:
   - Create one bullet point per unique commit message
   - Combine commits with identical or very similar messages
   - Maintain a minimum of one bullet point
3. Format requirements:
   - Each point should be a complete sentence starting with a capital letter and ending with a period
   - Focus on user-facing changes and improvements
   - Use clear, concise language that end-users can understand
4. Content guidelines:
   - Combine related changes into single, comprehensive entries
   - Ignore or combine repetitive commits
   - Skip test commits, merge commits, and minor documentation updates unless they represent significant user-facing changes
   - Highlight feature additions, improvements, bug fixes, and significant changes
   - Provide context when necessary to help users understand the impact of changes

Commits:
${commitMessages}

Changelog entries:`;

            const payload = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an experienced technical writer specializing in changelog creation. Your goal is to transform git commits into clear, user-focused bullet points that effectively communicate changes to end users."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            };
    
            console.log('Making OpenAI API request with model:', payload.model);
            const response = await this.api.post('/chat/completions', payload);
            console.log('OpenAI API response received');
            
            const generatedText = response.data.choices[0].message.content;
            
            return generatedText
                .split('\n')
                .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
                .map(line => line.replace(/^[-•]\s*/, '').trim())
                .filter(line => line.length > 0);
        } catch (error) {
            console.error('AI generation error:', error.response?.data || error.message);
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                headers: error.response?.headers
            });
            
            if (error.response?.data?.error?.code === 'insufficient_quota') {
                throw new Error('OpenAI API quota exceeded. Please check your API key and billing details.');
            }
            
            if (error.response?.status === 401) {
                throw new Error('Invalid OpenAI API key. Please check your API key configuration.');
            }
            
            throw new Error(`AI generation failed: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}

module.exports = new AIService();