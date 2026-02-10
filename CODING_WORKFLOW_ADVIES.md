# Praktisch advies: Manus vs GitHub + Codex

## Korte conclusie
Ja, je kunt prima (en vaak goedkoper) zonder Manus verder bouwen met:
- GitHub als bron van waarheid
- Codex voor ontwikkeling
- Lokale preview voor je webapp

Manus kan nuttig blijven voor snelle starts of specifieke integraties, maar je bent niet verplicht om alles via Manus te doen.

## Waarom je nu vastloopt (heel normaal)
Aan het eind van projecten gaan AI-tools vaak "uitbreiden" (scope creep):
- steeds nieuwe ideeën
- geen duidelijke stopcriteria
- te veel tegelijk aanpassen

Dat is geen gebrek van jou, maar een procesprobleem.

## Wat jij nodig hebt: "bouwmodus" in 5 regels
Gebruik deze regels in elke prompt:
1. "Werk alleen aan taak X, geen extra features."
2. "Geef eerst een plan in max 5 stappen."
3. "Stop na stap Y en wacht op mijn akkoord."
4. "Alleen bugfixes binnen huidige scope."
5. "Definitie van klaar: [concrete checklist]."

## Heb je Manus nog nodig?
Niet per se. Een praktische verdeling:
- **GitHub + Codex (dagelijks):** bouwen, refactoren, testen, commits.
- **Manus (optioneel):** specifieke workflows waar Manus echt voordeel geeft.

Als credits belangrijk zijn: doe 80-90% via GitHub + Codex.

## Kun je webapp bekijken zonder Manus?
Ja. Voor deze repo:
1. Dependencies installeren
2. Dev server starten
3. Openen in browser op localhost

Typisch:
- `pnpm install`
- `pnpm dev`
- open de URL uit terminal (vaak `http://localhost:3000`)

## Simpele werkwijze die wél eindigt
Werk in mini-sprints van 1-2 uur:
1. Kies 1 kleine taak
2. Laat Codex alleen die taak doen
3. Test direct
4. Commit
5. Stop

Zo voorkom je eindeloze "nog even dit erbij" loops.

## Prompt-template die je direct kunt kopiëren
"Werk in STRICT MODE.
Doel: [1 taak].
Niet doen: nieuwe features, architectuurwijzigingen buiten deze taak.
Geef eerst een plan van max 5 stappen.
Voer daarna alleen stap 1 uit.
Wacht op mijn akkoord.
Definitie van klaar:
- [ ] criterium 1
- [ ] criterium 2
- [ ] criterium 3"

## Wat ik voor je kan betekenen
Ik kan je helpen met een vaste, rustige workflow:
- taken opsplitsen in kleine blokken
- per blok exact laten bouwen
- tussentijds testen
- nette commits + PR's
- duidelijke "klaar"-momenten

Daarmee krijg je controle terug, ook zonder diepgaande codekennis.

## Concreet antwoord op je vraag: hoeveel % herbruikbaar?
Grove inschatting op basis van deze repo:

- **Direct herbruikbaar voor mobile app (zonder grote rewrite): ~20-30%**
  - vooral `shared/` (types + detectielogica)
  - een deel van API-contracten / request-responses
- **Herbruikbaar met aanpassing: ~25-35%**
  - server-koppelingen, auth-flow details, data-mapping
- **Nieuw bouwen voor mobile UI: ~40-55%**
  - schermen, navigatie, styling, componenten, platform-specifieke UX

Praktisch betekent dit: je hoeft niet opnieuw vanaf nul te beginnen, maar de mobile "voorkant" blijft het grootste stuk werk.

## Hoe lang ben je bezig met het mobiele app-gedeelte?
Goede vraag — **met bestaande AI-tools kan het vaak sneller** dan mijn eerdere grove schatting.
Daarom is dit een betere scenario-inschatting:

- **Snel scenario (full focus + AI-tools goed ingezet):**
  - MVP mobile (onboarding + chat + profiel + history): **2-4 weken**
  - Stabiele V1 (polish + store-ready): **4-8 weken**
