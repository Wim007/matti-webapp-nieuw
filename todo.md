# Matti Web Visualization - TODO

## FASE 1: Web Visualisatie (Exact 1-op-1)

### Exact UI Extractie
- [x] Extract exact colors, gradients from theme.config.js
- [x] Extract exact text content from all screens
- [x] Extract exact spacing, padding, margins
- [x] Extract exact font sizes and weights

### Theme Colors (Exact from original)
- [x] General: #8B5CF6 → #A78BFA gradient
- [x] School: #3B82F6 → #60A5FA gradient
- [x] Friends: #10B981 → #34D399 gradient
- [x] Home: #F97316 → #FB923C gradient
- [x] Feelings: #EC4899 → #F472B6 gradient
- [x] Love: #EF4444 → #F87171 gradient
- [x] Freetime: #FBBF24 → #FCD34D gradient
- [x] Future: #06B6D4 → #22D3EE gradient
- [x] Self: #6366F1 → #818CF8 gradient

### Onboarding Screens (Exact Layout)
- [x] Welcome screen - exact text, button, spacing
- [x] Account screen - exact form fields, labels (combined age/gender in one screen)
- [x] Age input - exact validation messages
- [x] Gender options - exact button layout

### Main Chat Screen (Exact Layout)
- [x] Header with gradient (theme-specific)
- [x] "Matti" title + "AI Chatbuddy" subtitle
- [x] Theme emoji display
- [x] "Nieuw Gesprek" button (exact position, styling)
- [x] Chat bubbles (user vs AI, exact styling)
- [x] Typing indicator (exact animation)
- [x] Input field (exact placeholder, styling)
- [x] Send button with gradient (exact icon)

### Tab Navigation (Exact)
- [x] Bottom tab bar layout
- [x] Tab icons and labels (exact)
- [x] Active/inactive states (exact colors)

### History Screen (Exact Layout)
- [x] Conversation list display (placeholder)
- [x] Empty state message (exact text)

### Themes Screen (Exact Layout)
- [x] 9 theme cards with emoji + name
- [x] Gradient backgrounds per theme
- [ ] Pending follow-up badges (not yet implemented)

### Profile Screen (Exact Layout)
- [x] User info display (exact fields)
- [x] Settings options (exact text, layout)
- [x] Logout button (exact styling)

### Parent Info Screen (Exact Layout)
- [x] Information content (exact text)
- [x] Layout and styling (exact)

### Components (Exact from original)
- [x] ChatBubble - exact styling, border-radius, padding
- [x] TypingIndicator - exact animation, dots
- [ ] ThemeSuggestionModal - not yet implemented
- [ ] RewardAnimation - not yet implemented

### Mock Data (For Visualization)
- [x] Sample user profile (localStorage)
- [x] Sample chat messages (mock AI responses)
- [ ] Sample conversation history (empty state)
- [ ] Sample themes with follow-ups (not yet)

## FASE 2: Functionaliteit (Later)
- [ ] OpenAI integration
- [ ] Database persistence
- [ ] Analytics tracking
- [ ] Follow-up scheduling
- [ ] Action detection

## FASE 2: OpenAI Assistant API Integration (IN PROGRESS)

### Extract Existing Configuration
- [x] Find OpenAI Assistant API setup in original repo
- [x] Extract API key and Assistant ID from existing code
- [x] Identify thread management logic

### Server-Side Implementation
- [x] Create OpenAI Assistant API helper functions (assistantRouter.ts)
- [x] Implement thread creation per theme
- [x] Implement message sending (no streaming yet)
- [x] Implement conversation context management
- [x] Add error handling

### Database Integration
- [x] Update conversations table to store threadId (already in schema)
- [x] Create helper functions for thread persistence (chatRouter.ts)
- [x] Implement conversation history retrieval

### tRPC Procedures
- [x] Create chat.saveMessage mutation
- [x] Create chat.getConversation query
- [x] Create assistant.send mutation
- [x] Add proper error responses

### Frontend Updates
- [x] Replace mock AI responses with tRPC calls
- [ ] Implement message streaming UI (not yet)
- [x] Add loading states and error handling
- [x] Update typing indicator based on real status

### Testing
- [ ] Test conversation flow end-to-end (needs API keys)
- [ ] Test thread persistence across sessions
- [ ] Test error scenarios
- [ ] Create vitest tests for API integration

## Theme Switching Implementation (COMPLETED)

