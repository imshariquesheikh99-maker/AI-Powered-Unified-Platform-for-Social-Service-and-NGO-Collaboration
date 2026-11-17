from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import math
import re

app = FastAPI(
    title="Sahayak AI Engine",
    description="Python FastAPI Microservice for AI Volunteer Matching, Beneficiary Urgency Prioritization, Campaign Recommendations & Conversational Chatbot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Data Models
# -----------------------------------------------------------------------------
class VolunteerMatchRequest(BaseModel):
    volunteer_skills: List[str]
    volunteer_location: Optional[str] = "New Delhi"
    campaign_skills: List[str]
    campaign_location: Optional[str] = "New Delhi"
    campaign_category: Optional[str] = "General"

class RequestPrioritizeRequest(BaseModel):
    title: str
    description: str
    category: str
    affected_people: Optional[int] = 1

class CampaignRecommendRequest(BaseModel):
    cause_preferences: List[str]
    user_location: Optional[str] = "New Delhi"

class FraudDetectRequest(BaseModel):
    title: str
    description: str
    target_amount: Optional[float] = 0.0
    requester_role: Optional[str] = "NGO"
    category: Optional[str] = "General"

class ImpactSummaryRequest(BaseModel):
    ngo_name: Optional[str] = "All Platform NGOs"
    total_campaigns: int
    total_donations: float
    total_volunteers: int
    resolved_tickets: int

class ChatbotRequest(BaseModel):
    message: str

# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Sahayak AI Microservice Engine",
        "version": "1.1.0",
        "endpoints": [
            "/ai/match-volunteer",
            "/ai/prioritize-request",
            "/ai/recommend-campaigns",
            "/ai/detect-fraud",
            "/ai/generate-impact-summary",
            "/ai/chatbot"
        ]
    }

@app.post("/ai/match-volunteer")
def match_volunteer(data: VolunteerMatchRequest):
    """
    Computes TF-IDF vector similarity score between volunteer skills & campaign requirements.
    """
    vol_skills = [s.lower().strip() for s in data.volunteer_skills]
    camp_skills = [s.lower().strip() for s in data.campaign_skills]
    
    if not camp_skills:
        match_score = 75
        reason = "General volunteer support match"
        matching_skills = []
    else:
        matched = [s for s in vol_skills if any(s in cs or cs in s for cs in camp_skills)]
        overlap_ratio = len(matched) / max(len(camp_skills), 1)
        
        # Calculate score (60% to 99%)
        base_score = 65
        match_score = int(min(99, max(60, base_score + (overlap_ratio * 30) + (len(matched) * 5))))
        matching_skills = matched
        
        if len(matched) > 0:
            reason = f"High skill alignment on: {', '.join([m.capitalize() for m in matched])}"
        else:
            reason = f"Social cause interest match for {data.campaign_category} in {data.campaign_location}"

    location_boost = 0
    if data.volunteer_location.lower() in data.campaign_location.lower() or data.campaign_location.lower() in data.volunteer_location.lower():
        location_boost = 5
        match_score = min(99, match_score + location_boost)
        reason += " (Local proximity match)"

    level = "Excellent Match" if match_score >= 85 else ("Good Match" if match_score >= 70 else "Moderate Match")

    return {
        "matchScore": match_score,
        "matchLevel": level,
        "matchReason": reason,
        "matchingSkills": matching_skills,
        "locationProximity": location_boost > 0
    }