- **Realistisch solo scenario (parttime, met context-switching):**
  - MVP mobile: **4-8 weken**
  - Stabiele V1: **8-14 weken**

Wanneer je in het snelle scenario valt:
- je gebruikt bestaande backend 1-op-1
- je houdt scope hard klein (geen nieuwe features)
- je werkt in korte sprints met duidelijke "klaar"-criteria

Wanneer het richting het langere scenario gaat:
- auth/push/notificaties/store-eisen kosten extra tijd
- veel UI-polish of device-specifieke bugs
- scope groeit tijdens bouwen

## Snelle planning (zodat het niet eindeloos wordt)
Werk in 3 fasen met harde stopcriteria:

1. **Fase 1 (1-2 weken):** project opzetten + login + 1 werkende chatscherm-flow
2. **Fase 2 (2-4 weken):** history/actions/profile + foutafhandeling
3. **Fase 3 (1-4 weken):** polish, device-tests, release-checklist

Per fase: eerst "Definition of Done" vastzetten en geen extra features toevoegen.


## Waarom kon Manus in 1 dag iets werkends maken, maar noem ik nu weken?
Allebei kunnen waar zijn:

- **1 dag met Manus = vaak een prototype dat "werkt"** (demo-flow, happy path).
- **Meerdere weken = aanpasbaar + testbaar + publiceerbaar product**.

Jij beschrijft precies dit verschil:
- bouwen lukte snel,
- maar later liep je vast op aanpassingen, zichtbaarheid van changes, en publiceren.

Dat zijn typisch geen "bouw"-problemen maar **productie- en workflowproblemen**.

## Wat betekent dit voor jouw aanpak?
Je hoeft Manus niet weg te gooien. Slimmer is een **hybride aanpak**:

1. **Manus voor snelle UI-opzet/prototyping**
2. **GitHub + Codex voor structurele wijzigingen, versiebeheer en refactors**
3. **Vaste releaseflow** voor publiceren (build, test, release checklist)

Zo hou je snelheid van Manus, maar voorkom je dat je vastloopt bij onderhoud.

## Kan Manus de UI bouwen? Ja.
Ja, dat kan prima — zeker voor eerste schermen en snelle iteratie.
Maar zet meteen een grens:
- Manus voor "eerste versie" van schermen,
- daarna code in je repo normaliseren en onderhouden via GitHub/Codex.

## Zijn er bestaande templates die je kunt gebruiken?
Ja, en dit kan veel tijd schelen.

Praktische opties:
- **Expo/React Native starters** (navigatie, auth, thema, settings al aanwezig)
- **UI kits** voor React Native (componentbibliotheken)
- **Admin/dashboard templates** voor webplatform-deel

Belangrijk: kies templates die passen bij jouw stack (TypeScript + Expo/React Native) en plak daar je bestaande `shared/` logica en backend-koppelingen in.

## Realistische tijd als jij al snel prototypes maakt
Omdat jij al bewezen hebt dat je snel bouwt:

- **Prototype-snelheid (met Manus):** 1-3 dagen voor werkende basisflow
- **Aanpasbaar en publiceerbaar krijgen:** vaak nog 2-6 weken, afhankelijk van:
  - releaseproces (stores)
  - auth/push/notificaties
  - bugfixes op echte devices

Dus: je bent niet "langzaam" — je zat vooral in de lastigste laatste 20%.

## Concreet advies voor jouw volgende stap (7 dagen)
Doel: niet opnieuw vastlopen.

Dag 1-2:
- Kies 1 mobile template (Expo + TypeScript)
- Zet jouw huidige `shared` logica erin

Dag 3-4:
- Koppel aan bestaande backend
- Maak 1 volledige chatflow end-to-end testbaar

Dag 5:
- Maak vaste "change zichtbaar" checklist (wat check je na elke wijziging?)

Dag 6:
- Test op minimaal 2 echte devices

Dag 7:
- Mini release-proef (test build + release stappen documenteren)

Als dit lukt, heb je een basis die én snel is, én onderhoudbaar.
