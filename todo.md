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
