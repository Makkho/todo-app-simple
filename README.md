# TODO Application - Azure Cloud Project

A containerized TODO web application demonstrating Azure cloud services integration: Container Registry, App Service, Cosmos DB, Key Vault, Azure Storage, Managed Identity, Deployment Slots, and Auto-Scaling.

**Project Status**: Phase 3 - Services Azure & Deployment

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run the application (requires .env file)
npm run dev
```

The app will be available at `http://localhost:3000`

### Docker Build & Run

```bash
# Build Docker image
docker build -t todo-app:latest .

# Run container locally
docker run -p 8080:80 \
  -e COSMOS_ENDPOINT="https://tododb473b6448.documents.azure.com/" \
  -e COSMOS_KEY="your-cosmos-key" \
  -e COSMOS_DATABASE="todo" \
  -e COSMOS_CONTAINER="todo" \
  todo-app:latest
```

Then visit `http://localhost:8080`

---

## 📋 Features

- ✅ Add new tasks
- ✅ Mark tasks as completed
- ✅ Delete tasks
- ✅ Persistent storage (Azure Cosmos DB)
- ✅ Secure secrets management (Azure Key Vault)
- ✅ Health check endpoint (`/health`)
- ✅ RESTful API
- ✅ Container deployment (Docker)
- ✅ Managed Identity authentication

---

## 🏗 Architecture

### Stack
- **Backend**: Node.js 18 + Express.js
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Data Storage**: Azure Cosmos DB (NoSQL)
- **Secrets**: Azure Key Vault
- **Container Registry**: Azure Container Registry (ACR)
- **App Service**: Azure App Service (Linux Containers)
- **File Storage**: Azure Blob Storage (optional)
- **Authentication**: Managed Identity (System-assigned)
- **Deployment Pattern**: Deployment Slots with Zero-Downtime Swap

### Directory Structure
```
.
├── app.js                    # Express server
├── package.json              # Dependencies
├── Dockerfile                # Multi-stage Docker build
├── .env                      # Environment variables (local)
├── public/
│   └── index.html            # Frontend UI
└── README.md
```

### Azure Services Integration

```
┌─────────────────────────────────────────────────────────┐
│                   Azure Subscription                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Resource Group: TODO-Application                 │  │
│  │ Location: West Europe                            │  │
│  ├──────────────────────────────────────────────────┤  │
│  │                                                  │  │
│  │ ┌─ Azure Container Registry ─────────────────┐  │  │
│  │ │ todoapplicationregistry.azurecr.io         │  │  │
│  │ │  └─ todo-app:latest                        │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  │           │                                       │  │
│  │           ▼                                       │  │
│  │ ┌─ App Service Plan (S1 Standard) ──────────┐  │  │
│  │ │ todo-plan                                  │  │  │
│  │ │  ├─ Production Slot (todoservice)          │  │  │
│  │ │  │  └─ Image: todo-app:latest              │  │  │
│  │ │  └─ Staging Slot (todoservice/staging)     │  │  │
│  │ │     └─ Image: todo-app:staging             │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  │           │                                       │  │
│  │           ├──────────────┬──────────────┐         │  │
│  │           ▼               ▼              ▼         │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────┐   │  │
│  │  │ Cosmos DB    │ │ Key Vault    │ │ Blob     │   │  │
│  │  │ tododb...    │ │ todovault... │ │ Storage  │   │  │
│  │  │              │ │              │ │ (optional)   │  │
│  │  │ Managed      │ │ Secrets:     │ │              │  │
│  │  │ Identity     │ │ • COSMOS-KEY │ │ Containers:  │  │
│  │  │ access       │ │ • COSMOS-END │ │ • todoblob    │  │
│  │  │              │ │   POINT      │ │              │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔗 API Endpoints

- `GET /` - Frontend HTML
- `GET /health` - Health check + deployment status
- `GET /api/todos` - List all tasks
- `POST /api/todos` - Create new task
- `PUT /api/todos/:id` - Update task
- `DELETE /api/todos/:id` - Delete task

### Example API Usage

```bash
# Get app health status
curl https://todoservice.azurewebsites.net/health

# Get all todos
curl https://todoservice.azurewebsites.net/api/todos

# Add a todo
curl -X POST https://todoservice.azurewebsites.net/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries"}'

# Update a todo (mark as completed)
curl -X PUT https://todoservice.azurewebsites.net/api/todos/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE https://todoservice.azurewebsites.net/api/todos/1234567890
```

---

## 🔧 Environment Variables

### Local Development (.env)
```
PORT=80
COSMOS_ENDPOINT=https://tododb473b6448.documents.azure.com/
COSMOS_KEY=your-primary-key-here
COSMOS_DATABASE=todo
COSMOS_CONTAINER=todo
```

### Azure Production (App Service Settings)
```
RUNNING_ON_AZURE=true
KEY_VAULT_URL=https://todovault473b6448.vault.azure.net/
COSMOS_ENDPOINT=https://tododb473b6448.documents.azure.com/
COSMOS_DATABASE=todo
COSMOS_CONTAINER=todo
WEBSITES_PORT=80
NODE_ENV=production
```

---

## 🎛️ Phase 3: Deployment Slots & Scaling

### Deployment Slots Setup

Deployment slots enable zero-downtime deployments:

```powershell
# 1. Create staging slot
az webapp deployment slot create \
  --resource-group TODO-Application \
  --name todoservice \
  --slot staging

