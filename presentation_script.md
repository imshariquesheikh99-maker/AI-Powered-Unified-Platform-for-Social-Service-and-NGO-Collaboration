# Sahayak AI - Comprehensive Demonstration & Viva Presentation Script

> **Academic Context**: MCA Final Year Project Evaluation (Phase 1)  
> **Project Title**: Sahayak AI – AI-Powered Unified Platform for Social Service and NGO Collaboration  
> **Tech Stack**: React.js (Vite) + Express REST API + Python FastAPI AI Engine + MongoDB Document Store  

---

## ⏱️ Presentation Timing Strategy (Total: 20 Minutes)

| Phase | Duration | Focus Area | Key Artifacts |
| :--- | :--- | :--- | :--- |
| **Phase 1: Slide Presentation** | 10 Mins | Abstract, Problem Statement, System Architecture, 5 Roles, 4 AI Microservices | `presentation.html` |
| **Phase 2: Live Demonstration** | 6 Mins | End-to-End role switching (`Admin` ➔ `NGO` ➔ `Volunteer` ➔ `Donor` ➔ `Beneficiary`) | Live App (`http://localhost:3000`) |
| **Phase 3: Viva Q&A Defense** | 4 Mins | Code architecture defense, Mongo memory fallback, algorithm formulas, security | Viva Q&A Section |

---

## 🎙️ Slide-by-Slide Presenter Verbal Script ("What to Say")

### Slide 1: Title & Executive Overview
> **Verbal Script**:  
> *"Good morning respected internal and external examiners. Today I am presenting **Sahayak AI**, an AI-Powered Unified Platform for Social Service and NGO Collaboration, developed for my MCA Final Year Project Phase 1. Sahayak AI is a modern full-stack web application with a decoupled microservice architecture that brings together 5 distinct stakeholders: Administrators, NGOs, Volunteers, Donors, and Emergency Aid Beneficiaries into one transparent ecosystem."*

### Slide 2: Problem Statement & Domain Motivation
> **Verbal Script**:  
> *"In India today, there are over 3.4 million NGOs operating in isolation. During our domain research, we identified four major friction points:  
> 1. **Fragmented NGO Ecosystem**: Duplicate relief efforts and unverified organization credentials.  
> 2. **Manual Volunteer Allocation**: Volunteers are recruited generically without skill-vector matching.  
> 3. **Delayed Emergency Response**: Beneficiary aid requests queue chronologically, meaning severe crisis tickets get delayed behind routine requests.  
> 4. **Lack of Donor Transparency & Tax Friction**: Donors lack instant proof of tax exemption under Section 80G."*

### Slide 3: The Sahayak AI Solution
> **Verbal Script**:  
> *"Sahayak AI solves these challenges by combining a 5-Role Access Control Matrix with dynamic AI microservices. We provide automatic document verification queues for Admins, 1-click vector skill matching for volunteers, real-time NLP urgency scoring for emergency beneficiary tickets, and instant digital 80G tax receipt generation upon donation checkout."*

### Slide 4: Full-Stack Microservices Architecture
> **Verbal Script**:  
> *"Architecturally, the application is divided into three distinct layers:  
> 1. **Frontend Presentation**: Built with React.js using Vite and custom CSS Glassmorphism styling.  
> 2. **Node.js Express REST API**: Manages core business logic, JWT authentication, and MongoDB persistence.  
> 3. **Python FastAPI AI Microservice**: Running on port 8000, handling computation-heavy AI tasks without blocking the Node event loop.  
> Additionally, our backend includes an automatic fallback to `MongoMemoryServer`, allowing the entire project to run out-of-the-box without requiring an external MongoDB service."*

