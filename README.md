# The Work Odyssey

An AI-run HR performance & appraisal experience where every employee's work is visualized as a voyage on a hand-drawn old sea chart.

![The Work Odyssey - Main Map View](assets/mockup.png)

## Concept

The Work Odyssey reimagines performance tracking and HR appraisals through a narrative, visual interface inspired by ancient maritime charts. Instead of sterile dashboards and cold metrics, employees see their work as an evolving journey across a living sea map.

### The Map as Mirror

**Islands** represent tasks and commitments:
- Active islands: current work in progress
- Stormy waters near your ship: work that needs immediate attention
- Sinking, faded islands: forgotten commitments you can rescue or dismiss
- **The Shipped Continent**: your completed work, growing with each achievement

**Your Ship** is positioned on the map based on your current focus. Click the ship to zoom into the deck.

![The Deck View](assets/deck.png)

**The Crew** represents your close collaborators, visible when you board your ship:
- **First Mate**: your closest collaborator (most shared threads, calls, co-authored work)
- **Navigator**: the person you go to for direction
- **Quartermaster**: checks your cargo (frequent PR reviewer)
- **Lookout**: spots trouble early (flags incidents and bugs)
- **Deckhands**: wider circle of regular collaborators

Each crew member shows their role, bond strength (1-5), and recent interactions.

![Crew Member Detail](assets/deck-card.png)

**The Distant Fleet**: your circle of influence—people who rely on you.

### Demo

Watch the full interaction flow:

https://github.com/user/repo/blob/main/assets/flow.mp4

*(Or download and view [assets/flow.mp4](assets/flow.mp4) directly)*

## Navigation

**Simple, collapsible left sidebar** organizes everything into four sections with plain-English labels:

- **My Voyage**: Map (home), Ithaca (goals), Calypso's Island (stuck work)
- **Check-ins**: Captain's Log (weekly), Three Trials (monthly)
- **Crew & Fleet**: My Crew, Recruit a Crew Member, Ports of Call, The Armada (team view)
- **Chronicle**: Chapters of the Epic, Gifts from the Gods

Active view is highlighted, breadcrumb shows where you are, **Esc closes** modals and returns to map, **? button** shows legend explaining every metaphor.

**First-visit onboarding**: 3-step Athena tour (skippable, "replay tour" link) explaining the map metaphor and sidebar.

![Navigation with Sidebar](assets/nav-sidebar-open.png)

## Features

### Current Prototype (Single-file HTML)

✅ **Interactive hand-drawn sea chart** with animated elements  
✅ **Island states**: active, overdue (red border + storm), and sinking/forgotten (faded with blur)  
✅ **Ship click-to-zoom** transition into the deck view  
✅ **Animated crew members** with unique appearance, roles, and personalities  
✅ **Crew detail cards** showing bond strength and recent interactions  
✅ **Week navigation** to explore historical voyage data  
✅ **Privacy toggle** (🔒 Private view) to hide/show forgotten work  
✅ **Voyage log** with natural-language weekly summary  
✅ **Stats dashboard**: Shipped, Needs Attention, Sinking counts  
✅ **Legend** explaining map symbols and visual language  
✅ **Source tags** (Slack, Zoom, GitHub) linking work to its origin  
✅ **Compass rose** and period-appropriate typography  
✅ **Example data** clearly marked throughout

### ✨ AI Check-In Features

#### 📜 Weekly Captain's Log (~2 minutes)

