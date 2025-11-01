# AI Document Extractor - Full-Stack Application

A comprehensive AI-powered web application that extracts structured data from utility bills and receipts (image/PDF files), displays the extracted data interactively in a three-panel layout with user authentication and a chat interface for Q&A on the extracted data.

## 🚀 Features

### Frontend (React)
- **Three-Panel Layout**:
  - **Document Viewer** (Left): Display uploaded documents with zoom/pan capabilities
  - **Data Viewer** (Middle): Display and edit extracted structured data
  - **Chat Interface** (Right): AI-powered Q&A about the document
- **User Authentication**: Secure JWT-based authentication
- **Theme System**: Light/Dark mode with persistent preferences
- **Redux State Management**: Centralized state management
- **Responsive Design**: Mobile and desktop optimized
- **Document Management**: Upload, view, delete documents

### Backend (FastAPI + Python)
- **RESTful API**: Fast and efficient API endpoints
- **JWT Authentication**: Secure user authentication
- **AI Integration**: Gemini AI with LangGraph for data extraction
- **PostgreSQL Database**: Robust data storage
- **Document Processing**: Support for images and PDFs
- **Chat System**: AI-powered Q&A with context awareness

## 🛠️ Technology Stack

### Frontend
- React.js 18.2
- Redux Toolkit with Redux Persist
- React Router DOM
- Reactstrap (Bootstrap 5)
- Axios for API calls
- React Icons

### Backend
- Python 3.9+
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Google Gemini AI
- LangChain & LangGraph
- JWT Authentication (python-jose)
- Bcrypt password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- Python (v3.9 or higher)
- PostgreSQL (v12 or higher)
- Google Gemini API key

## 🔧 Installation

### 1. Clone the Repository
```bash
cd ai-doc-extractor-004
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ai_doc_extractor

# JWT Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Google Gemini API
GOOGLE_API_KEY=your-gemini-api-key-here

# Application Configuration
DEBUG=True
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760
```

#### Set Up PostgreSQL Database
```bash
# Create database
createdb ai_doc_extractor

# Or using psql
psql -U postgres
CREATE DATABASE ai_doc_extractor;
\q
```

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment (Optional)
Create a `.env` file in the `frontend` directory if you need to customize the API URL:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
python main.py
```
The backend will run on `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Start Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

## 📖 Usage

### 1. Register/Login
- Navigate to `http://localhost:3000`
- Create a new account or login with existing credentials

### 2. Upload Document
- Click "Upload Document" button
- Select an image (JPEG, PNG) or PDF file
- The document will be processed automatically

### 3. View Extracted Data
- **Left Panel**: View the uploaded document with zoom controls
- **Middle Panel**: See extracted structured data
- Edit fields manually if needed
- Export data as JSON or CSV

### 4. Chat with AI
- **Right Panel**: Ask questions about the document
- Example questions:
  - "What is the total amount?"
  - "Who is the vendor?"
  - "What is the date on this document?"
  - "List all line items"

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get all documents
- `GET /api/documents/{id}` - Get specific document
- `GET /api/documents/{id}/extracted-data` - Get extracted data
- `PUT /api/documents/{id}/extracted-data` - Update extracted data
- `DELETE /api/documents/{id}` - Delete document
- `GET /api/documents/{id}/export/{format}` - Export data (JSON/CSV)

### Chat
- `POST /api/chat/message` - Send message and get AI response
- `GET /api/chat/history/{document_id}` - Get chat history
- `DELETE /api/chat/history/{document_id}` - Clear chat history

## 📁 Project Structure

```
ai-doc-extractor-004/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Layout/
│   │   │   └── Workspace/
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   └── store.js
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── routers/
│   │   ├── auth_router.py
│   │   ├── document_router.py
│   │   └── chat_router.py
│   ├── ai_service.py
│   ├── auth.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── main.py
│   └── requirements.txt
├── database_init.sql
└── README.md
```

## 🔄 Development Process

The development of this AI Document Extractor followed an iterative approach:

### Phase 1: Planning and Architecture
- **Requirements Analysis**: Identified the need for automated document data extraction from utility bills and receipts
- **Technology Selection**: Chose React for frontend due to component reusability, FastAPI for backend due to high performance, and Google Gemini AI for advanced document understanding
- **Database Design**: Designed PostgreSQL schema with proper relationships and indexing

### Phase 2: Backend Development
- **API Design**: Implemented RESTful endpoints with proper authentication and error handling
- **AI Integration**: Integrated Google Gemini AI with LangGraph for structured data extraction
- **Database Layer**: Set up SQLAlchemy ORM with proper models and relationships

