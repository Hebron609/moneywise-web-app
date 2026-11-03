import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

BG_COLOR = "0B0F17"      # Deep obsidian black
CARD_BG = "162032"       # Dark navy-slate for callout boxes
CARD_BG_WARN = "2A1B18"  # Subtle red/amber for warning boxes
CARD_BG_ACTION = "132E27"# Emerald tinted dark box
BORDER_COLOR = "10B981"  # Emerald

COLOR_TITLE = RGBColor(16, 185, 129)     # Emerald
COLOR_H1 = RGBColor(56, 189, 248)        # Sky Blue
COLOR_H2 = RGBColor(251, 191, 36)        # Amber Gold
COLOR_H3 = RGBColor(167, 243, 208)       # Mint
COLOR_BODY = RGBColor(241, 245, 249)     # Crisp Off-White
COLOR_MUTED = RGBColor(148, 163, 184)    # Slate Muted
COLOR_ACTION = RGBColor(245, 158, 11)    # Amber Alert
COLOR_SPEECH = RGBColor(255, 255, 255)   # Pure White

def setup_dark_document():
    doc = docx.Document()
    
    # 0.75-inch margins for good mobile/screen viewing
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Set page background color
    bg = parse_xml(f'<w:background {nsdecls("w")} w:color="{BG_COLOR}"/>')
    doc.element.insert(0, bg)
    
    # Enable displayBackgroundShape in settings
    disp = parse_xml(f'<w:displayBackgroundShape {nsdecls("w")}/>')
    doc.settings.element.append(disp)
    
    return doc

def add_title(doc, text, subtitle_text=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(22)
    run.font.bold = True
    run.font.color.rgb = COLOR_TITLE
    
    if subtitle_text:
        sub = doc.add_paragraph()
        sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        sub.paragraph_format.space_after = Pt(16)
        r_sub = sub.add_run(subtitle_text)
        r_sub.font.name = "Segoe UI"
        r_sub.font.size = Pt(11)
        r_sub.font.color.rgb = COLOR_MUTED

def add_h1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = COLOR_H1

def add_h2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = COLOR_H2

def add_p(doc, text, bold_prefix=None, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix + " ")
        r_pre.font.name = "Segoe UI"
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_H3
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(11)
    run.font.color.rgb = COLOR_BODY

def add_bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix + ": ")
        r_pre.font.name = "Segoe UI"
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_H2
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(11)
    run.font.color.rgb = COLOR_BODY

def add_speech_card(doc, speech_text, header="SAY THIS VERBATIM:"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = docx.enum.table.WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.8)
    
    # Fill cell background
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{CARD_BG}"/>')
    tcPr.append(shd)
    
    # Add left border
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="{BORDER_COLOR}"/>
            <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    # Cell content
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.2
    
    r_hdr = p.add_run(header + "\n")
    r_hdr.font.name = "Segoe UI"
    r_hdr.font.size = Pt(10)
    r_hdr.font.bold = True
    r_hdr.font.color.rgb = COLOR_TITLE
    
    r_body = p.add_run(f'"{speech_text}"')
    r_body.font.name = "Segoe UI"
    r_body.font.size = Pt(11.5)
    r_body.font.italic = True
    r_body.font.color.rgb = COLOR_SPEECH
    
    # Empty trailing spacing
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(6)

