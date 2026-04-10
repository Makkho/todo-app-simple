# TODO Application - Azure Cloud Project

A simple TODO web application for Azure deployment, demonstrating containerization and cloud services integration.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run the application
npm start
```

The app will be available at `http://localhost` (or `http://localhost:3000` if port 80 is unavailable)

### Docker Build & Run

```bash
# Build Docker image
docker build -t todo-app:latest .

# Run container locally
docker run -p 80:80 todo-app:latest

# Or with a specific port mapping
docker run -p 8080:80 todo-app:latest
```

Then visit `http://localhost:8080`

## 📋 Features

- ✅ Add new tasks
- ✅ Mark tasks as completed
- ✅ Delete tasks
- ✅ Persistent storage (local JSON file)
- ✅ Health check endpoint (`/health`)
- ✅ RESTful API

## 🏗 Architecture

### Stack
- **Backend**: Node.js + Express.js
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Data Storage**: JSON file (local) / Will use Azure Cosmos DB
- **Container**: Docker
- **Cloud Platform**: Azure

### Directory Structure
```
.
├── app.js                 # Express server
├── package.json          # Dependencies
├── Dockerfile            # Container configuration
├── public/
│   └── index.html        # Frontend UI
├── todos.json            # Data file (generated)
└── README.md
```

## 🔗 API Endpoints

- `GET /` - Frontend HTML
- `GET /health` - Health check
- `GET /api/todos` - List all tasks
- `POST /api/todos` - Create new task
- `PUT /api/todos/:id` - Update task
- `DELETE /api/todos/:id` - Delete task

### Example API Usage

```bash
# Get all todos
curl http://localhost/api/todos

# Add a todo
curl -X POST http://localhost/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries"}'

# Update a todo (mark as completed)
curl -X PUT http://localhost/api/todos/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE http://localhost/api/todos/1234567890
```

## 🔧 Environment Variables

- `PORT` - Server port (default: 80)

## 📦 Technologies Used

- **Node.js 18** - Runtime
- **Express.js** - Web framework
- **Body-parser** - Middleware for JSON parsing
- **Alpine Linux** - Lightweight Docker base image

## 🚀 Deployment Steps (Azure)

### 1. Container Registry
```bash
az acr create --resource-group <rg> --name <registry-name> --sku Basic
az acr build --registry <registry-name> --image todo-app:latest .
```

### 2. App Service
```bash
az appservice plan create --name <plan-name> --resource-group <rg> --sku B1 --is-linux
az webapp create --resource-group <rg> --plan <plan-name> --name <app-name> \
  --deployment-container-image-name-user <registry>.azurecr.io/todo-app:latest
```

### 3. Cosmos DB Integration
- Create Azure Cosmos DB account
- Update connection string in app configuration

### 4. Key Vault Integration
- Create Azure Key Vault
- Store connection strings as secrets
- Enable Managed Identity on App Service

### 5. Blob Storage
- Create Storage Account
- Use for file attachments or data exports

## ⚠️ Notes

- Currently uses local JSON file storage. For production, integrate with Azure Cosmos DB
- Default port is 80 for Azure App Service compatibility
- Includes Docker health check for container orchestration
- No authentication required (add for production)

## 📝 Future Enhancements

- [ ] Azure Cosmos DB integration
- [ ] Azure Key Vault for secrets
- [ ] Blob Storage for attachments
- [ ] User authentication
- [ ] Database migrations
- [ ] Unit tests
- [ ] CI/CD pipeline