![Captain's Log](assets/captains-log.png)

A scroll delivered by **Athena** (your AI guide) summarizing your week:
- **Islands Reached** (completed work)
- **Stormy Waters** (needs attention)
- **Sinking Islands** (forgotten commitments — private by default)

**Interactive Corrections:**
- **"Aye, that's right"** — Confirm the AI got it right
- **"Not quite"** — Inline edit to correct the details
- **"Missing context"** — Add a one-line note about what the AI missed

**Horizon View:**
- **Ithaca** (Q4 expectations) shown as destination with progress bar and coaching
- **The Sirens** (distractions) — e.g., "8 hours in meetings slowed your API migration"
- **Crew Gifts** (Slack kudos from teammates)

Corrections visibly update the map. **"Draft — you're the captain"** label reinforces that this is your truth, not an evaluation.

#### ⚔️ Monthly Three Trials (~5 minutes)

![Three Trials](assets/three-trials.png)

The month as an epic chapter. AI identifies your 3 hardest problems as monsters:
- **🦹 The Cyclops** = blocker (single point of failure)
- **⚡ Poseidon's Storm** = incident (production fire, cascade failure)
- **⚓ Scylla & Charybdis** = trade-off (no good choice, pick the least bad)

**Per Trial:**
- **Confirm** — AI got it right
- **Swap for a harder one** — Add your own challenge
- **Add backstory** — Why was this hard? Who helped? What would you do differently?

**Epic Rendering:**
After you've confirmed or edited all three trials, the AI renders your month as mock-epic prose incorporating your words:

> *"In the waning days of October, you faced three trials... First came The Cyclops, guardian of the legacy fortress. Spent 3 weeks untangling session logic. Teammate A pair-programmed the critical refactor..."*

**Privacy:** Corrections private by default. You choose what to share with your manager.

### Check-In Philosophy

🎯 **Draft, not verdict** — Check-ins are collaborative corrections, not performance reviews  
🎮 **Feels like play** — Swapping monsters, writing epic backstories, correcting Athena's observations  
🏷️ **Labeled data** — Your corrections teach the AI what "hard" means to you, improving future summaries  
📊 **No scores or rankings** — Direction and coaching, never grades  
🔒 **Privacy-first** — Forgotten work and backstory edits are private unless you choose to share

### 📚 Epic Features

#### Chapters of the Epic
Your monthly journey told as mock-epic prose. Each month becomes a chapter incorporating Three Trials corrections. Edit, annotate, and choose what to share. Example: *"In the waning days of October, you faced three trials..."*

#### 🏝️ Calypso's Island
Projects stuck too long (age, last activity). Gentle framing with three actions:
- **⛵ Set sail** — Plan next step
- **🤝 Ask crew for help** — Get unblocked
- **🌊 Let it go** — Release what no longer serves

#### 🎁 Gifts from the Gods
Treasure-chest gallery of kudos/recognition from Slack, GitHub, etc. Open a chest to read the full message. Who gave it, when, and why.

#### 🚢 The Armada (Manager View)
Team overview where each team is a fleet of ships. Highlights:
- Ships sailing alone
- Overloaded crews
- Outcomes only, no message content, no rankings
Labeled "Manager view" to set expectations.

#### 🤝 Recruit a Crew Member
AI suggestions of people whose islands overlap with yours but you rarely work with. Shows overlap area and reason. "Say ahoy" action (no actual messages sent in prototype).

#### ⚓ Ports of Call
Cross-team projects as harbors where several ships dock. Click to see teams, shared islands, and status. Example: "API v2 Migration — 3 teams docked, final sprint before launch"

#### 🦉 Athena's Counsel
Gentle daily nudge as a dismissible notification on the map. Example: *"Teammate H has been waiting on your review for 6 hours."* History of past counsel available.

#### 🏛️ Ithaca, the North Star
Q4 manager expectations + personal career goals. Each goal shows:
- Progress bar (heading toward Ithaca)
- Coaching line from Athena (direction, not grades)
Links from Captain's Log Ithaca section.  

### Privacy Principles

🔒 **The map is a mirror first, appraisal input second.**
- Forgotten/sinking islands are **private by default** and visible only to the employee
- Managers see outcomes and shipped work, not the forgotten waters
- **Never score from the sea alone**: performance is contextual, not purely metric-based

🛡️ **Transparency in data sources:**
- All data sources are labeled (Slack, Zoom, GitHub)
- Sync timestamp clearly displayed
- EXAMPLE DATA badge shown in prototype

## Data Source Roadmap

### Phase 1: Foundation (Current Prototype)
- ✅ Static example data
- ✅ Visual design system
- ✅ Interaction patterns

### Phase 2: Live Integrations (Future)
- [ ] **Slack**: threads, DMs, reactions, mentions
- [ ] **Zoom**: meeting attendance, duration, participant lists
- [ ] **GitHub**: PRs, reviews, commits, issues
- [ ] **Calendar**: meeting patterns, time blocking

### Phase 3: Collaboration Graphs (Future)
- [ ] Circle of influence mapping
- [ ] Bond strength algorithm (weighted by interaction frequency, recency, and type)
- [ ] Team network visualization

### Phase 4: AI Intelligence Layer (Future)
- [ ] Natural language voyage logs (weekly summaries)
- [ ] Sentiment analysis from communication patterns
- [ ] Proactive "storm warnings" for at-risk commitments
- [ ] Smart rescue/dismiss suggestions

## How to Run

**Just open `index.html` in a modern web browser.** No build process, no dependencies, no server required.

```bash
# Clone the repository
git clone https://github.com/user/repo.git
cd repo

# Open in your browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

Or simply double-click `index.html` in your file explorer.

Works best in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Technical Details

- **Single-file prototype**: All HTML, CSS, and JavaScript in `index.html`
- **No frameworks**: Vanilla JavaScript for maximum portability
- **SVG-based graphics**: Hand-drawn aesthetic with filters and animations
- **Web fonts**: IM Fell English (nautical headings), Caveat (handwritten labels), Inter (UI)
- **Responsive**: Designed for 1440×900 viewport (desktop-first)

## Buoyancy Note: The Hull

This prototype is the **aesthetic and interaction layer**—the sails catching wind. The hull (data infrastructure) needs:

1. **Company-owned data pipeline**: Slack/Zoom/GitHub API integrations
2. **Review workflow embedding**: How managers use odyssey data in formal reviews
3. **Low scaffolding**: intentionally narrative-driven, not metric-obsessed

The Work Odyssey is designed to be embedded into existing HR systems, not to replace them. Think of it as a **humanizing layer** on top of performance data.

## File Structure

```
/
├── index.html                    # The complete working prototype (1049 lines, 80KB)
├── assets/
│   ├── mockup.png               # Main map view screenshot
│   ├── deck.png                 # Deck view screenshot
│   ├── deck-card.png            # Crew detail card screenshot
│   ├── captains-log.png         # Weekly Captain's Log check-in
│   ├── three-trials.png         # Monthly Three Trials check-in
│   ├── nav-sidebar-open.png     # Sidebar navigation
│   ├── nav-main-map.png         # Main map with new navigation
│   └── flow.mp4                 # Demo video of the interaction flow
├── README.md                    # This file
└── LICENSE                      # MIT License
```

## Testing & Verification

✅ **Verified in headless browser:**
- Page loads without console errors
- All critical elements present (sidebar, 9 views, modals, tour, legend)
- All 11 navigation items render
- Sidebar structure complete
- Tour and legend modals functional
- Captain's Log and Three Trials still work

⚠️ **Not fully verified (interactive testing timed out):**
- Click navigation between all views (structure present, clicks not tested end-to-end)
- All feature render functions (code present, visual verification incomplete)
- Athena's Counsel nudge timing

**Recommendation**: Manual testing in browser recommended to verify all click interactions.

## Contributing

This is a concept prototype. If you're interested in:
- Building out the data pipeline
- Integrating with real HR systems
- Expanding the visual language
- Adding accessibility features

Please open an issue to discuss!

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

**The Work Odyssey**: Where work is a journey, not a grind.  
*All data shown is EXAMPLE DATA for demonstration purposes.*