def add_action_card(doc, step_num, title, action_desc, what_you_see, speech_text):
    add_h2(doc, f"Stop {step_num}: {title}")
    
    table = doc.add_table(rows=1, cols=1)
    table.alignment = docx.enum.table.WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.cell(0, 0)
    cell.width = Inches(6.8)
    
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{CARD_BG_ACTION}"/>')
    tcPr.append(shd)
    
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="10B981"/>
            <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    
    r_act_lbl = p.add_run("ACTION TO TAKE: ")
    r_act_lbl.font.bold = True
    r_act_lbl.font.size = Pt(10)
    r_act_lbl.font.color.rgb = COLOR_ACTION
    
    r_act = p.add_run(action_desc + "\n")
    r_act.font.bold = True
    r_act.font.size = Pt(11)
    r_act.font.color.rgb = COLOR_SPEECH
    
    r_see_lbl = p.add_run("WHAT IS ON SCREEN: ")
    r_see_lbl.font.bold = True
    r_see_lbl.font.size = Pt(10)
    r_see_lbl.font.color.rgb = COLOR_MUTED
    
    r_see = p.add_run(what_you_see + "\n\n")
    r_see.font.size = Pt(10.5)
    r_see.font.color.rgb = COLOR_BODY
    
    r_say_lbl = p.add_run("EXACT WORDS TO SAY:\n")
    r_say_lbl.font.bold = True
    r_say_lbl.font.size = Pt(10)
    r_say_lbl.font.color.rgb = COLOR_TITLE
    
    r_say = p.add_run(f'"{speech_text}"')
    r_say.font.italic = True
    r_say.font.size = Pt(11.5)
    r_say.font.color.rgb = COLOR_SPEECH
    
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_after = Pt(6)

