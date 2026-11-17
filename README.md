# Sahayak AI – AI-Powered Unified Platform for Social Service and NGO Collaboration

> **MCA Final Year Project (Phase 1 Development)**  
> An intelligent, full-stack platform designed to connect **NGOs**, **Volunteers**, **Donors**, **Beneficiaries**, and **Administrators** into a transparent, AI-driven social impact ecosystem.

---

## 🌟 Key Highlights & AI Features (Phase 1)

1. **Role-Based Ecosystem (5 Roles)**:
   - 👑 **Admin**: Review & verify NGO registration documents, monitor global platform analytics, audit user activities.
   - 🏢 **NGO**: Manage organization profiles, launch campaigns, process volunteer applications, manage in-kind relief shipments, adopt beneficiary assistance tickets.
   - 🤝 **Volunteer**: Discover campaigns matched by AI based on skills and location (with % match score), submit 1-click applications.
   - 💳 **Donor**: Browse campaigns, view AI recommendations, contribute through **6 Diverse Modes of Donation** (UPI/Card, In-Kind Goods Delivery, Monthly Social SIP, Polygon Web3 Crypto, Corporate CSR 1:1 Match, and Impact Kits) with instant 80G and In-Kind certificates.
   - 🤲 **Beneficiary**: Submit aid tickets (Food, Medicine, Education, Shelter), receive automated AI Urgency Scoring, and track ticket status in real-time.

2. **Multi-Mode Philanthropy Engine (6 Contribution Channels)**:
   - 💳 **Online Monetary**: Instant UPI QR, Debit/Credit Cards, NetBanking, Wallets with instant Section 80G Tax Exemption receipts.
   - 📦 **In-Kind Physical Relief Goods**: Donate grains, medicines, books, blankets with Doorstep NGO Pickup scheduling & logistics tracking.
   - 🔄 **Monthly Social SIP / Recurring Pledge**: Automated monthly recurring sponsorships to sustain child education and orphan meals.
   - ⚡ **Web3 & Crypto Blockchain**: Polygon PoS (MATIC), Ethereum (ETH), USDT transparent on-chain transactions with immutable block proofs.
   - 🏢 **Corporate CSR & Matching Grant**: Enterprise CSR contributions with MCA Form CSR-1 compliance and 1:1 / 2:1 employee matching multipliers.
   - 🍱 **Micro-Impact Kit Sponsorship**: Tangible kit-based giving (10 Mid-Day Meals, Slum Student School Kit, Family Medical Camp).

2. **Python FastAPI AI Microservice & Intelligent Engines**:
   - **AI Volunteer-NGO Skill Matcher**: Computes vector similarity between volunteer skills/location and campaign requirements.
   - **AI NLP Request Urgency Prioritizer**: Scans beneficiary descriptions and affected population metrics to score urgency (`Urgent`, `High`, `Medium`, `Low`).
   - **AI Cause Recommender**: Recommends high-impact campaigns tailored to donor preferences.
   - **Sahayak AI Conversational Chatbot**: Natural language assistant for finding verified NGOs, active campaigns, and emergency assistance guidance.

---

## 🏗️ System Architecture

```
                          ┌─────────────────────────┐
                          │   React.js Client UI    │
                          │   (Vite + Glass CSS)    │
                          └────────────┬────────────┘
                                       │ HTTP / REST / JWT
                                       ▼
                          ┌─────────────────────────┐
                          │    Node.js / Express    │
                          │       REST API          │
                          └────┬───────────────┬────┘
                               │               │
            MongoDB Mongoose   │               │ HTTP / JSON
            Data Persistence   │               ▼
                   ┌───────────▼──┐   ┌─────────────────┐
                   │  MongoDB /   │   │ Python FastAPI  │
                   │  Mongoose    │   │  AI Microservice│
                   └──────────────┘   └─────────────────┘
                                      - Skill Vector Matcher
                                      - Urgency Classifier
                                      - Cause Recommender
                                      - AI Chatbot Engine
```

---

## 🔑 Pre-Configured Demo Accounts (Password: `password123`)

For quick evaluation, use the **"Demo Role"** dropdown in the top navigation bar, or log in manually:

| Role | Email | Status / Highlights |
| :--- | :--- | :--- |
| 👑 **Admin** | `admin@sahayak.ai` | Verification Queue & Global Analytics |
| 🏢 **NGO (Verified)** | `ngo.asha@sahayak.ai` | Asha Children Foundation (Active Campaigns) |
| 🏢 **NGO (Pending)** | `ngo.food@sahayak.ai` | Seva Alliance (Pending Admin Approval) |
| 🤝 **Volunteer** | `volunteer.arjun@sahayak.ai` | Sharique Raza (Tech & Education Skills) |
| 💳 **Donor** | `donor.rohit@sahayak.ai` | Rohit Mehta (Philanthropist & Tax Receipts) |
| 🤲 **Beneficiary** | `beneficiary.ramesh@sahayak.ai` | Ramesh Kumar (Aid Tickets & AI Urgency) |