### Phase 3: Frontend Development
- **Component Architecture**: Built reusable React components with Redux for state management
- **UI/UX Design**: Implemented three-panel layout for optimal document viewing and interaction
- **Authentication Flow**: Integrated JWT-based authentication with persistent sessions

### Phase 4: Integration and Testing
- **API Integration**: Connected frontend with backend APIs
- **Document Processing**: Implemented file upload, processing, and AI extraction pipeline
- **Chat System**: Added AI-powered Q&A functionality with context awareness

### Phase 5: Deployment and Optimization
- **Docker Containerization**: Created Docker configurations for easy deployment
- **Performance Optimization**: Optimized database queries and API responses
- **Security Implementation**: Added proper authentication, input validation, and CORS configuration

## 🛠️ Challenges Faced and Solutions Implemented

### Challenge 1: AI Document Extraction Accuracy
**Problem**: Initial AI extraction had inconsistent results across different document formats and layouts.
**Solution**: Implemented LangGraph workflow with multiple processing steps including preprocessing, field detection, and validation. Added confidence scoring to highlight uncertain extractions.

### Challenge 2: Real-time Chat Context Management
**Problem**: Maintaining conversation context across multiple messages while keeping responses relevant to the specific document.
**Solution**: Implemented document-specific chat history storage and context injection in AI prompts. Used vector similarity for retrieving relevant document sections.

### Challenge 3: File Upload and Processing Pipeline
**Problem**: Handling large files and ensuring secure, efficient processing without blocking the UI.
**Solution**: Implemented asynchronous file processing with status tracking. Added file type validation, size limits, and background processing using FastAPI's async capabilities.

### Challenge 4: State Management Complexity
**Problem**: Managing complex application state across multiple panels and user interactions.
**Solution**: Adopted Redux Toolkit with Redux Persist for centralized state management and local storage persistence. Implemented proper action creators and selectors for clean state updates.

### Challenge 5: Cross-Origin Resource Sharing (CORS)
**Problem**: Frontend and backend running on different ports caused CORS issues during development.
**Solution**: Configured CORS middleware in FastAPI with proper origin handling and credentials support.

### Challenge 6: Database Performance
**Problem**: Slow queries when retrieving documents with extracted data and chat history.
**Solution**: Added proper database indexes, implemented eager loading for relationships, and optimized SQL queries using SQLAlchemy's query optimization features.

## 📸 Screenshots and Examples

### Application Screenshots

#### Login Page
![Login Page](screenshots/login_page.png)
*User authentication interface with light/dark theme support*

#### Dashboard
![Dashboard](screenshots/dashboard.png)
*Main dashboard showing uploaded documents and navigation*

#### Document Viewer
![Document Viewer](screenshots/document_viewer.png)
*Three-panel layout: Document viewer (left), extracted data (middle), chat interface (right)*


### Usage Examples

#### Example 1: Utility Bill Processing
```
Input: Electric bill PDF
Extracted Data:
- Vendor: Pacific Gas & Electric
- Account Number: 123456789
- Billing Period: Jan 15 - Feb 15, 2024
- Total Amount: $127.43
- Due Date: March 15, 2024
```

#### Example 2: Receipt Processing
```
Input: Grocery receipt image
Extracted Data:
- Vendor: Whole Foods Market
- Date: February 20, 2024
- Subtotal: $89.67
- Tax: $7.12
- Total: $96.79
- Payment Method: Credit Card
```

#### Example 3: Chat Interaction
```
User: What is the total amount on this bill?
AI: The total amount on this utility bill is $127.43, due on March 15, 2024.

User: Who is the vendor?
AI: The vendor is Pacific Gas & Electric (PG&E).

User: Are there any late fees?
AI: I don't see any late fees mentioned on this bill. The charges include service charges and taxes only.
```

## 🚀 Deployment Steps and Requirements