def add_qna(doc, q_text, a_text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = docx.enum.table.WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.cell(0, 0)
    cell.width = Inches(6.8)
    
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{CARD_BG}"/>')
    tcPr.append(shd)
    
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:left w:val="single" w:sz="18" w:space="0" w:color="38BDF8"/>
            <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    
    r_q = p.add_run(f"Q: {q_text}\n")
    r_q.font.bold = True
    r_q.font.size = Pt(11)
    r_q.font.color.rgb = COLOR_H2
    
    r_a = p.add_run(f"Answer: {a_text}")
    r_a.font.size = Pt(10.5)
    r_a.font.color.rgb = COLOR_BODY
    
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_after = Pt(4)

# ==============================================================================
# DOC 1: Personal Prototype Presentation Guide
# ==============================================================================
def build_prototype_guide():
    doc = setup_dark_document()
    add_title(doc, "MoneyWise SHS — Task D: The Prototype", "PERSONAL PRESENTATION CHEATSHEET & LIVE WALKTHROUGH GUIDE (DARK MODE)")
    
    add_h1(doc, "Overview & 30-Second Setup")
    add_p(doc, "This cheatsheet is formatted in Dark Mode with large high-contrast text so you can zoom in and read effortlessly on your phone or laptop screen during your presentation.", bold_prefix="Tip:")
    add_bullet(doc, "Open your PowerPoint deck to Slide 8 ('DEVELOP · TASK D: THE PROTOTYPE').", bold_prefix="Step 1")
    add_bullet(doc, "Open Chrome/Edge in another window to http://localhost:3000/course (or your deployed URL).", bold_prefix="Step 2")
    add_bullet(doc, "Speak on Slide 8 for 60 seconds, Alt+Tab / Cmd+Tab to browser for 2 minutes, and hand over to Slide 9.", bold_prefix="Timeline")
    
    add_h1(doc, "Part 1: Slide 8 Speech Script (In PowerPoint)")
    add_p(doc, "When the speaker for Slide 7 finishes, take the floor with confidence and read this verbatim:")
    
    slide_8_speech = (
        "Thank you. I am presenting Task D: The Prototype.\n\n"
        "In our instructional design, knowing about scams through theory is not enough—rural learners need safe, hands-on practice. "
        "For our prototype, we developed the entire Week 3 module: 'Saving Safely and Spotting Scams'.\n\n"
        "As outlined on this slide, Week 3 is broken into six progressive activities:\n"
        "1. Read & Watch (25 mins): Learners read a 2-page note and watch an instructional captioned video on mobile money fraud. Both are downloadable upfront for offline study.\n"
        "2. Judge 5 Fake Messages (15 mins): Rather than reading rules, learners evaluate five realistic simulated SMS scams—such as wrong-transfers and fake PIN requests—in a safe sandbox where mistakes cost zero cedis.\n"
        "3. Discuss in a Forum (10 mins): Learners share warning signs and independent verification methods with their peers in a facilitated discussion.\n"
        "4. Plan Saving as a Group (30 mins): Using a collaborative wiki, students work together to formulate a group savings plan evaluated against a transparent 4-point rubric.\n"
        "5. Quiz with Feedback (20 mins): A 10-question practice quiz, followed by our strict 5-Question Scam Mastery Check.\n"
        "6. Own Checklist (10 mins): Each learner applies safe saving rules to their individual daily life.\n\n"
        "Crucially, our prototype enforces a strict Mastery Learning requirement: to complete Week 3, learners must get 5 out of 5 on the scam check. "
        "In digital finance, a good savings budget cannot protect a student if they surrender their mobile wallet PIN. Mistakes cost nothing here, so unlimited retries are provided until safety is mastered.\n\n"
        "Let me now switch to our live web platform to demonstrate how this operates."
    )
    add_speech_card(doc, slide_8_speech, header="SPEAK THIS VERBATIM ON SLIDE 8 (~60 SECONDS):")
    
    add_h1(doc, "Part 2: Live Platform Walkthrough (In Browser)")
    add_p(doc, "Press Alt+Tab or Cmd+Tab to bring up http://localhost:3000/course. Follow these 6 stops in order:")
    
    add_action_card(
        doc,
        step_num=1,
        title="Orientation & Offline Downloads (Top of Page)",
        action_desc="Point your cursor at the two download buttons at the top banner.",
        what_you_see="Green header, Addo Mensah (STUDENT) badge on top right, and download buttons: 'Download 2-Page Offline Note (PDF)' and 'Download Week 3 Offline Pack (ZIP)'.",
        speech_text="When rural learners access the platform, they are immediately signed in with zero-friction access. Because connectivity and power in rural communities are intermittent, the first thing learners can do is download the 2-page PDF note and the complete offline ZIP package before their data bundle runs out."
    )
    
    add_action_card(
        doc,
        step_num=2,
        title="Activity 02 & 03: Media Viewer & Captions",
        action_desc="In top navigation bar, click 'Week 3 (Active)' (or scroll down to Section 3).",
        what_you_see="An embedded PDF viewer for the 2-page note, followed by an HTML5 video player with English subtitles and a clickable transcript.",
        speech_text="Here are Activities 02 and 03. Learners can read the summary note directly on the page and watch the instructional video with synchronized English captions and an expandable transcript."
    )
    
    add_action_card(
        doc,
        step_num=3,
        title="Activity 04: Simulated SMS Scam Sandbox (High Impact!)",
        action_desc="Scroll to Activity 04 and click the blue link 'Reveal Model Analysis' on Case 1.",
        what_you_see="A mobile-phone mockup with simulated SMS: 'Urgent: MTN MoMo KYC update required...'. Clicking reveals official warning signs (unverified link, urgency, PIN request).",
        speech_text="In Activity 04, learners test their instincts on 5 simulated SMS scams. They type their diagnosis and reveal the facilitator's model analysis to verify their reasoning in a safe environment where a mistake costs zero cedis."
    )
    
    add_action_card(
        doc,
        step_num=4,
        title="Activity 05 & 06: Forum & Collaborative Wiki",
        action_desc="Scroll down to Activity 05 and Activity 06.",
        what_you_see="Forum posts by course lecturer Charity Adjei and students Addo Mensah and Millicent Kumado. Below is the Group Savings Plan Wiki with revision tabs (Addo Mensah and Millicent Kumado) and 4-point rubric.",
        speech_text="Activities 05 and 06 support social learning. Students discuss verification rules in the forum and collaborate on a shared wiki to produce a group savings plan, which is submitted and graded against our 4-point rubric."
    )
    
    add_action_card(
        doc,
        step_num=5,
        title="Activity 07 & 08: The 5/5 Scam Mastery Quiz",
        action_desc="Click 'Scam Mastery' in the top navigation bar.",
        what_you_see="The 5-Question Scam Mastery Check card with immediate explanations for each answer.",
        speech_text="Activity 08 enforces our core design criterion: the 5 out of 5 Scam Mastery Check. Scoring 4 out of 5 prompts a retry loop, ensuring no student passes until they demonstrate 100% scam identification."
    )
    
    add_action_card(
        doc,
        step_num=6,
        title="The Lecturer Console & Gradebook (The Showstopper!)",
        action_desc="In the top navigation bar, click 'Staff / Lecturer Tools' (or switch role to Lecturer). Then click 'Class Gradebook'.",
        what_you_see="A dark Facilitator Console slides open. The Gradebook shows student scores (Addo Mensah 10/10 practice, 5/5 scam mastery) and rubric evaluation buttons.",
        speech_text="Finally, we built a dedicated Staff Console. Facilitators have full visibility into the Class Gradebook, can track quiz attempts, and evaluate group submissions with rubric sliders in real time."
    )
    
    add_h1(doc, "Part 3: Handover to Next Speaker")
    add_p(doc, "Press Alt+Tab or Cmd+Tab back to PowerPoint and advance to Slide 9 ('EVALUATE · TASK F: EVALUATION'). Say:")
    add_speech_card(
        doc,
        "This concludes the demonstration of our working prototype. I will now hand over to our evaluation lead to discuss how we evaluate learner performance against our targets.",
        header="HANDOVER SCRIPT (10 SECONDS):"
    )
    
    add_h1(doc, "Part 4: Lecturer Q&A Defense")
    add_qna(
        doc,
        "Why build a dedicated web application instead of staying in Moodle?",
        "Standard Moodle is bandwidth-heavy and lacks native interactive SMS simulation widgets. Our custom Next.js web application is lightweight, mobile-first, operates completely offline with local storage, and provides tailored interactive diagnostic tools."
    )
    add_qna(
        doc,
        "How does the platform handle poor or missing internet in rural areas?",
        "All notes and packs are downloadable upfront. The web app stores progress, quiz attempts, and drafts in browser local storage. Learners prepare offline and sync in seconds during their weekly supervised school ICT session."
    )
    add_qna(
        doc,
        "Why require 5 out of 5 instead of 80% passing on the scam quiz?",
        "In mobile money, falling for even one scam can wipe out a student's entire school fee savings. Under Skinner's mastery learning principles, students receive immediate explanations and unlimited retries until they achieve 100% accuracy."
    )
    
    return doc

# ==============================================================================
# DOC 2: Full Team Presentation Scripts (All Other Slides)
# ==============================================================================
def build_all_slides_script():
    doc = setup_dark_document()
    add_title(doc, "MoneyWise SHS — Complete Slide Scripts", "MASTER SPEAKER NOTES FOR ALL OTHER SLIDES (SLIDES 1–7, 9–12) (DARK MODE)")
    
    add_h1(doc, "Slide 1: Title & Course Overview")
    add_p(doc, "MoneyWise SHS: A four-week online course that teaches rural SHS learners to budget, save safely and spot mobile money scams. 40 learners in SHS 2, 16–18 years old, 4 weeks, about 2 hours each.", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "Good day, Madam Charity Adjei and colleagues. We are Group 4 presenting our course design and working prototype for MoneyWise SHS.\n\n"
        "MoneyWise SHS is a four-week, blended e-learning program designed specifically for rural Senior High School learners in Ghana. "
        "Our pilot cohort consists of 40 SHS 2 students aged 16 to 18. Over four weeks, spending roughly two hours per week, "
        "learners develop practical, real-world skills to create a weekly budget, save safely using formal channels, and detect fraudulent mobile money requests.",
        header="SLIDE 1 SCRIPT:"
    )
    
    add_h1(doc, "Slide 2: Today's Roadmap (The ADDIE Model)")
    add_p(doc, "We followed five design steps: Analyse (Tasks A, C) → Design (Tasks B, C) → Develop (Task D) → Implement (Task E) → Evaluate (Tasks F, G, H).", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "Our instructional design follows the five stages of the ADDIE framework:\n"
        "1. Analyse: We identified the gap between scam knowledge and scam action, and assessed the real-world device and data constraints of rural learners.\n"
        "2. Design: We established six targeted learning goals, aligned weekly instructional tasks, and integrated evidence-based learning theories.\n"
        "3. Develop: We built a fully operational, interactive web application focusing on Week 3.\n"
        "4. Implement: We planned delivery mechanisms, facilitator office hours, low-cost technical infrastructure, and accessibility support.\n"
        "5. Evaluate: We set four measurable success metrics and continuous feedback loops.\n\n"
        "Following our talk, we will also demonstrate a micro-teaching worked example and invite your questions.",
        header="SLIDE 2 SCRIPT:"
    )
    
    add_h1(doc, "Slide 3: Analyse · Task A: The Problem")
    add_p(doc, "Knowing about scams is not enough; learners need practice. Tell needs from optional spending, work out affordable weekly amount, recognise suspicious money request, explain safe saving plan. Question: How can a rural school give repeated supported practice?", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "In Task A, our problem analysis revealed a fundamental insight: simply knowing about scams does not prevent fraud; students need deliberate practice.\n\n"
        "Specifically, learners must master four competencies:\n"
        "1. Distinguishing essential needs from discretionary wants.\n"
        "2. Calculating a realistic, sustainable weekly savings contribution.\n"
        "3. Recognizing subtle social-engineering red flags in mobile money messages.\n"
        "4. Explaining a verified safe saving and risk-management plan.\n\n"
        "This led to our guiding design question: How can a rural Senior High School deliver repeated, supported practice when smartphones are shared, electricity is unpredictable, and connectivity varies?",
        header="SLIDE 3 SCRIPT:"
    )
    
    add_h1(doc, "Slide 4: Analyse · Task A: Why E-Learning?")
    add_p(doc, "Online practice is safe, repeatable and gives instant feedback. 1) Practise with fake messages (A mistake costs nothing), 2) Repeat any time, 3) Instant feedback (Web app explains each answer), 4) Progress is recorded. Our model: Blended, with a facilitator.", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "To solve this challenge, e-learning offers advantages that traditional chalk-and-talk lectures cannot match:\n"
        "• Zero-Risk Simulation: Students analyze authentic phishing messages where an error costs zero cedis.\n"
        "• Unlimited Repetition: Scenarios and quizzes can be revisited at each student's individual pace.\n"
        "• Immediate Explanations: The system explains why an answer is safe or risky the moment a choice is submitted.\n"
        "• Automated Progress Tracking: Facilitators immediately see which students are excelling and who needs remedial guidance.\n\n"
        "We chose a blended delivery model: learners read downloaded notes independently, attend a weekly supervised school ICT session, and submit their collaborative work online.",
        header="SLIDE 4 SCRIPT:"
    )
    
    add_h1(doc, "Slide 5: Analyse · Task C: The Learners & Context")
    add_p(doc, "We designed around what rural learners actually have: 1) Shared school computers & family phones → Mobile-friendly pages + offline pack; 2) Uneven power & mobile data → Small file sizes + 48-hour extension; 3) First-time online learners → Zero-friction login, simple UI, orientation.", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "Task C analyzed our learners' real operating environment. We designed specifically for the constraints rural SHS learners face daily:\n"
        "• Device Access: Most learners share desktop computers in the school ICT lab or borrow family smartphones. We built a fully responsive web application and provided an offline download pack.\n"
        "• Power and Connectivity: Load-shedding and limited data bundles are common. We kept asset file sizes small (under 1 MB), enabled offline local storage caching, and instituted a flexible 48-hour deadline extension window.\n"
        "• Digital Experience: Many students are first-time LMS users. We removed registration barriers with instant demonstration logins and included an orientation module with practice tasks.",
        header="SLIDE 5 SCRIPT:"
    )
    
    add_h1(doc, "Slide 6: Design · Task C: Goals & Weekly Plan")
    add_p(doc, "Six clear goals spread over four weeks: Week 1 (Needs vs Wants - Quiz 8/10), Week 2 (Weekly Budget - 4 checks), Week 3 (Save Safely, Spot Scams - 5/5 check), Week 4 (Compare & Review - Short answer + checklist).", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "In Task C, we applied Biggs’ Constructive Alignment to define six measurable learning goals across four weeks:\n"
        "• Week 1: Goal 1 covers identifying needs versus wants, assessed through an 8 out of 10 practice quiz.\n"
        "• Week 2: Goal 2 requires students to construct a weekly budget for a fictional student, evaluated against four arithmetic checks.\n"
        "• Week 3 (Our Implemented Prototype): Goal 3 targets spotting common mobile money scams, while Goal 4 focuses on collaborative group savings planning. This module requires a strict 5 out of 5 scam mastery score.\n"
        "• Week 4: Goals 5 and 6 involve comparing regulated savings institutions and writing a personal financial reflection.",
        header="SLIDE 6 SCRIPT:"
    )
    
    add_h1(doc, "Slide 7: Design · Task B: Learning Theory")
    add_p(doc, "Three simple ideas shape every learning activity: 1) Feedback and retry (Skinner, 1954), 2) Short input, worked example (Mayer, 2009), 3) Learning together (Vygotsky, 1978).", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "Task B grounded our design in three proven educational theories:\n"
        "1. Behaviorist Mastery Learning (B.F. Skinner, 1954): Immediate feedback and unlimited retries allow students to learn from mistakes until mastery is achieved.\n"
        "2. Cognitive Load & Multimedia Theory (Richard Mayer, 2009): We present information in bite-sized chunks followed by worked examples (for instance, showing how saving GHS 80 over 8 weeks equals GHS 10 per week) before asking learners to calculate independently.\n"
        "3. Social Constructivism (Lev Vygotsky, 1978): Through our group savings wiki and discussion forum, learners negotiate realistic budgets and support each other's understanding within their Zone of Proximal Development.",
        header="SLIDE 7 SCRIPT:"
    )
    
    add_h1(doc, "Slide 9: Evaluate · Task F: Evaluation Targets")
    add_p(doc, "Four targets will show whether the course works: 1) ≥85% weekly participation, 2) ≥80% course completion, 3) ≥90% pass scam check by 3rd try, 4) ≥4.0/5 learner rating. Evidence: Quiz results, Marked work, 8-question survey, Classroom observation.", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "In Task F, we established four clear, measurable evaluation targets:\n"
        "1. Engagement: At least 85% of enrolled learners participate in weekly activities.\n"
        "2. Completion: At least 80% successfully submit all required assignments and quizzes.\n"
        "3. Mastery: At least 90% pass the 5-question scam mastery check by their third attempt.\n"
        "4. Satisfaction: Achieve an average learner rating of at least 4.0 out of 5.0 on our 8-question end-of-course survey.\n\n"
        "We collect triangulated evidence across automated quiz logs, facilitator-graded rubrics, survey questionnaires, and facilitator classroom observations.",
        header="SLIDE 9 SCRIPT:"
    )
    
    add_h1(doc, "Slide 10: Micro-Teaching · Worked Example")
    add_p(doc, "Check a 'wrong transfer' message before paying. Fictional message: 'I sent GHS200 to you by mistake. Refund it to me now!' 1) What concerns you? 2) Safe first step? 3) What to never do?", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "To illustrate how our micro-teaching operates, let us examine a worked example from Activity 04.\n\n"
        "A student receives an SMS saying: 'I sent GHS 200 to you by mistake. Refund it to me now!'\n"
        "• Step 1 — Identify the concern: The sender uses urgency and emotional pressure. A text message alone is never proof that money entered your wallet.\n"
        "• Step 2 — Safe first action: Never send money back immediately. Dial your network's official USSD code or open your app to inspect your official transaction history.\n"
        "• Step 3 — Absolute rule: Never refund money under pressure and never disclose your PIN to reverse a transaction.",
        header="SLIDE 10 SCRIPT:"
    )
    
    add_h1(doc, "Slide 11: Team Roles & Responsibilities")
    add_p(doc, "Corneille (Project Manager), Selorm (Instructional Designer), Augustine (Content Developer), Israel (Technology/LMS Lead), Millicent Kumado (Evaluation/Quality Lead), Addo (Learning Analyst/Presentation Lead).", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "Our multidisciplinary team divided responsibilities to ensure both instructional rigor and technical reliability:\n"
        "• Corneille: Project Manager — overseeing timelines, resource allocation, and milestone delivery.\n"
        "• Selorm: Instructional Designer — structuring course objectives, lesson sequencing, and pedagogical alignment.\n"
        "• Augustine: Content Developer — authoring reading materials, scam scripts, and facilitator guidelines.\n"
        "• Israel: Technology & LMS Lead — building and deploying our interactive Next.js web application.\n"
        "• Millicent Kumado: Evaluation & Quality Lead — designing rubrics, evaluation criteria, and survey instruments.\n"
        "• Addo: Learning Analyst & Presentation Lead — synthesizing learner performance data and coordinating team presentations.",
        header="SLIDE 11 SCRIPT:"
    )
    
    add_h1(doc, "Slide 12: Sources & References")
    add_p(doc, "Scam and saving advice (Cyber Security Authority, Bank of Ghana), Course design (Branch ADDIE, Biggs Constructive Alignment, Black & Wiliam Feedback), Learning theory (Skinner, Mayer, Vygotsky), Platform & Access (WCAG 2.2, Next.js).", bold_prefix="Slide Content:")
    add_speech_card(
        doc,
        "Our course design is grounded in authoritative industry and academic standards:\n"
        "• Financial and Cyber Safety: Built upon official guidelines from the Cyber Security Authority of Ghana (CSA) and the Bank of Ghana Financial Literacy series.\n"
        "• Instructional Engineering: Informed by Branch's ADDIE framework, John Biggs' Constructive Alignment, and Black & Wiliam's formative assessment models.\n"
        "• Educational Psychology: Supported by Skinner's reinforcement principles, Mayer's multimedia design rules, and Vygotsky's collaborative learning theory.\n"
        "• Technical Accessibility: Implemented in accordance with W3C Web Content Accessibility Guidelines (WCAG 2.2) to ensure high legibility and contrast on mobile devices.\n\n"
        "Thank you for your time, Madam Charity Adjei. We welcome your questions.",
        header="SLIDE 12 SCRIPT:"
    )
    
    return doc

if __name__ == "__main__":
    print("Generating Document 1: Prototype Guide...")
    doc1 = build_prototype_guide()
    out1_root = "/Users/CEO/Desktop/moneywise-web-app/MoneyWise_Personal_Prototype_Guide_DARK.docx"
    out1_pub = "/Users/CEO/Desktop/moneywise-web-app/public/MoneyWise_Personal_Prototype_Guide_DARK.docx"
    doc1.save(out1_root)
    doc1.save(out1_pub)
    print(f"Saved: {out1_root}")
    print(f"Saved: {out1_pub}")
    
    print("\nGenerating Document 2: All Other Slides Script...")
    doc2 = build_all_slides_script()
    out2_root = "/Users/CEO/Desktop/moneywise-web-app/MoneyWise_All_Slides_Presentation_Scripts_DARK.docx"
    out2_pub = "/Users/CEO/Desktop/moneywise-web-app/public/MoneyWise_All_Slides_Presentation_Scripts_DARK.docx"
    doc2.save(out2_root)
    doc2.save(out2_pub)
    print(f"Saved: {out2_root}")
    print(f"Saved: {out2_pub}")
    print("\nAll documents generated successfully!")