---

## 🚀 Quick Setup & Execution Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **Python**: v3.9.x or higher
- **MongoDB**: Optional (The system includes an automatic fallback to `MongoMemoryServer` so it runs out-of-the-box without requiring a running Mongo daemon!)

### Step 1: Install Dependencies
```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install

# Install AI Service dependencies
cd ../ai_service
pip3 install -r requirements.txt
```

### Step 2: Seed Sample Data
```bash
cd server
npm run seed
```

### Step 3: Run Microservices

#### 1. Express REST API Server (Port 5001)
```bash
cd server
npm start
```

#### 2. Python FastAPI AI Engine (Port 8000)
```bash
cd ai_service
python3 main.py
```

#### 3. React Frontend Client (Port 3000)
```bash
cd client
npm run dev
```

Visit **`http://localhost:3000`** in your browser to experience Sahayak AI!

---

## 📚 REST API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Create new user (Admin, NGO, Volunteer, Donor, Beneficiary)
- `POST /api/auth/login`: Authenticate and receive JWT token
- `GET /api/auth/me`: Get active profile details

### NGO Management (`/api/ngos`)
- `GET /api/ngos`: List verified NGOs with search & sector filters
- `GET /api/ngos/:id`: Get NGO profile & campaigns
- `PUT /api/ngos/profile`: Update NGO organization details
- `PUT /api/ngos/:id/verify`: Admin approve/reject NGO verification status

### Campaigns (`/api/campaigns`)
- `GET /api/campaigns`: List active campaigns with filters
- `POST /api/campaigns`: Launch new campaign (Verified NGO only)

### Volunteer Applications (`/api/volunteers`)
- `POST /api/volunteers/apply`: Apply to campaign
- `GET /api/volunteers/my-applications`: Get volunteer's application status tracker
- `GET /api/volunteers/ngo-applications`: Get NGO campaign applications queue
- `PUT /api/volunteers/applications/:id/status`: Update application status (Accept/Reject)

### Multi-Mode Donations & Philanthropy Ledger (`/api/donations`)
- `POST /api/donations/process`: Process contributions across 6 modes (Monetary, In-Kind, Recurring SIP, Web3 Crypto, Corporate CSR, Impact Kits) & generate tailored receipts
- `GET /api/donations/my-donations`: Donor transaction ledger with filter by donation mode
- `GET /api/donations/ngo-donations`: NGO received funds, in-kind relief shipments, and recurring patrons
- `PUT /api/donations/:id/in-kind-status`: Update in-kind shipment status (`scheduled`, `in_transit`, `received_at_hub`, `distributed`)
- `PUT /api/donations/:id/recurring-status`: Update recurring pledge status (`active`, `paused`, `cancelled`)
- `GET /api/donations/public-ledger`: Public on-chain and financial transparency ledger explorer

### Beneficiary Assistance Requests (`/api/requests`)
- `POST /api/requests`: Submit assistance request with AI Urgency Scoring
- `GET /api/requests/my-requests`: Beneficiary request tracker
- `GET /api/requests`: NGO/Admin request queue
- `PUT /api/requests/:id/status`: Adopt/Update request status

### AI Endpoints (`/api/ai`)
- `POST /api/ai/match-volunteer`: Skill vector similarity score & justification
- `POST /api/ai/prioritize-request`: NLP request priority classification
- `POST /api/ai/recommend-campaigns`: Cause preference matching
- `POST /api/ai/chatbot`: Conversational AI query handler

---

## 🗺️ MCA Project Phase Roadmap

- **Phase 1 (Completed)**:
  - Full-stack MERN + Python FastAPI Microservice architecture
  - 5 Role-based Access Control (Admin, NGO, Volunteer, Donor, Beneficiary)
  - NGO document submission & Admin verification workflow
  - AI Volunteer matching with percentage breakdown
  - AI Beneficiary request urgency scoring
  - Donor mock payment gateway with 80G tax receipt generator
  - Floating Sahayak AI Chatbot
  - Automated database seeder script

- **Phase 2 (Future Roadmap)**:
  - Interactive GIS Geo-location mapping (Google Maps API integration)
  - Polygon-based Ethereum Blockchain donation ledger for absolute financial transparency
  - Real-time WebSockets notification server for instant SMS & WhatsApp emergency alerts

---

## 📜 License
This project is created for educational and academic presentation purposes for MCA Final Year evaluation.