### Production Requirements
- **Server**: Ubuntu 20.04+ or similar Linux distribution
- **Memory**: Minimum 4GB RAM, recommended 8GB+
- **Storage**: 20GB+ for application and uploaded documents
- **Database**: PostgreSQL 12+
- **Reverse Proxy**: Nginx recommended
- **SSL Certificate**: Required for production (Let's Encrypt recommended)

### Docker Deployment

#### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Manual Deployment

##### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip postgresql postgresql-contrib nginx certbot python3-certbot-nginx
```

##### 2. Database Setup
```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE ai_doc_extractor;
CREATE USER app_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ai_doc_extractor TO app_user;
\q

# Run initialization script
psql -U app_user -d ai_doc_extractor -f database_init.sql
```

##### 3. Backend Deployment
```bash
# Clone repository
git clone <repository-url>
cd ai-doc-extractor-004/backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with production values

# Start with systemd
sudo cp deployment/ai-doc-extractor.service /etc/systemd/system/
sudo systemctl enable ai-doc-extractor
sudo systemctl start ai-doc-extractor
```

##### 4. Frontend Deployment
```bash
cd ../frontend

# Build production bundle
npm install
npm run build

# Serve with nginx
sudo cp -r build/* /var/www/html/
sudo cp deployment/nginx.conf /etc/nginx/sites-available/ai-doc-extractor
sudo ln -s /etc/nginx/sites-available/ai-doc-extractor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

##### 5. SSL Configuration
```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Configure automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Environment Configuration for Production
```env
# Production .env settings
DATABASE_URL=postgresql://app_user:secure_password@localhost:5432/ai_doc_extractor
SECRET_KEY=your-very-secure-random-secret-key-here
GOOGLE_API_KEY=your-gemini-api-key
DEBUG=False
UPLOAD_DIR=/var/app/uploads
MAX_UPLOAD_SIZE=52428800
CORS_ORIGINS=["https://yourdomain.com"]
```

### Monitoring and Maintenance
- **Logs**: Monitor application logs in `/var/log/ai-doc-extractor/`
- **Backups**: Regular database backups using pg_dump
- **Updates**: Keep dependencies updated and test thoroughly
- **Security**: Regular security audits and dependency vulnerability checks

## 🔄 Workflow

### Development Workflow
1. **Feature Planning**: Create issues/tickets for new features
2. **Branching**: Create feature branches from `develop`
3. **Development**: Implement features with proper testing
4. **Code Review**: Submit pull requests for review
5. **Testing**: Automated tests + manual QA
6. **Merge**: Merge approved changes to `main`
7. **Deployment**: Automated deployment to staging/production

### Git Flow
```
main (production)
├── develop (integration)
│   ├── feature/ai-extraction
│   ├── feature/chat-interface
│   └── feature/user-auth
└── hotfix/security-patch
```

### CI/CD Pipeline
- **Linting**: ESLint for frontend, Ruff for backend
- **Testing**: Unit tests and integration tests
- **Build**: Automated build and Docker image creation
- **Deploy**: Blue-green deployment to production

### Code Quality Standards
- **Frontend**: ESLint, Prettier, React best practices
- **Backend**: Type hints, docstrings, PEP 8 compliance
- **Testing**: 80%+ code coverage required
- **Security**: Regular dependency audits, input validation

## 🗄️ Database Initialization

The database initialization script `database_init.sql` creates all necessary tables and inserts initial data. Run this script after setting up PostgreSQL:

```bash
# Using psql
psql -U app_user -d ai_doc_extractor -f database_init.sql

# Or using Python (from backend directory)
python -c "from database import init_db; init_db()"
```

The script creates the following tables:
- `users`: User accounts and authentication
- `documents`: Uploaded document metadata
- `extracted_data`: AI-extracted structured data
- `chat_messages`: Chat conversation history

Initial test user is created with email `test@example.com` and password `test123`.

## 🎨 Features in Detail

### Document Extraction
The AI extracts structured data including:
- Vendor name and address
- Document type and number
- Dates (issue date, due date)
- Amounts (total, tax, subtotal)
- Currency
- Line items
- Payment method
- Account number

### Chat Interface
- Context-aware AI responses
- Chat history persistence
- Natural language understanding
- References extracted data
- Conversation continuity

### Theme System
- Light and Dark modes
- Smooth transitions
- Persistent user preference
- Consistent styling across components

## 🔒 Security

- JWT-based authentication
- Bcrypt password hashing
- Protected API endpoints
- CORS configuration
- File type validation
- User-document isolation

## 🐛 Troubleshooting

### Backend Issues
- **Database Connection Error**: Check PostgreSQL is running and credentials are correct
- **Import Error**: Ensure all dependencies are installed: `pip install -r requirements.txt`
- **Gemini API Error**: Verify your `GOOGLE_API_KEY` is set correctly

### Frontend Issues
- **Port Already in Use**: Change port with `PORT=3001 npm start`
- **API Connection Error**: Ensure backend is running on port 8000
- **Dependencies Error**: Delete `node_modules` and run `npm install` again

## 📝 Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `GOOGLE_API_KEY`: Gemini AI API key
- `UPLOAD_DIR`: Directory for uploaded files
- `DEBUG`: Enable/disable debug mode

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL (optional)

## 🚧 Future Enhancements

- Multi-page PDF support with page navigation
- Batch document upload
- Advanced search and filtering
- Document comparison
- Email notifications
- Mobile app version
- OCR for handwritten notes
- Multi-language support

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Support

For questions or issues, please create an issue in the repository.

---

Built with ❤️ using React, FastAPI, and Google Gemini AI