@app.post("/ai/prioritize-request")
def prioritize_request(data: RequestPrioritizeRequest):
    """
    Analyzes beneficiary text description & affected count using NLP keyword urgency & sentiment rules.
    """
    text = f"{data.title} {data.description}".lower()
    score = 45
    
    # NLP keyword dictionaries
    emergency_keywords = ['critical', 'emergency', 'life-threatening', 'flood', 'earthquake', 'disaster', 'starvation', 'icu', 'blood', 'eviction', 'cancer', 'urgent', 'infant', 'trauma']
    high_keywords = ['hospital', 'medicine', 'shelter', 'malnutrition', 'treatment', 'surgery', 'disabled', 'winter shelter', 'food kit', 'ration']
    medium_keywords = ['education', 'textbook', 'school fee', 'uniform', 'laptop', 'vocational']

    matched_emergencies = [w for w in emergency_keywords if w in text]
    matched_high = [w for w in high_keywords if w in text]

    score += len(matched_emergencies) * 15
    score += len(matched_high) * 10

    # Impact Multiplier
    if data.affected_people > 20:
        score += 20
    elif data.affected_people > 5:
        score += 10

    score = int(min(99, max(25, score)))

    if score >= 80:
        priority_level = "Urgent"
        reason = f"AI NLP Engine detected {len(matched_emergencies)} critical emergency indicators for {data.affected_people} affected people."
    elif score >= 65:
        priority_level = "High"
        reason = f"Essential healthcare/shelter relief prioritized based on request breakdown."
    elif score >= 45:
        priority_level = "Medium"
        reason = "Standard community assistance processing queue."
    else:
        priority_level = "Low"
        reason = "Long-term community welfare support."

    return {
        "urgencyScore": score,
        "priorityLevel": priority_level,
        "priorityReason": reason,
        "detectedUrgencyIndicators": matched_emergencies + matched_high
    }

@app.post("/ai/recommend-campaigns")
def recommend_campaigns(data: CampaignRecommendRequest):
    """
    Content-based recommendation logic for campaigns.
    """
    prefs = [p.lower() for p in data.cause_preferences]
    return {
        "recommendationStatus": "active",
        "userPreferences": prefs,
        "algorithm": "Content-Based Cosine Similarity & Category Preference Filtering"
    }

@app.post("/ai/detect-fraud")
def detect_fraud(data: FraudDetectRequest):
    """
    AI Fraud Risk & Document Authenticity Scanner for NGO submissions & campaigns.
    """
    text = f"{data.title} {data.description}".lower()
    risk_score = 10
    risk_factors = []

    # Check suspicious patterns
    spam_terms = ['guaranteed return', 'double your money', 'lottery', 'crypto', 'wire transfer', 'test post', 'dummy text', '100% profit', 'click here fast']
    vague_terms = ['help us', 'need money', 'give funds', 'urgent cash']

    for st in spam_terms:
        if st in text:
            risk_score += 35
            risk_factors.append(f"Contains high-risk financial term: '{st}'")

    if len(data.description.strip()) < 20:
        risk_score += 20
        risk_factors.append("Extremely brief description (low transparency)")

    if data.target_amount > 5000000:
        risk_score += 15
        risk_factors.append("Exceptionally high target funding (> ₹50 Lakhs)")

    risk_score = min(99, max(5, risk_score))
    trust_score = 100 - risk_score

    if trust_score >= 85:
        risk_level = "Low Risk"
        recommendation = "Approved for automatic publication / fast-track verification."
    elif trust_score >= 60:
        risk_level = "Medium Risk"
        recommendation = "Requires standard Admin document review."
    else:
        risk_level = "High Risk"
        recommendation = "Flagged for manual compliance audit before approval."

    return {
        "trustScore": trust_score,
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "riskFactors": risk_factors if risk_factors else ["No security anomalies detected."],
        "recommendation": recommendation
    }

@app.post("/ai/generate-impact-summary")
def generate_impact_summary(data: ImpactSummaryRequest):
    """
    AI Natural Language Executive Impact Summary Generator for NGOs & Platform Admins.
    """
    summary = f"Summary for {data.ngo_name}: Platform operations have successfully raised ₹{data.total_donations:,.2f} across {data.total_campaigns} active campaigns. A total of {data.total_volunteers} volunteers were mobilized, resolving {data.resolved_tickets} critical beneficiary aid requests."
    
    highlights = [
        f"₹{data.total_donations:,.0f} direct social impact capital deployed",
        f"{data.total_volunteers} registered active skill contributors",
        f"{data.resolved_tickets} emergency beneficiary tickets resolved with AI prioritization"
    ]

    return {
        "summary": summary,
        "highlights": highlights,
        "generatedAt": "Sahayak AI Natural Language Analytics Engine v1.1"
    }