### Slide 5: 5-Role Platform Ecosystem
> **Verbal Script**:  
> *"To demonstrate full enterprise role-based access control (RBAC), we engineered 5 distinct user roles. For quick presentation evaluation, we have embedded a top-navigation role switcher allowing 1-click toggle between Admin (`admin@sahayak.ai`), Verified NGO (`ngo.asha@sahayak.ai`), Volunteer (`volunteer.arjun@sahayak.ai`), Donor (`donor.rohit@sahayak.ai`), and Beneficiary (`beneficiary.ramesh@sahayak.ai`)."*

### Slide 6: AI Engine #1 – Volunteer-Campaign Skill Vector Matcher
> **Verbal Script**:  
> *"Our first AI microservice evaluates skill vector similarity between a volunteer's listed skills and campaign requirements. The algorithm computes the text overlap ratio using the formula `Base(65) + (OverlapRatio * 30) + (MatchCount * 5)`, with a 5% bonus for local city proximity. It returns a match score between 60% and 99% along with clear textual reasoning."*

### Slide 7: AI Engine #2 – NLP Beneficiary Request Urgency Classifier
> **Verbal Script**:  
> *"Our second AI engine processes beneficiary aid tickets using Natural Language Processing keyword weights. Emergency indicators like 'critical', 'flood', or 'icu' add 15 points, while essential terms add 10 points. Combined with an affected population multiplier, the engine assigns priority levels (`Urgent`, `High`, `Medium`, `Low`), ensuring critical emergency tickets jump to the top of NGO resolution queues."*

### Slide 8: AI Engine #3 & #4 – Recommender & Sahayak AI Chatbot
> **Verbal Script**:  
> *"Engine #3 provides content-based cause recommendations to donors based on preferred sectors like Education or Healthcare. Engine #4 is a floating conversational chatbot built into the React frontend that parses natural language queries and deep-links users directly to verified NGOs or emergency request forms."*

### Slide 9: Donor Mock Payment & Instant 80G Tax Receipts
> **Verbal Script**:  
> *"To build donor trust, our donation module integrates a mock payment gateway supporting UPI, Credit Cards, and NetBanking. Upon transaction confirmation, the system dynamically compiles NGO Registration parameters, Donor PAN, and Transaction ID into a downloadable digital 80G Tax Exemption Certificate."*

### Slide 10: Beneficiary Assistance Ticket Lifecycle
> **Verbal Script**:  
> *"Here we see the end-to-end operational lifecycle: A beneficiary submits a request -> FastAPI NLP engine calculates urgency -> Verified NGOs adopt the ticket from their queue -> The NGO fulfills relief and marks the ticket resolved with real-time status updates."*

### Slide 11: Database Architecture & Mongo Memory Fallback
> **Verbal Script**:  
> *"Our data persistence layer uses MongoDB Mongoose with normalized schemas for Users, NGOs, Campaigns, Volunteer Applications, Donations, and Assistance Requests. The connection module dynamically checks for `MONGODB_URI` and safely initializes `MongoMemoryServer` in memory if no local Mongo daemon is running."*

### Slide 12: Live Demonstration Protocol
> **Verbal Script**:  
> *"I will now transition to the live browser demonstration on `http://localhost:3000`, walking through each of the 5 roles using our pre-configured seeded dataset."*

---

## 🚀 Step-by-Step Live Demonstration Protocol (6 Minutes)

### Step 1: Open Live App (`http://localhost:3000`)
1. Point out the **Sahayak AI Top Navigation Header**.
2. Show the **"Quick Demo Role Switcher"** dropdown in the top right.

### Step 2: Demonstrating 👑 Admin Role (`admin@sahayak.ai`)
1. Select **"Admin"** from the top switcher.
2. Navigate to **Verification Queue**.
3. View **Seva Alliance** (`ngo.food@sahayak.ai`) marked as `Pending Verification`.
4. Inspect the registration documents and click **"Approve NGO"**. Show the instant status change to `Verified`.