# 2. Configure staging slot
az webapp config appsettings set \
  --resource-group TODO-Application \
  --name todoservice \
  --slot staging \
  --settings \
    COSMOS_ENDPOINT="https://tododb473b6448.documents.azure.com/" \
    COSMOS_DATABASE="todo" \
    COSMOS_CONTAINER="todo" \
    ENVIRONMENT="staging"

# 3. Deploy to staging
docker tag todo-app:latest todoapplicationregistry.azurecr.io/todo-app:staging
docker push todoapplicationregistry.azurecr.io/todo-app:staging

# 4. Test staging slot
curl https://todoservice-staging.azurewebsites.net/health

# 5. Swap staging to production (zero-downtime)
az webapp deployment slot swap \
  --resource-group TODO-Application \
  --name todoservice \
  --slot staging
```

### Manual Scaling

Scale the App Service plan to handle more traffic:

```powershell
# 1. Update plan to Standard (required for scaling)
az appservice plan update \
  --resource-group TODO-Application \
  --name todo-plan \
  --sku S1

# 2. Scale to 2 instances
az appservice plan update \
  --resource-group TODO-Application \
  --name todo-plan \
  --number-of-workers 2

# 3. Scale to 3 instances
az appservice plan update \
  --resource-group TODO-Application \
  --name todo-plan \
  --number-of-workers 3

# 4. Check current instances
az appservice plan show \
  --resource-group TODO-Application \
  --name todo-plan \
  --query "numberOfWorkers"

# 5. Scale down if needed
az appservice plan update \
  --resource-group TODO-Application \
  --name todo-plan \
  --number-of-workers 1
```

---

## 🔐 Managed Identity & Key Vault

Using Managed Identity for secure Azure service access:

```powershell
# 1. Enable Managed Identity
az webapp identity assign \
  --resource-group TODO-Application \
  --name todoservice

# 2. Get the Managed Identity Object ID
$MANAGED_IDENTITY_ID = az webapp identity show \
  --resource-group TODO-Application \
  --name todoservice \
  --query "principalId" \
  --output tsv

# 3. Grant Key Vault access
az role assignment create \
  --assignee-object-id $MANAGED_IDENTITY_ID \
  --role "Key Vault Secrets User" \
  --scope "/subscriptions/{subscriptionId}/resourceGroups/TODO-Application/providers/Microsoft.KeyVault/vaults/todovault473b6448"

# 4. Grant Cosmos DB access
az role assignment create \
  --assignee-object-id $MANAGED_IDENTITY_ID \
  --role "CosmosDB Account Operator" \
  --scope "/subscriptions/{subscriptionId}/resourceGroups/TODO-Application/providers/Microsoft.DocumentDB/databaseAccounts/tododb473b6448"

# 5. Configure app settings
az webapp config appsettings set \
  --resource-group TODO-Application \
  --name todoservice \
  --settings \
    RUNNING_ON_AZURE="true" \
    KEY_VAULT_URL="https://todovault473b6448.vault.azure.net/"
```

---

## 📦 Technologies Used

- **Node.js 18** - Runtime
- **Express.js 4.18** - Web framework
- **@azure/cosmos 4.9** - Cosmos DB client
- **@azure/identity 4.0** - Azure authentication
- **@azure/keyvault-secrets 4.8** - Key Vault integration
- **Docker** - Containerization
- **Azure Container Registry** - Image storage
- **Azure App Service** - Hosting
- **Azure Cosmos DB** - Database
- **Azure Key Vault** - Secrets management
- **Azure Blob Storage** - File storage (optional)

---

## 🚀 Deployment

### Push to Azure Container Registry

```bash
# Login to ACR
az acr login --name todoapplicationregistry

# Tag image
docker tag todo-app:latest todoapplicationregistry.azurecr.io/todo-app:latest

# Push to ACR
docker push todoapplicationregistry.azurecr.io/todo-app:latest
```

### Deploy to App Service

```bash
# Create/Update container configuration
az webapp config container set \
  --name todoservice \
  --resource-group TODO-Application \
  --docker-custom-image-name "todoapplicationregistry.azurecr.io/todo-app:latest" \
  --docker-registry-server-url "https://todoapplicationregistry.azurecr.io"
```

---

## 📊 Monitoring

View application logs:

```bash
# Stream logs in real-time
az webapp log tail \
  --resource-group TODO-Application \
  --name todoservice

# View metrics
az monitor metrics list \
  --resource "/subscriptions/{subscriptionId}/resourceGroups/TODO-Application/providers/Microsoft.Web/sites/todoservice" \
  --metric "RequestCount,ResponseTime,CpuTime" \
  --output table
```

---

## 🔄 CI/CD Pipeline Considerations

For production deployment workflows:

1. **Develop** → Test locally
2. **Build** → Docker build
3. **Push** → ACR push
4. **Deploy to Staging** → Deploy slot
5. **Test Staging** → Health checks + smoke tests
6. **Swap to Production** → Zero-downtime deployment
7. **Monitor** → Verify production deployment

---

## 📝 Notes

- Cosmos DB uses `/id` as partition key for optimal distribution
- Managed Identity provides secure credential-less authentication
- Deployment slots enable testing before production promotion
- Manual scaling requires Standard plan or higher
- All secrets are stored in Key Vault, never in code

---

## 🤝 Contributing

For improvements or bug reports, please create an issue or pull request.

---

## 📄 License

This project is part of an Azure Cloud practical evaluation.
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