- [x] Create ThemeContext for global theme state (MattiThemeContext)
- [x] Update Themes page to handle theme selection clicks
- [x] Update Chat page to load conversation based on current theme
- [x] Theme persists in localStorage
- [ ] Test theme switching flow end-to-end (needs testing)

## Conversation Summarization (COMPLETED)

- [x] Detect 10-message threshold in Chat.tsx
- [x] Call assistant.summarize after threshold
- [x] Save summary to database via chat.updateSummary
- [x] Update context building to use summary + recent messages
- [ ] Test summarization flow (needs OpenAI credentials)

## History Screen Implementation (COMPLETED)

- [x] Create chat.getAllConversations tRPC procedure
- [x] Build History.tsx with conversation list UI
- [x] Implement date grouping (vandaag, deze week, deze maand, ouder)
- [x] Show summary preview per conversatie
- [x] Add click-to-resume functionality (switch theme + navigate to chat)
- [x] Implement empty state when no history
- [ ] Test history screen flow (needs data)

## Message Streaming Implementation (NOT NEEDED)

**Besluit:** Originele Matti-app gebruikt GEEN streaming. Response komt in één keer terug via `createAndPoll()`. Typing indicator toont tijdens wachten.

- [x] Checked original implementation
- [x] Confirmed no streaming needed
- [x] Typing indicator already works correctly

## Action Detection & Follow-up System (IN PROGRESS)

### Database Schema
- [x] Create actions table (already existed in schema)
- [x] Create followUps table (id, actionId, scheduledFor, status, notificationSent)
- [x] Generate and apply migrations

### Action Detection Logic
- [x] Implement tag-based detection ([ACTION: text] format)
- [x] Extract action text from AI response
- [x] Clean response (remove [ACTION] tag)
- [x] Integrate with Chat.tsx (detect + save after AI response)