### Step 3: Demonstrating 🏢 Verified NGO Role (`ngo.asha@sahayak.ai`)
1. Select **"NGO (Asha Foundation)"**.
2. Navigate to **Campaign Manager** and show active campaigns (*"Education for Every Child"*).
3. Navigate to **Volunteer Applications Queue** to review Sharique Raza's application.
4. Navigate to **Beneficiary Aid Requests** to inspect adoption queues.

### Step 4: Demonstrating 🤝 Volunteer Role (`volunteer.arjun@sahayak.ai`)
1. Select **"Volunteer (Sharique Raza)"**.
2. Navigate to **Discover Campaigns**.
3. Highlight the **AI Match Badge** (e.g., `92% Excellent Match - High skill alignment on: Teaching`).
4. Click **1-Click Apply** and demonstrate the real-time status tracker update.

### Step 5: Demonstrating 💳 Donor Role (`donor.rohit@sahayak.ai`)
1. Select **"Donor (Rohit Mehta)"**.
2. Click **"Donate Now"** on an active campaign.
3. Enter amount (e.g., `₹5,000`) and complete mock UPI checkout.
4. Click **"View 80G Tax Receipt"** and display the rendered digital tax exemption certificate with PAN and registration seal.

### Step 6: Demonstrating 🤲 Beneficiary Role (`beneficiary.ramesh@sahayak.ai`)
1. Select **"Beneficiary (Ramesh Kumar)"**.
2. Click **"Submit Assistance Request"**.
3. Enter Title: *"Emergency Flood Relief & Food Kits Required"*, Description: *"Severe flood in village, 25 people displaced without food or clean water"*.
4. Submit request and point out the **AI Urgency Badge**: `Score 92/100 (URGENT)`.

### Step 7: Demonstrating 🤖 Sahayak AI Chatbot
1. Click the floating **Sahayak AI Chatbot** icon at the bottom right.
2. Type: *"Find urgent food campaigns"*.
3. Show the chatbot response with deep-link navigation action.

---

## 🎓 Expected MCA Viva Q&A Defense Guide

### Q1: Why did you use Python FastAPI for AI microservices instead of Node.js?
> **Model Answer**:  
> *"Node.js is single-threaded and optimized for I/O-bound REST APIs. AI vector matching and NLP text parsing involve cpu-intensive text tokenization. By isolating AI computation into a Python FastAPI microservice, we ensure high-performance execution using Python's data processing libraries without blocking Node.js's non-blocking event loop."*

### Q2: How does the zero-config database fallback work?
> **Model Answer**:  
> *"In `server.js`, we wrap the database connection in a conditional check. If `process.env.MONGODB_URI` is present, Mongoose connects to standard MongoDB. If absent, the server dynamically imports `mongodb-memory-server` using ES module imports and spins up an ephemeral, in-memory Mongo instance. This guarantees zero setup friction during evaluation."*

### Q3: How is the Volunteer AI Match Score calculated?
> **Model Answer**:  
> *"The FastAPI microservice takes the array of volunteer skills and campaign required skills. It computes text overlap using case-insensitive substring matching. Overlap ratio is multiplied by 30 points on top of a 65 base score. If the volunteer's city matches the campaign location, a 5% proximity boost is added, capping at 99%."*

### Q4: How is Section 80G Tax Compliance handled programmatically?
> **Model Answer**:  
> *"Under Indian Tax Laws, an 80G receipt requires the NGO's 12A/80G Registration Number, Donor's PAN, Transaction Hash, Date, and Amount. Our donation schema binds these fields dynamically at payment checkout, generating a tamper-proof digital receipt document."*

### Q5: How is security and Role-Based Access Control (RBAC) enforced?
> **Model Answer**:  
> *"Authentication uses JSON Web Tokens (JWT). Upon login, the server issues a signed JWT payload containing `userId` and `role`. Protected API endpoints pass through an Express authorization middleware (`checkRole(['Admin'])`) that verifies token signature and checks role permissions before granting resource access."*
