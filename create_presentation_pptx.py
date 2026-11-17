import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # Set 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Colors
    DARK_BG = RGBColor(15, 23, 42)      # #0f172a
    CARD_BG = RGBColor(30, 41, 59)      # #1e293b
    INDIGO = RGBColor(99, 102, 241)     # #6366f1
    CYAN = RGBColor(6, 182, 212)        # #06b6d4
    EMERALD = RGBColor(16, 185, 129)    # #10b981
    WHITE = RGBColor(255, 255, 255)
    GRAY = RGBColor(148, 163, 184)      # #94a3b8
    LIGHT_BG = RGBColor(241, 245, 249)
    TEXT_DARK = RGBColor(15, 23, 42)

    blank_layout = prs.slide_layouts[6]

    def add_bg(slide, color=DARK_BG):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.color.rgb = color
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=""):
        # Tag
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = CYAN

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.7))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = WHITE

        # Subtitle
        if subtitle_text:
            tb_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.7), Inches(0.4))
            p_sub = tb_sub.text_frame.paragraphs[0]
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = GRAY

    def add_card(slide, left, top, width, height, title, text_items, accent_color=INDIGO):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = CARD_BG
        shape.line.color.rgb = accent_color
        shape.line.width = Pt(1.5)

        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.25)
        tf.margin_bottom = Inches(0.25)

        if title:
            p_t = tf.paragraphs[0]
            p_t.text = title
            p_t.font.size = Pt(16)
            p_t.font.bold = True
            p_t.font.color.rgb = WHITE
            p_t.space_after = Pt(10)

        for item in text_items:
            p = tf.add_paragraph() if title or tf.paragraphs[0].text else tf.paragraphs[0]
            p.text = item
            p.font.size = Pt(12)
            p.font.color.rgb = GRAY
            p.space_after = Pt(6)

    # ----------------------------------------------------
    # SLIDE 1: Title Slide
    # ----------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, DARK_BG)

    tb = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p1 = tf.paragraphs[0]
    p1.text = "SAHAYAK AI"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = CYAN
    p1.space_after = Pt(10)

    p2 = tf.add_paragraph()
    p2.text = "AI-Powered Unified Platform for Social Service and NGO Collaboration"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_after = Pt(20)

    p3 = tf.add_paragraph()
    p3.text = "MCA Final Year Project Evaluation (Phase 1 Development)"
    p3.font.size = Pt(16)
    p3.font.color.rgb = EMERALD
    p3.space_after = Pt(25)

    p4 = tf.add_paragraph()
    p4.text = "Tech Stack: React.js (Vite) | Node.js Express REST API | Python FastAPI AI Engine | MongoDB"
    p4.font.size = Pt(13)
    p4.font.color.rgb = GRAY

    # ----------------------------------------------------
    # SLIDE 2: Executive Summary & Abstract
    # ----------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "01. Executive Overview", "Project Abstract & Solution Scope", "Connecting NGOs, Volunteers, Donors, Beneficiaries, & Admins into an AI-driven ecosystem.")

    add_card(s2, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "⚡ The Challenge", [
        "• 3.4M+ NGOs in India operating in isolated silos.",
        "• Generic, unaligned volunteer recruitment without skill matching.",
        "• Severe crisis requests delayed behind routine tickets.",
        "• Lack of instant donor tax exemption (Section 80G) verification.",
        "• Fraud & authenticity risks in unverified NGO registrations."
    ], accent_color=RGBColor(239, 68, 68))

    add_card(s2, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.8), "🚀 The Sahayak AI Solution", [
        "• 5-Role Access Control Matrix (Admin, NGO, Volunteer, Donor, Beneficiary).",
        "• Decoupled Python FastAPI AI microservice engine (Port 8000).",
        "• Skill vector matching, NLP request urgency prioritization.",
        "• AI Authenticity & Fraud Scanner for NGO verification.",
        "• Instant digital 80G tax receipt PDF generation upon donation checkout."
    ], accent_color=EMERALD)

    # ----------------------------------------------------
    # SLIDE 3: Problem Statement
    # ----------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "02. Domain Research", "Problem Statement & Key Industry Friction Points", "Empirical friction observed across non-profit operations in India.")

    add_card(s3, Inches(0.8), Inches(2.0), Inches(5.6), Inches(2.2), "1. Fragmented Communication", [
        "NGOs lack a unified platform to share relief efforts, leading to duplicate resource allocation in overlapping regions."
    ], accent_color=INDIGO)

    add_card(s3, Inches(6.8), Inches(2.0), Inches(5.6), Inches(2.2), "2. Manual Volunteer Assignment", [
        "Volunteers are assigned generically without vector skill alignment, causing underutilization of technical talent."
    ], accent_color=INDIGO)

    add_card(s3, Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.2), "3. Delayed Emergency Response", [
        "Beneficiary requests are queued chronologically, causing critical life-threatening tickets to wait behind routine requests."
    ], accent_color=INDIGO)

    add_card(s3, Inches(6.8), Inches(4.5), Inches(5.6), Inches(2.2), "4. Donor Tax Exemption Friction", [
        "Donors lack instant proof of Section 80G tax exemption, lowering institutional and individual philanthropic contributions."
    ], accent_color=INDIGO)

    # ----------------------------------------------------
    # SLIDE 4: System Architecture
    # ----------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "03. Engineering Architecture", "Decoupled Microservices System Architecture", "High-performance separation of frontend presentation, REST API, and heavy AI computation.")

    add_card(s4, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "🎨 Frontend Layer\n(React.js + Vite)", [
        "• Glassmorphism UI styling",
        "• Single Page App (SPA)",
        "• Real-time role switcher",
        "• Sahayak AI Chatbot UI",
        "• Responsive Glass Cards"
    ], accent_color=CYAN)

    add_card(s4, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "⚡ REST API Server\n(Node.js / Express)", [
        "• Port 5001 REST API",
        "• JWT Authentication & RBAC",
        "• Mongoose Persistence",
        "• MongoMemoryServer fallback",
        "• Business Logic Controllers"
    ], accent_color=INDIGO)

    add_card(s4, Inches(8.8), Inches(2.0), Inches(3.6), Inches(4.8), "🧠 AI Microservice\n(Python FastAPI)", [
        "• Port 8000 AI Engine",
        "• Skill Vector Matcher",
        "• NLP Urgency Classifier",
        "• Fraud & Authenticity Audit",
        "• AI Impact Summary NLG"
    ], accent_color=EMERALD)

    # ----------------------------------------------------
    # SLIDE 5: 5-Role Platform Ecosystem
    # ----------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "04. Access Control", "5-Role User Ecosystem & Responsibilities", "Role-Based Access Control (RBAC) supporting 5 distinct stakeholder personas.")

    rows = [
        ("👑 Admin", "admin@sahayak.ai", "NGO Document Verification Queue, AI Fraud Risk Audits, Platform Global Stats & Activity Logs"),
        ("🏢 Verified NGO", "ngo.asha@sahayak.ai", "Campaign Creation, AI Volunteer Applicant Review, Beneficiary Request Adoption & AI Impact Reports"),
        ("🤝 Volunteer", "volunteer.arjun@sahayak.ai", "Discover Campaigns with AI Skill Match Scores (60%-99%), 1-Click Application & Status Tracking"),
        ("💳 Donor", "donor.rohit@sahayak.ai", "Browse Campaigns, Mock Payment Gateway Checkout (UPI/Card), Instant 80G Tax Exemption Receipts"),
        ("🤲 Beneficiary", "beneficiary.ramesh@sahayak.ai", "Submit Aid Tickets (Food, Medicine, Shelter), Automated AI Urgency Scoring, Real-time Resolution Tracker")
    ]

    # Add Table
    table_shape = s5.shapes.add_table(6, 3, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.8))
    table = table_shape.table
    table.columns[0].width = Inches(2.2)
    table.columns[1].width = Inches(2.8)
    table.columns[2].width = Inches(6.733)

    headers = ["Role Persona", "Demo Credentials", "Key Capabilities & Features"]
    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = INDIGO
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = WHITE

    for row_idx, data in enumerate(rows):
        for col_idx, text in enumerate(data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD_BG
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.size = Pt(11)
            p.font.color.rgb = WHITE if col_idx == 0 else GRAY

    # ----------------------------------------------------
    # SLIDE 6: AI Engine 1 - Skill Matcher
    # ----------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "05. AI Microservice #1", "AI Volunteer Skill Vector Matcher", "Computes vector similarity score between volunteer skills & campaign requirements.")

    add_card(s6, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "📐 Mathematical Formulation", [
        "• Calculates text overlap ratio between Volunteer Skills S_v and Campaign Required Skills S_c.",
        "",
        "MatchScore = Min(99, Max(60, Base(65) + (OverlapRatio * 30) + (MatchCount * 5)))",
        "",
        "• Location Proximity Boost: +5% match score bonus if Volunteer City matches Campaign City.",
        "• Returns match level: 'Excellent Match' (>=85%), 'Good Match' (>=70%), 'Moderate Match'."
    ], accent_color=CYAN)

    add_card(s6, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.8), "🐍 FastAPI JSON Payload & Output", [
        "POST /ai/match-volunteer",
        "{",
        '  "volunteer_skills": ["Teaching", "Web Dev"],',
        '  "volunteer_location": "New Delhi",',
        '  "campaign_skills": ["Teaching", "Digital Literacy"]',
        "}",
        "",
        "// Output:",
        "{",
        '  "matchScore": 92,',
        '  "matchLevel": "Excellent Match",',
        '  "matchReason": "High skill alignment on: Teaching (Local proximity match)"',
        "}"
    ], accent_color=EMERALD)

    # ----------------------------------------------------
    # SLIDE 7: AI Engine 2 - NLP Urgency Prioritizer
    # ----------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "06. AI Microservice #2", "NLP Request Urgency Prioritization Engine", "Scans beneficiary aid ticket descriptions to calculate crisis urgency scores.")

    add_card(s7, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "⚡ Keyword Scoring & Impact Multipliers", [
        "• Emergency Keywords (+15 pts): 'critical', 'disaster', 'flood', 'starvation', 'icu', 'trauma', 'infant'.",
        "• High Priority Keywords (+10 pts): 'hospital', 'medicine', 'shelter', 'treatment', 'ration'.",
        "• Population Multiplier: +20 pts for >20 affected people; +10 pts for >5 affected people.",
        "• Urgency Categories: Urgent (>=80), High (>=65), Medium (>=45), Low (<45)."
    ], accent_color=RGBColor(239, 68, 68))

    add_card(s7, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.8), "🎯 Live Priority Output Example", [
        "POST /ai/prioritize-request",
        "{",
        '  "title": "Emergency Flood Relief & Food Kits",',
        '  "description": "Severe flood in village, 25 people displaced without food",',
        '  "affected_people": 25',
        "}",
        "",
        "// Output:",
        "{",
        '  "urgencyScore": 92,',
        '  "priorityLevel": "Urgent",',
        '  "detectedIndicators": ["critical", "flood"]',
        "}"
    ], accent_color=CYAN)

    # ----------------------------------------------------
    # SLIDE 8: AI Engine 3 & 4 - Fraud & Impact Summary
    # ----------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "07. AI Microservices #3 & #4", "AI Authenticity Audit & Impact Generator", "Automated risk detection and natural language executive impact summaries.")

    add_card(s8, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "🛡️ AI Engine #3: Fraud Risk Audit", [
        "• Scans NGO registration documents, targets, and text for suspicious financial terms.",
        "• Flags brief descriptions, unrealistic targets (>₹50L), and high-risk keywords.",
        "• Computes Trust Score (0-100%) and Risk Level ('Low Risk', 'Medium Audit', 'High Risk').",
        "• Gives automated compliance recommendations to Admins."
    ], accent_color=INDIGO)

    add_card(s8, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.8), "📊 AI Engine #4: Impact Report Generator", [
        "• Synthesizes NGO metrics (donations raised, volunteers engaged, aid tickets resolved).",
        "• Generates natural language executive impact summary reports.",
        "• Highlights key social metrics for NGO executives and platform administrators."
    ], accent_color=EMERALD)

    # ----------------------------------------------------
    # SLIDE 9: AI Engine 5 & 6 - Recommender & Chatbot
    # ----------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "08. AI Microservices #5 & #6", "Cause Recommender & Conversational Assistant", "Personalized campaign discovery and interactive natural language guidance.")

    add_card(s9, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "🎯 AI Engine #5: Cause Recommender", [
        "• Matches donor preferred cause sectors (Education, Healthcare, Relief) with active campaigns.",
        "• Ranks campaigns based on category match ratio and urgency status.",
        "• Provides textual recommendation reasons for donors."
    ], accent_color=CYAN)

    add_card(s9, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.8), "💬 AI Engine #6: Sahayak AI Chatbot", [
        "• Floating conversational assistant accessible across all client pages.",
        "• Intent dispatcher for NGO search, donation guidance, and aid ticket creation.",
        "• Triggers deep-link navigation actions directly in the frontend UI."
    ], accent_color=INDIGO)

    # ----------------------------------------------------
    # SLIDE 10: 80G Tax Exemption Receipts
    # ----------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "09. Financial Transparency", "Donor Payment & Instant 80G Tax Receipts", "Digital tax deduction certificates compliant with Section 80G of the Indian Income Tax Act.")

    add_card(s10, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "💳 1. Payment Checkout", [
        "• Mock payment gateway supporting UPI, Credit Card, and NetBanking.",
        "• Instant transaction hash generation and ledger recording."
    ], accent_color=CYAN)

    add_card(s10, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "📜 2. Dynamic Certificate Compilation", [
        "• Binds NGO 80G Reg Number, Donor PAN, Amount, and Date.",
        "• Generates tamper-proof digital tax receipt."
    ], accent_color=INDIGO)

    add_card(s10, Inches(8.8), Inches(2.0), Inches(3.6), Inches(4.8), "📥 3. Personal Donation Ledger", [
        "• Donors can view donation history and download 80G receipts anytime.",
        "• Fosters institutional and individual donor trust."
    ], accent_color=EMERALD)

    # ----------------------------------------------------
    # SLIDE 11: Beneficiary Assistance Ticket Lifecycle
    # ----------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11)
    add_header(s11, "10. Social Operations", "Beneficiary Assistance Ticket Lifecycle", "End-to-end workflow from aid ticket submission to verified NGO adoption and fulfillment.")

    add_card(s11, Inches(0.8), Inches(2.0), Inches(2.7), Inches(4.8), "1. Ticket Submission", [
        "Beneficiary submits aid request details, category, location, and affected count."
    ], accent_color=CYAN)

    add_card(s11, Inches(3.8), Inches(2.0), Inches(2.7), Inches(4.8), "2. AI NLP Scoring", [
        "FastAPI NLP engine evaluates text and assigns Urgency Score & Priority Tag."
    ], accent_color=INDIGO)

    add_card(s11, Inches(6.8), Inches(2.0), Inches(2.7), Inches(4.8), "3. NGO Adoption", [
        "Verified NGOs inspect urgency queue and adopt tickets based on capability."
    ], accent_color=EMERALD)

    add_card(s11, Inches(9.8), Inches(2.0), Inches(2.7), Inches(4.8), "4. Fulfillment Tracker", [
        "Real-time status updates ('In Progress' ➔ 'Resolved') with transparent logging."
    ], accent_color=CYAN)

    # ----------------------------------------------------
    # SLIDE 12: Database & Fallback Architecture
    # ----------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12)
    add_header(s12, "11. Database Engineering", "MongoDB Schemas & Zero-Config Ephemeral Fallback", "Robust Mongoose schema design with MongoMemoryServer for out-of-the-box execution.")

    add_card(s12, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "🗄️ Normalized Document Schemas", [
        "• Users Schema: Authentication, role RBAC, skills vector, location.",
        "• NGO Profile Schema: Registration numbers, 80G details, verification status.",
        "• Campaign Schema: Target amounts, raised funds, required skills, urgency flag.",
        "• Assistance Request Schema: Affected count, AI urgency score, priority level."
    ], accent_color=INDIGO)

    add_card(s12, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.8), "⚡ Ephemeral MongoMemoryServer Fallback", [
        "• Dynamic connection handler in server/server.js.",
        "• Checks if local Mongo daemon is active on port 27017.",
        "• Automatically spins up MongoMemoryServer in-memory if no local daemon is found.",
        "• Guarantees zero-config execution during evaluation and demonstration."
    ], accent_color=EMERALD)

    # ----------------------------------------------------
    # SLIDE 13: Phase 1 vs Phase 2 Roadmap
    # ----------------------------------------------------
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13)
    add_header(s13, "12. Project Milestones", "Phase 1 Completed Deliverables vs Phase 2 Roadmap", "Current achievements in Phase 1 development and future planned roadmap.")

    add_card(s13, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "✅ Phase 1 Achieved Deliverables", [
        "✓ Full MERN + Python FastAPI microservice architecture.",
        "✓ 5-Role RBAC system (Admin, NGO, Volunteer, Donor, Beneficiary).",
        "✓ Skill vector matcher, NLP request urgency prioritizer.",
        "✓ AI Authenticity Risk Scanner & AI Impact Report Generator.",
        "✓ Mock payment gateway & instant 80G tax receipt generator.",
        "✓ Automated MongoMemoryServer fallback for zero-config execution."
    ], accent_color=EMERALD)

    add_card(s13, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.8), "🔮 Phase 2 Planned Roadmap", [
        "🚀 GIS Mapbox integration for interactive emergency spatial clusters.",
        "🚀 Polygon Blockchain integration for immutable donation auditing.",
        "🚀 Automated WhatsApp & SMS alert gateway for emergency crisis broadcast.",
        "🚀 Multilingual NLP models supporting regional Indian languages."
    ], accent_color=CYAN)

    # ----------------------------------------------------
    # SLIDE 14: Conclusion & Q&A
    # ----------------------------------------------------
    s14 = prs.slides.add_slide(blank_layout)
    add_bg(s14)

    tb = s14.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(11.333), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p1 = tf.paragraphs[0]
    p1.text = "THANK YOU!"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = CYAN
    p1.space_after = Pt(15)

    p2 = tf.add_paragraph()
    p2.text = "Sahayak AI – AI-Powered Unified Platform for Social Service and NGO Collaboration"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_after = Pt(20)

    p3 = tf.add_paragraph()
    p3.text = "Ready for Live System Demonstration & Examiner Viva Q&A Defense"
    p3.font.size = Pt(16)
    p3.font.color.rgb = EMERALD
    p3.space_after = Pt(25)

    p4 = tf.add_paragraph()
    p4.text = "Live App URL: http://localhost:3000 | FastAPI Docs: http://127.0.0.1:8000/docs"
    p4.font.size = Pt(14)
    p4.font.color.rgb = GRAY

    output_path = "Sahayak_AI_Final_Year_Presentation.pptx"
    prs.save(output_path)
    print(f"✅ Successfully created PowerPoint deck: {output_path}")

if __name__ == "__main__":
    create_deck()
