# 🎮 Azure GameLeaderboard

A **serverless, real-time gaming leaderboard** built on Microsoft Azure using the **Free Tier**.

![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Cosmos DB](https://img.shields.io/badge/Cosmos_DB-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)

---

## 🚀 Features

- ✅ **Real-time leaderboards** - Submit scores and see rankings instantly
- ✅ **100% Serverless** - No servers to manage
- ✅ **Scalable** - Handles 10 players or 10 million
- ✅ **Free Tier** - $0/month for learning and small games
- ✅ **Anti-cheat** - Basic score validation
- ✅ **Multiple games** - Support for different game IDs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Player (Browser)              │
└──────────────────┬──────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │                             │
    ▼                             ▼
┌─────────────┐       ┌─────────────────────┐
│   Azure     │       │   Azure Functions   │
│   Static    │       │   (HTTP Triggers)   │
│   Website   │       │   - SubmitScore     │
│             │       │   - GetRankings     │
│   (HTML/    │       │   - GetPlayerStats  │
│    CSS/JS)  │       └──────────┬──────────┘
└─────────────┘                  │
                                 ▼
                    ┌─────────────────────┐
                    │   Azure Cosmos DB   │
                    │   (Serverless)      │
                    │                     │
                    │   Container:        │
                    │   GameScores        │
                    └─────────────────────┘
```

---

## 💰 Cost

| Resource | Free Tier Allowance | Monthly Cost |
|----------|---------------------|--------------|
| Cosmos DB (Serverless) | 1000 RU/s, 25GB | $0 |
| Azure Functions | 1M executions | $0 |
| Storage (Static Site) | 5GB | $0 |
| **Total** | | **$0** |

---

## 📁 Project Structure

```
AzureGameLeaderboard/
├── frontend/
│   └── index.html          # Complete frontend (HTML + CSS + JS)
├── functions/
│   ├── SubmitScore/
│   │   └── index.js        # Submit new scores
│   ├── GetRankings/
│   │   └── index.js        # Get leaderboard
│   └── GetPlayerStats/
│       └── index.js        # Get player statistics
├── docs/
│   └── Azure-GameLeaderboard-Walkthrough.html
├── README.md
└── project-notes.txt       # Your Azure resource IDs
```

---

## 🛠️ Azure Services Used

| Service | Purpose |
|---------|---------|
| **Resource Group** | Organizes all resources |
| **Cosmos DB** | NoSQL database for scores |
| **Azure Functions** | Serverless API endpoints |
| **Storage Account** | Static website hosting |

---

## 📡 API Endpoints

### Submit Score
```http
POST /api/SubmitScore
Content-Type: application/json

{
    "playerId": "player123",
    "gameId": "game001",
    "score": 5000,
    "playerName": "ProGamer"
}
```

### Get Rankings
```http
GET /api/GetRankings?gameId=game001&limit=100
```

### Get Player Stats
```http
GET /api/GetPlayerStats?playerId=player123
```

---

## 🚀 Quick Start

See the complete walkthrough: [Azure-GameLeaderboard-Walkthrough.html](https://github.com/omer-taha-ahmed/Azure-GameLeaderboard/blob/main/Azure-GameLeaderboard-Walkthrough.html)
(( DOWNLOAD IT SO YOU CAN OPEN IT ))
### Prerequisites
- Azure Account (free tier)
- 2-3 hours of time

### Steps Overview
1. Create Resource Group
2. Create Cosmos DB (Serverless mode)
3. Create Function App (Consumption plan)
4. Deploy 3 functions
5. Create Storage Account for frontend
6. Configure CORS
7. Test!

---

## 📸 Screenshots

### Leaderboard Frontend
The frontend shows:
- Real-time score submission
- Live leaderboard rankings
- Player statistics
- Azure-themed design

---

## 🔧 Configuration

### Environment Variables (Function App)
```
COSMOS_ENDPOINT=https://your-cosmos.documents.azure.com:443/
COSMOS_KEY=your-primary-key
COSMOS_DATABASE=GameLeaderboardDB
COSMOS_CONTAINER=GameScores
```

### CORS Settings
Add these origins in Function App → CORS:
```
*
https://your-storage.z##.web.core.windows.net
```

---

## 🧹 Cleanup

To delete all resources and avoid charges:
1. Go to Azure Portal
2. Search: Resource groups
3. Click: GameLeaderboard-RG
4. Click: Delete resource group
5. Confirm deletion

---

## 📚 Technologies

- **Azure Functions** - Serverless compute
- **Azure Cosmos DB** - NoSQL database
- **Azure Blob Storage** - Static website hosting
- **Node.js 20** - Runtime
- **HTML/CSS/JavaScript** - Frontend

---

## 📄 License

MIT License - Feel free to use this project for learning!

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## ⭐ Show Your Support

Give a ⭐ if this project helped you learn Azure!

---

**Built with ☁️ Azure | 100% Serverless | 100% Free Tier**