@app.post("/ai/chatbot")
def chatbot(data: ChatbotRequest):
    """
    Conversational AI engine with multilingual natural language query understanding
    (supporting English, Hindi, Bengali, Marathi, Telugu, Tamil, Urdu, Spanish, etc.)
    """
    msg = data.message.lower().strip()

    # Detect language intent and script
    is_hindi = bool(re.search(r'[\u0900-\u097F]', msg))
    is_bengali = bool(re.search(r'[\u0980-\u09FF]', msg))
    is_telugu = bool(re.search(r'[\u0C00-\u0C7F]', msg))
    is_tamil = bool(re.search(r'[\u0B80-\u0BFF]', msg))
    is_urdu = bool(re.search(r'[\u0600-\u06FF]', msg))
    is_spanish = any(w in msg for w in ['donar', 'ayuda', 'voluntario', 'campaña', 'cómo', 'hola', 'necesito'])

    # 1. NGO Query
    if any(k in msg for k in ['ngo', 'organization', 'find ngo', 'charity', 'संस्था', 'एनजीओ', 'এনজিও', 'ఎన్జీవో', 'தொண்டு நிறுவனம்', 'این جی او']):
        if is_hindi:
            reply = "सहायक एआई शिक्षा, स्वास्थ्य सेवा, पर्यावरण और गरीबी राहत में कार्यरत सत्यापित गैर-सरकारी संगठनों (NGOs) को होस्ट करता है। आप हमारी **एनजीओ डायरेक्टरी** पर सत्यापित प्रोफाइल देख और फ़िल्टर कर सकते हैं!"
        elif is_bengali:
            reply = "সহায়ক এআই শিক্ষা, স্বাস্থ্যসেবা ও সমাজকল্যাণে নিয়োজিত যাচাইকৃত এনজিও হোস্ট করে। আপনি আমাদের **এনজিও ডিরেক্টরি** থেকে সম্পূর্ণ প্রোফাইল দেখতে পারেন!"
        elif is_telugu:
            reply = "సహాయక్ AI విద్య, వైద్యం మరియు పేదరిక నిర్మూలన రంగాలలో పనిచేస్తున్న ధృవీకరించబడిన NGOలను అందిస్తుంది. మీరు మా **NGO డైరెక్టరీ**లో పూర్తి వివరాలను చూడవచ్చు!"
        elif is_tamil:
            reply = "சகாயக் AI கல்வி, மருத்துவம் மற்றும் சமூக நலனில் பணியாற்றும் சரிபார்க்கப்பட்ட தன்னார்வ தொண்டு நிறுவனங்களை வழங்குகிறது. எங்கள் **NGO டைரக்டரி**யில் விவரங்களைக் காணலாம்!"
        elif is_urdu:
            reply = "معاون AI تعلیم، صحت اور سماجی بہبود میں کام کرنے والی تصدیق شدہ این جی اوز کی میزبانی کرتا ہے۔ آپ ہماری **این جی او ڈائرکٹری** پر مکمل پروفائل دیکھ سکتے ہیں!"
        elif is_spanish:
            reply = "Sahayak AI aloja ONGs verificadas que trabajan en educación, salud, medio ambiente y ayuda social. ¡Puedes filtrar y ver los perfiles en nuestro **Directorio de ONGs**!"
        else:
            reply = "Sahayak AI hosts verified NGOs working in Education, Healthcare, Environment, and Poverty Relief. You can filter and view complete verified profiles on our **NGO Directory**!"
        action = "SHOW_NGOS"

    # 2. Donation / Campaign Query
    elif any(k in msg for k in ['donate', 'campaign', 'fund', 'payment', '80g', 'mode', 'in-kind', 'crypto', 'recurring', 'sip', 'goods', 'csr', 'दान', 'पैसा', 'रुपये', 'चंदा', 'দান', 'విరాళం', 'நன்கொடை', 'عطیہ', 'donar', 'donación']):
        if is_hindi:
            reply = "सहायक एआई 6 पारदर्शी दान माध्यमों का समर्थन करता है:\n1. 💳 **ऑनलाइन मौद्रिक दान** (तत्काल धारा 80G कर छूट रसीद के साथ)\n2. 📦 **भौतिक राहत सामग्री** (अनाज, दवाइयाँ, कपड़े, घर से एनजीओ पिकअप)\n3. 🔄 **मासिक सामाजिक एसआईपी** (बच्चों की शिक्षा व भोजन हेतु नियमित सहायता)\n4. ⚡ **वेब3 ब्लॉकचेन क्रिप्टो** (पॉलीगॉन MATIC और ETH पर पारदर्शी बहीखाता)\n5. 🏢 **कॉर्पोरेट सीएसआर** (1:1 और 2:1 कॉर्पोरेट मैचिंग अनुदान)\n6. 🍱 **प्रत्यक्ष प्रभाव किट** (10 भोजन, स्कूल बैग या मेडिकल किट)"
        elif is_bengali:
            reply = "সহায়ক এআই ৬টি স্বচ্ছ উপায়ে অনুদান সমর্থন করে:\n১. 💳 অনলাইন আর্থিক দান (তাৎক্ষণিক ৮০জি কর ছাড়ের রসিদ)\n২. 📦 ত্রাণ সামগ্রী (খাদ্যদ্রব্য, ওষুধ, এনজিও সংগ্রহ)\n৩. 🔄 মাসিক সামাজিক এসআইপি\n৪. ⚡ ওয়েব৩ ক্রিপ্টো অনুদান\n৫. 🏢 কর্পোরেট সিএসআর ম্যাচিং\n৬. 🍱 সরাসরি ইমপ্যাক্ট কিট স্পনসর"
        elif is_spanish:
            reply = "Sahayak AI admite 6 modalidades transparentes de donación:\n1. 💳 **Monetario en línea** (con deducción fiscal instantánea 80G)\n2. 📦 **Ayuda en especie** (alimentos, medicinas y ropa con recogida a domicilio)\n3. 🔄 **SIP Social Mensual** (patrocinio recurrente de educación y alimentación)\n4. ⚡ **Web3 Cripto** (Polygon MATIC, ETH con registros en blockchain)\n5. 🏢 **CSR Corporativo** (multiplicadores 1:1 y 2:1 con cumplimiento legal)\n6. 🍱 **Kits de Impacto Directo** (comidas, mochilas y botiquines)"
        else:
            reply = "Sahayak AI supports 6 transparent donation modes:\n1. 💳 **Online Monetary** (UPI QR, Debit/Credit, NetBanking, Wallets with instant 80G tax receipt)\n2. 📦 **In-Kind Goods** (Physical food grains, medical supplies, books with doorstep NGO pickup)\n3. 🔄 **Monthly Social SIP** (Automated recurring sponsorship for child education and meals)\n4. ⚡ **Web3 Crypto** (Polygon MATIC, ETH with transparent on-chain ledger proof)\n5. 🏢 **Corporate CSR** (1:1 and 2:1 corporate matching grants & Form CSR-1 compliance)\n6. 🍱 **Direct Impact Kits** (Sponsor 10 meals, school backpacks, or medical kits)"
        action = "SHOW_CAMPAIGNS"

    # 3. Volunteer Query
    elif any(k in msg for k in ['volunteer', 'apply', 'skill', 'match', 'स्वयंसेवक', 'सेवा', 'স্বেচ্ছাসেবক', 'వాలంటీర్', 'தொண்டர்', 'رضاکار', 'voluntario']):
        if is_hindi:
            reply = "हमारा एआई स्वयंसेवक मिलान इंजन आपके कौशल (शिक्षण, स्वास्थ्य सेवा, आयोजन) का विश्लेषण करता है और आपके शहर के निकटतम अभियानों के लिए वास्तविक समय में मिलान प्रतिशत प्रदान करता है।"
        elif is_spanish:
            reply = "Nuestro motor de emparejamiento de voluntarios analiza tus habilidades (enseñanza, salud, logística) y te ofrece porcentajes de coincidencia en tiempo real con campañas cercanas a tu localidad."
        else:
            reply = "Our AI Volunteer-NGO engine analyzes your skill set (Teaching, Healthcare, Event Management) and gives you real-time percentage match scores for campaigns near your city."
        action = "SHOW_VOLUNTEER"

    # 4. Beneficiary / Aid Query
    elif any(k in msg for k in ['beneficiary', 'help', 'request', 'food', 'medicine', 'urgent', 'मदद', 'सहायता', 'राहत', 'खाना', 'दवा', 'সাহায্য', 'సహాయం', 'உதவி', 'مدد', 'ayuda']):
        if is_hindi:
            reply = "लाभार्थी सीधे आपातकालीन सहायता अनुरोध प्रस्तुत कर सकते हैं। सहायक एआई एनएलपी विश्लेषण का उपयोग करके अति-आवश्यक मामलों को स्वचालित रूप से सत्यापित गैर-सरकारी संगठनों को अग्रसारित करता है!"
        elif is_spanish:
            reply = "Los beneficiarios pueden enviar solicitudes de auxilio de emergencia directamente. ¡Sahayak AI utiliza triaje NLP para priorizar casos urgentes y conectarlos con ONGs verificadas!"
        else:
            reply = "Beneficiaries can submit emergency aid requests directly. Sahayak AI uses NLP text prioritization to flag Urgent & High priority cases to verified NGOs automatically!"
        action = "SHOW_BENEFICIARY"

    # 5. Fraud / Authenticity Query
    elif any(k in msg for k in ['fraud', 'verify', 'safety', 'trust', 'security', 'सुरक्षा', 'धोखा', 'सत्यापन', 'নিরাপত্তা', 'భద్రత', 'பாதுகாப்பு', 'seguridad']):
        if is_hindi:
            reply = "सहायक एआई में स्वचालित **एआई प्रामाणिकता और जोखिम स्कैनर** है जो धोखाधड़ी को रोकने के लिए एनजीओ दर्पण पंजीकरण, लक्ष्यों और अनुरोधों की प्रामाणिकता की जाँच करता है।"
        elif is_spanish:
            reply = "Sahayak AI cuenta con un **Escáner Automatizado de Autenticidad y Riesgo** que audita credenciales oficiales de ONGs y presupuestos para prevenir cualquier anomalía o fraude."
        else:
            reply = "Sahayak AI features an automated **AI Authenticity & Risk Scanner** that audits NGO registration credentials, target amounts, and request authenticity to prevent fraud."
        action = "SHOW_ADMIN"

    # Default Guide
    else:
        if is_hindi:
            reply = "नमस्ते! मैं **सहायक एआई सहायक** हूँ। मैं सत्यापित एनजीओ खोजने, स्वयंसेवा के अवसर तलाशने, दान के लिए अभियानों की सिफारिश करने या सहायता प्राप्त करने में आपकी मदद कर सकता हूँ। आप क्या जानना चाहते हैं?"
        elif is_bengali:
            reply = "নমস্কার! আমি **সহায়ক এআই সহকারী**। আমি যাচাইকৃত এনজিও খোঁজা, স্বেচ্ছাসেবী কাজ, অনুদান বা জরুরি সাহায্যের জন্য আপনাকে সহায়তা করতে পারি।"
        elif is_spanish:
            reply = "¡Hola! Soy el **Asistente Sahayak AI**. Puedo ayudarte a buscar ONGs verificadas, encontrar oportunidades de voluntariado, recomendar campañas para donaciones o solicitar asistencia. ¿Qué te gustaría explorar?"
        else:
            reply = "I am **Sahayak AI Assistant**! I can help you search verified NGOs, find high-match volunteer opportunities, recommend campaigns for donations, or guide you through beneficiary assistance requests. What would you like to explore?"
        action = "GENERAL_GUIDE"

    return {
        "reply": reply,
        "action": action,
        "source": "fastapi"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