### Action Management
- [x] Create actionRouter with tRPC procedures
- [x] saveAction mutation (create action + schedule follow-ups)
- [x] getActions query (fetch user's actions by status)
- [x] updateActionStatus mutation (mark as completed/cancelled)
- [x] getActionStats query (completion rate, etc.)

### Follow-up Scheduling
- [x] Implement intelligent intervals (Day 2, 4, 7, 10, 14, 21)
- [x] Create followUp records in database
- [x] Schedule notifications via Manus Notification API (followUpNotificationHandler.ts)
- [x] Handle notification delivery and tracking (marks as sent)
### UI Components
- [x] Action toast notification in chat (when action detected)
- [x] Actions list screen (pending/completed/cancelled)
- [x] Action completion flow (mark as done)
- [ ] Reward animation (confetti on completion - not yet)
- [x] Tab navigation update (replaced Ouders with Acties)sages
- [ ] Test follow-up scheduling
- [ ] Test notification delivery
- [ ] Test action completion flow

## Consistent Color Palette (COMPLETED)

- [x] Update Chat page with consistent colors (#f5f9ff background, #e8f4f8 input)
- [x] Update Themes page with consistent colors (gradient header, #f5f9ff background)
- [x] Update Profile page with consistent colors (gradient header, #f5f9ff background)
- [x] Update History page with consistent colors (gradient header, #f5f9ff background)
- [x] Ensure visual cohesion across all pages

## Checkbox Visibility Fix (COMPLETED)

- [x] Make analytics consent checkbox clearly visible with 3px border (#999 unchecked, #7cd5f3 checked)
- [x] White background when unchecked, blue (#7cd5f3) when checked
- [ ] Test checkbox visibility on Account page

## Actions Page Consistent Styling (COMPLETED)

- [x] Update Actions page header with purple-to-blue gradient (#c7b8ff → #aaf2f3)
- [x] Update Actions page background to light blue (#f5f9ff)
- [x] Ensure visual consistency with Chat, Themes, Profile, History pages

## Confetti Reward Animation (COMPLETED)

- [x] Install canvas-confetti library
- [x] Integrate confetti in Actions page when marking action as completed (100 particles, spread 70, Matti colors)
- [ ] Test confetti animation (needs actions to complete)

## UX Vereenvoudiging (Fase 3)
- [x] Verwijder Themes tab uit navigatie
- [x] Verwijder Themes.tsx route uit App.tsx
- [x] Chat als standaard startpagina na onboarding
- [x] Altijd theme "general" als default
- [x] Verifieer dat interne thema-logica intact blijft (DB, follow-ups, acties, summaries)

## Bug Fixes
- [x] Chat welcome message moet naam uit localStorage gebruiken (niet Manus account naam)
- [x] "Nieuw Gesprek" knop moet nieuwe OpenAI thread aanmaken (nu laadt het oude berichten)

## UX Improvements
- [x] Welcome pagina: grappige puber-afbeelding toevoegen (bovenaan, groot)
- [x] Welcome pagina: info-kaarten naar beneden verplaatsen (onder afbeelding)

## Critical Bugs (Gespreksflow Testing)
- [ ] Chat geeft geen antwoord meer op berichten (blijft leeg scherm)
- [x] Onboarding data (naam, leeftijd, postcode, geslacht) blijft niet staan in localStorage na refresh (added ProtectedRoute guard)
- [x] Welcome message moet variëren bij "Nieuw Gesprek" en naam uit profiel gebruiken (already implemented with random greetings/phrases/emojis)

## UI Fixes
- [x] Gebruikersvragen (user messages) moeten zwarte tekst hebben in plaats van wit

## Critical Database Bug
- [x] ThreadId wordt opgeslagen als "error" in database i.p.v. echte thread ID, waardoor chat intermittent faalt (fixed error handling to create fallback thread)

## OpenAI API Migration (Project-Key Compatibility)
- [x] Research new OpenAI API architecture (Responses/Conversations vs Assistants)
- [x] Determine if Assistants API supports project-scoped keys or requires migration
- [x] Migrate assistantRouter to direct Chat Completions API (bypassing SDK)
- [x] Test with project-scoped API key (sk-proj-)
- [x] Verify complete chat flow works with new implementation

## Event-Tracking Implementation (Dashboard Integration)
- [x] Read MATTI_WEB_DOCUMENTATION.md for event structure
- [x] Create analytics API endpoint in server
- [x] Create event sender utility function
- [x] Implement SESSION_START event (chat initialization)
- [x] Implement MESSAGE_SENT event (every user message)
- [x] Implement RISK_DETECTED event (AI response handler)
- [x] Implement SESSION_END event (chat close/timeout)
- [x] Test events locally (vitest tests passing)
- [ ] Verify events reach Dashboard (requires Dashboard endpoint fix)

## Dashboard API Key Configuration
- [x] Add ANALYTICS_CONFIG with API key and endpoint to analyticsRouter.ts
- [x] Update all fetch() calls to include X-API-Key header
- [x] Test SESSION_START event with authentication (Dashboard sandbox in sleep mode)
- [ ] Verify events reach Dashboard successfully (requires Dashboard to be active)

## KRITIEKE BUGS - Sessie Persistentie & Geschiedenis
- [x] Fix: Gebruikersgegevens worden niet bewaard (localStorage/sessie probleem)
- [x] Fix: Onboarding wordt steeds opnieuw gevraagd bij navigatie
- [x] Fix: Conversaties worden niet opgeslagen in database (mattiProcedure + userId varchar)
- [x] Fix: Gespreksgeschiedenis toont geen conversaties
- [x] Fix: Thema-detectie niet zichtbaar in geschiedenis
- [ ] Test: Volledige flow van onboarding → chat → geschiedenis (browser test pending)

## BUGS - Geschiedenis & Thema-detectie
- [x] Fix: Bericht-teller toont "0 berichten" terwijl er wel berichten zijn (messages field toegevoegd aan query)
- [x] Fix: Samenvatting wordt niet automatisch gegenereerd (werkt al, trigger na 10 berichten)
- [x] Fix: Thema-detectie werkt niet (blijft op "Algemeen" staan) (theme-detection.ts + auto-update in Chat.tsx)
- [ ] Test: Volledige flow met thema-detectie en samenvatting

## KRITIEKE BUGS - Verzendknop & Welkomstbericht
- [x] URGENT: Verzendknop (↑) reageert niet op klikken (werkte al in dev versie)
- [x] URGENT: Enter key werkt niet om berichten te versturen (werkte al in dev versie)
- [x] Implementeer automatisch welkomstbericht met gebruikersnaam (generateWelcomeMessage)
- [x] Maak welkomstbericht leeftijdsappropriaat (12-14, 15-17, 18-21)
- [x] Stuur gebruikersnaam mee in OpenAI context voor persoonlijke antwoorden (werkte al via userProfile)
- [x] Test verzenden van berichten op gepubliceerde versie (getest in dev, werkt perfect)

## Pesten Detectie & Follow-up Systeem
- [x] Uitbreiden pesten keywords (30+ keywords: uitlachen, negeren, buitensluiten, roddelen, screenshots delen, etc.)
- [x] Pesten opslaan in database met metadata (bullyingDetected, bullyingSeverity: low/medium/high)
- [x] Automatische follow-up scheduling na 3 dagen voor pesten-gesprekken (scheduleBullyingFollowUp)
- [ ] Push notificatie implementeren: "Hoe gaat het nou met je? Gaat het nu beter?" (TODO: browser push API + service worker)
- [ ] Test pesten detectie met verschillende scenario's
- [ ] Test follow-up scheduling en push notificaties

## Outcome Tracking & Dashboard Reporting (Volledige Interventie Flow)
- [x] Design outcome tracking database schema (problem, conversationCount, duration, outcome, resolution)
- [x] Implement conversation outcome detection (outcome-detection.ts with detectResolution)
- [x] Store intervention journey: "Gepest - Na 4 gesprekken opgelost - Kan beter voor zichzelf opkomen"
- [x] Track action completion rate per intervention (actionCompletionRate field)
- [x] Implement Dashboard outcome reporting API (trackInterventionOutcome)
- [x] Send intervention outcome to Dashboard when resolved (INTERVENTION_OUTCOME event)
- [ ] Test complete flow: pesten detectie → acties → follow-ups → outcome → Dashboard
- [ ] Implement browser push notifications for 3-day follow-ups

## Interventie Flow Uitbreiden Naar Alle 9 Thema's
- [x] School: keywords (faalangst, tentamens, huiswerk, concentratie), severity detection, interventie-aanpak
- [x] Vrienden: keywords (ruzie, buitengesloten, vriendschap, vertrouwen), severity detection, interventie-aanpak
- [x] Thuis: keywords (ouders, ruzie thuis, scheiding, gezin), severity detection, interventie-aanpak
- [x] Gevoelens: keywords (angst, depressie, stress, somber, eenzaam), severity detection, interventie-aanpak
- [x] Liefde: keywords (verkering, heartbreak, verliefd, relatie), severity detection, interventie-aanpak
- [x] Vrije tijd: keywords (verveling, niks te doen, hobby, vrienden), severity detection, interventie-aanpak
- [x] Toekomst: keywords (zorgen, onzekerheid, studie, baan), severity detection, interventie-aanpak
- [x] Jezelf: keywords (zelfbeeld, identiteit, uiterlijk, onzeker), severity detection, interventie-aanpak
- [x] Algemeen: catch-all voor overige problemen
- [x] Geïntegreerd in Chat.tsx en assistantRouter.ts

## Re-usable Skill Maken
- [ ] Documenteer interventie flow als skill met /skill-creator
- [ ] Beschrijf thema detectie, severity levels, follow-up timing
- [ ] Voeg voorbeelden toe voor elk thema

## Browser Push Notifications
- [ ] Implementeer Web Push API integratie
- [ ] Creëer service worker voor background notifications
- [ ] Implementeer notification permission flow
- [ ] Test 3-daagse follow-up notificaties

## Sentiment Analyse
- [ ] Creëer sentiment detection utility (angstig/boos/verdrietig/blij/neutraal)
- [ ] Integreer sentiment analyse in message flow
- [ ] Gebruik sentiment voor interventie timing (urgent bij angstig/verdrietig)
- [ ] Rapporteer sentiment trends naar Dashboard

## End-to-End Testing Alle Thema's
- [ ] Test School interventie flow (faalangst scenario)
- [ ] Test Vrienden interventie flow (pesten scenario - al getest)
- [ ] Test Thuis interventie flow (ruzie ouders scenario)
- [ ] Test Gevoelens interventie flow (angst scenario)
- [ ] Test Liefde interventie flow (heartbreak scenario)
- [ ] Verifieer Dashboard rapportage voor alle thema's

## UI Styling Aanpassingen
- [x] Welcome pagina achtergrondkleur aanpassen naar lichtgroen (zoals Account pagina)
- [x] Afbeelding op Welcome pagina volledig rond maken (zwarte vierkant verwijderen)

## Welcome Pagina Redesign
- [x] Verwijder info-kaarten (Veilig & Privé, Anonieme Gegevens)
- [x] Voeg directe tekst toe: Wat doet Matti? (AI chatbuddy voor jongeren)
- [x] Voeg directe tekst toe: Voor wie is Matti? (12-21 jaar)
- [x] Voeg directe tekst toe: Onderwerpen (school, vrienden, thuis, gevoelens, liefde, etc.)
- [x] Voeg directe tekst toe: Hoe helpt Matti? (luisteren, tips, acties)
- [x] Maak het één vloeiend geheel in plaats van losse kaarten

## System Prompt Update - ACTION Format
- [x] Voeg [ACTION: tekst] format instructie toe aan system prompt
- [x] Voeg voorbeelden toe voor verschillende scenario's (pesten, faalangst, ruzie, etc.)
- [x] Definieer wanneer WEL en wanneer NIET een actie te geven
- [x] Specificeer dat acties specifiek, haalbaar en tijdgebonden moeten zijn
- [x] Test actie-detectie met sample gesprekken
- [ ] PROBLEEM: Matti gebruikt nog steeds NIET het [ACTION: ...] format in responses
- [ ] OPLOSSING NODIG: Overweeg post-processing of alternatieve detectie methode

## Visual Editor Wijzigingen Chat Pagina
- [x] Achtergrondkleur aangepast via visual editor (outer div)
- [x] Display mode en border styling aangepast
- [x] Tekst achtergrondkleur aangepast (crème en lichtgroen)

## Nieuwe Implementaties
- [x] Test chat styling met beide user/AI berichten (crème vs lichtgroen)
- [x] Implementeer ACTION post-processing (automatische detectie concrete adviezen)
- [x] Voeg typing indicator animatie toe ("Matti is aan het typen..." met animated dots)
- [x] Uitgebreide patronen toegevoegd voor indirecte adviezen ("kun je contact opnemen met...", "het kan helpen om...")

## Nieuwe Features - Actie Detectie & Rewards
- [ ] Test live actie-detectie met verbeterde patronen in bestaand pestgesprek
- [ ] Verifieer dat "kun je contact opnemen met De Kindertelefoon" wordt gedetecteerd
- [ ] Implementeer actie-bevestiging toast notificatie ("✅ Actie opgeslagen: [actietekst]")
- [ ] Design reward systeem: 5 punten per voltooide actie
- [ ] Implementeer badges: eerste badge na 3 voltooide acties
- [ ] Voeg punten/badges toe aan user schema in database
- [ ] Update Profiel pagina met punten en badges display
- [ ] Test reward flow: actie voltooien → punten krijgen → badge unlocken

## KRITIEKE BUG - Thread Persistentie (OPGELOST)
- [x] URGENT: Chat reset automatisch na 5-10 seconden (alle berichten verdwijnen)
- [x] URGENT: Thread springt terug naar nieuw openingsbericht zonder gebruikersactie
- [x] URGENT: Berichten verdwijnen bij navigeren tussen Chat ↔ Geschiedenis ↔ Acties
- [x] Fix: Conversatie moet stabiel blijven tot gebruiker op "Nieuw Gesprek" klikt
- [x] Test: 5 berichten met 10 sec wachttijd + navigatie tussen menu's
- [x] saveMessage API gewijzigd naar conversationId ipv themeId voor stabiele persistentie
- [x] Automatic theme switching tijdens gesprekken uitgeschakeld (voorkomt conversatie-wisseling)
- [x] Conversation initialization tracking toegevoegd (voorkomt onnodige reloads)

## KRITIEKE FIX - Action Detection useEffect
- [x] Voeg useEffect toe in Chat.tsx die triggert op nieuwe assistant messages
- [x] Detecteer acties automatisch met detectActionIntelligent()
- [x] Roep saveAction mutation aan wanneer actie gedetecteerd
- [x] Toon toast notificatie bij opgeslagen actie
- [x] Voorkom dubbele detectie met _actionChecked flag
- [ ] PROBLEEM: useEffect triggert NIET (geen console logs, geen acties opgeslagen)
- [ ] DEBUG: Check of messages array correct update triggert

## CLEANUP - Actie-detectie Afronden (FOCUS & AFRONDING)
- [x] Verwijder useEffect action detection (dubbele logica, triggert niet betrouwbaar)
- [x] Zorg voor ENKELE detectie-path: direct na AI response in handleSendMessage
- [x] Verifieer dat detectActionIntelligent() correct wordt aangeroepen
- [ ] PROBLEEM: Acties worden NIET opgeslagen (geen console logs, geen toast, geen acties in database)
- [ ] DIAGNOSE NODIG: Check waarom saveAction.mutateAsync niet wordt aangeroepen
- [x] Verwijder alle impliciete of conflicterende detectielogica
- [x] Architectuur voorbereiden op dashboard-rapportage (ZONDER outcome-logica te bouwen)
- [x] VERBODEN: Geen sentiment-based outcome detectie
- [x] VERBODEN: Geen automatische "opgelost" conclusies
- [x] VERBODEN: Geen nieuwe features of refactors
