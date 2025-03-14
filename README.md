# Changelog Generator

A modern web application that generates clear, concise changelogs from Git repository commits using AI. This tool helps developers maintain professional and user-friendly documentation of their project changes.

## Technical Decisions

### Frontend
- **React**: Chosen for its component-based architecture and efficient state management
- **React Router**: Implemented for seamless navigation between the developer tool and public changelog views
- **Modern UI/UX**: 
  - Intuitive workflow from repository URL input to changelog generation
  - Real-time validation for version numbers using semantic versioning
  - Success notifications with direct links to view published changelogs
  - Responsive design that works well on all screen sizes

### Backend
- **Node.js/Express**: Selected for its robust ecosystem and easy integration with Git operations
- **Simple Git**: Used for efficient repository cloning and commit history retrieval
- **File-based Storage**: Implemented JSON-based storage for changelogs, making it easy to deploy and test
- **OpenAI Integration**: Leverages GPT-3.5 for intelligent changelog generation from commit messages

### Key Features
- Repository URL validation and error handling
- Semantic versioning enforcement
- AI-powered changelog generation with smart commit message grouping
- Version conflict prevention for each repository
- Public changelog view with repository links
- Automatic cleanup of temporary repository clones

## AI Tools Used

This project was developed with the assistance of several AI tools:
- **Cursor**: Secondary IDE with AI pair programming capabilities
- **ChatGPT**: Used for problem-solving and code optimization
- **OpenAI API**: Powers the intelligent changelog generation
- **Phind**: Assisted with technical research and implementation strategies

## Running the Application

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- OpenAI API key (see below)

### Getting an OpenAI API Key

1. Visit [OpenAI's website](https://platform.openai.com/signup) and sign up for an account
2. Once logged in, go to the [API Keys page](https://platform.openai.com/api-keys)
3. Click "Create new secret key"
4. Copy your API key immediately (you won't be able to see it again)
5. Note: OpenAI provides some free credits for new accounts, but you'll need to set up billing for continued use

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd changelog-generator
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Copy the example environment file in the backend directory:
     ```bash
     cd backend
     cp .env.example .env
     ```
   - Edit the `.env` file with your specific values:
     ```
     DB_HOST=localhost          # Your database host
     DB_USER=your_username     # Your database username
     DB_PASSWORD=your_password # Your database password
     DB_NAME=changelog_db     # Your database name
     DB_PORT=5432            # Your database port
     AI_API_KEY=your_openai_api_key  # Your OpenAI API key from step above
     AI_BASE_URL=https://api.openai.com/v1
     NODE_ENV=development
     ```
   
   Note: The AI_API_KEY is required for the changelog generation feature. Make sure to replace `your_openai_api_key` with the API key you obtained from OpenAI. Keep this key secure and never commit it to version control.

4. Start the application:
   ```bash
   # Start the backend server (from the backend directory)
   npm start

   # In a new terminal, start the frontend (from the frontend directory)
   npm start
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Usage

1. Navigate to the Developer Tool page
2. Enter a Git repository URL
3. Click "Fetch Latest Commits" to retrieve commit history
4. Enter a semantic version number (e.g., 1.0.0)
5. Generate and review the AI-created changelog
6. Publish the changelog
7. View your published changelog in the Public View
