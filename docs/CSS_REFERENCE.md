# CSS Class Reference - Mona Mayhem Battle Page

## Overview

This document describes all CSS classes used in the Mona Mayhem battle page styling. Classes are organized by purpose and include examples of when they're applied.

---

## Global / Layout Classes

### `.battle-form`
**Purpose:** Container for the main battle setup area.

**Applied To:** `<div>` wrapping both player inputs and battle button

**Styles:**
- Display: flex column layout
- Gap: 20px spacing between children
- Responsive on mobile

**Usage:**
```html
<div class="battle-form">
  <div class="input-group">...</div>
  <div class="vs">VS</div>
  <div class="input-group">...</div>
  <button id="battleBtn">⚔️ BATTLE!</button>
</div>
```

---

## Input & Form Classes

### `.input-group`
**Purpose:** Container for a single username input with its label.

**Applied To:** `<div>` wrapping label + input

**Styles:**
- Display: flex column
- Gap: 8px (space between label and input)

**Usage:**
```html
<div class="input-group">
  <label for="player1">Player 1</label>
  <input type="text" id="player1" />
</div>
```

**Variations:**
- Applied once per player input
- Two instances on page (Player 1, Player 2)

---

## Label & Text Classes

### `label`
**Purpose:** Style text labels above inputs.

**Applied To:** `<label>` elements

**Styles:**
- Font weight: 600 (bold)
- Text transform: uppercase
- Letter spacing: 0.5px
- Color: #333 (dark gray)

**Usage:**
```html
<label for="player1">Player 1</label>
```

---

### `.vs`
**Purpose:** Visual "VS" separator between player inputs.

**Applied To:** `<div>` with "VS" text

**Styles:**
- Text align: center
- Font size: 1.5rem
- Color: #667eea (purple)
- Padding: 10px (vertical)
- Font weight: bold

**Placement:**
- Between the two `.input-group` elements in form
- Purely decorative/visual separator

**Usage:**
```html
<div class="battle-form">
  <div class="input-group">...</div>
  <div class="vs">VS</div>
  <div class="input-group">...</div>
</div>
```

---

## Button Classes

### `button` (General)
**Purpose:** Style the battle button.

**Applied To:** Battle button (`#battleBtn`)

**Styles:**
- Background: Purple gradient (135deg angle)
- Color: White text
- Border: None
- Padding: 16px 32px
- Font size: 1.2rem
- Font weight: bold
- Border radius: 8px
- Cursor: pointer
- Transition: 0.2s smooth animation

**Base State:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
cursor: pointer;
```

**Usage:**
```html
<button id="battleBtn" type="button">⚔️ BATTLE!</button>
```

### `button:hover` (Pseudo-class)
**Purpose:** Visual feedback when user hovers over button.

**Applied To:** Battle button (except when disabled)

**Styles:**
- Transform: translateY(-2px) (lifts button slightly)
- Box shadow: 0 10px 20px rgba(102, 126, 234, 0.4)

**Effect:** Button appears to float up with shadow beneath it.

---

### `button:active` (Pseudo-class)
**Purpose:** Visual feedback when user clicks button.

**Applied To:** Battle button (except when disabled)

**Styles:**
- Transform: translateY(0) (returns to normal position)

**Effect:** Button "presses down" on click.

---

### `button:disabled` (Pseudo-class)
**Purpose:** Indicate button is not clickable during loading.

**Applied To:** Battle button when `disabled` attribute is true

**Styles:**
- Opacity: 0.6 (grayed out appearance)
- Cursor: not-allowed (hand cursor changes to "not allowed")

**When Applied:**
- After user clicks BATTLE (while fetching)
- Prevents multiple rapid clicks
- Removed after results display or error

**Usage:**
```javascript
battleBtn.disabled = true;   // Grays out button
battleBtn.disabled = false;  // Re-enables button
```

---

## Error Display Classes

### `.error`
**Purpose:** Container for error messages.

**Applied To:** `<div id="error">` element

**Base Styles (Hidden):**
- Display: none (default hidden)
- Background: #fee (light red)
- Color: #c33 (dark red)
- Padding: 12px 16px
- Border radius: 6px
- Margin top: 20px
- Border left: 4px solid #c33 (red accent stripe)

**Example:**
```html
<div id="error" class="error" role="alert"></div>
```

### `.error.show` (State Class)
**Purpose:** Show error message.

**Applied To:** Error div when error occurs

**Styles:**
- Display: block (makes visible)

**When Applied:**
- User doesn't enter both usernames
- API returns error (user not found, etc.)
- Network error or timeout

**When Removed:**
- User clicks BATTLE again (new battle)
- User successfully completes a battle

**Usage:**
```javascript
function showError(message: string) {
  errorDiv.textContent = message;
  errorDiv.classList.add('show');  // Adds .show class
}

function hideError() {
  errorDiv.classList.remove('show');  // Removes .show class
}
```

---

## Loading State Classes

### `.loading`
**Purpose:** Container for loading indicator animation.

**Applied To:** `<div id="loading">` element

**Base Styles (Hidden):**
- Display: none (default hidden)
- Text align: center
- Margin top: 30px
- Font size: 1.1rem
- Color: #667eea (purple)

### `.loading.show` (State Class)
**Purpose:** Show loading spinner.

**Applied To:** Loading div while fetching data

**Styles:**
- Display: block (makes visible)

### `.loading::after` (Pseudo-element)
**Purpose:** Animated "..." dots in loading message.

**Styles:**
- Content: '...' (animated)
- Animation: dots 1.5s steps(4, end) infinite
- Cycles through: . → .. → ... → repeat

**Visual Effect:**
```
Fetching battle data.
Fetching battle data..
Fetching battle data...
(repeats)
```

### `@keyframes dots` (Animation)
**Purpose:** Define dot animation frames.

**Frames:**
```
0%, 20%   → Show 1 dot "."
40%       → Show 2 dots ".."
60%, 100% → Show 3 dots "..."
```

**Duration:** 1.5 seconds, repeating infinitely

**Usage:**
```javascript
showLoading();           // Shows with "Fetching battle data"
showLoading('Custom message');  // Shows custom message
hideLoading();           // Hides
```

---

## Results Display Classes

### `.results`
**Purpose:** Container for battle results.

**Applied To:** `<div id="results">` element

**Base Styles (Hidden):**
- Display: none (default hidden)
- Margin top: 30px

### `.results.show` (State Class)
**Purpose:** Show results section.

**Applied To:** Results div after successful battle

**Styles:**
- Display: block (makes visible)

**When Applied:**
- After both users' data successfully fetched
- After winner determined and HTML rendered

### `.results-container`
**Purpose:** Wrapper for both player cards and VS badge.

**Applied To:** `<div>` inside results

**Styles:**
- Display: flex
- Flex direction: column
- Gap: 20px (space between elements)
- Align items: stretch (full width)
- Position: relative (for positioning VS badge)

**Contains:**
1. Player 1 result card
2. VS badge
3. Player 2 result card
4. Battle summary

---

## Player Result Classes

### `.player-result`
**Purpose:** Card styling for each player's results.

**Applied To:** `<div>` for each player data

**Styles:**
- Background: #f5f5f5 (light gray)
- Padding: 20px
- Border radius: 8px
- Flex: 1 (equal width in container)

**Usage:**
```html
<div class="player-result">
  <div class="player-name">octocat</div>
  <div class="player-stats">...</div>
  <div class="contribution-grid">...</div>
</div>
```

### `.player-result.winner` (State Class)
**Purpose:** Highlight card of winning player.

**Applied To:** Player card when `totalContributions` is higher

**Styles:**
- Background: Gradient (#ffeaa7 to #fdcb6e) (gold)
- Border: 3px solid #f39c12 (golden border)

**Effect:** Winner's card stands out with gold gradient and border.

**Example:**
```html
<!-- Winner's card -->
<div class="player-result winner">
  <div class="player-name">octocat 🏆 WINNER</div>
  ...
</div>

<!-- Loser's card (no .winner class) -->
<div class="player-result">
  <div class="player-name">torvalds</div>
  ...
</div>
```

---

## Player Stats Classes

### `.player-name`
**Purpose:** Username display styling.

**Applied To:** `<div>` containing username and optional trophy

**Styles:**
- Font size: 1.3rem
- Font weight: bold
- Margin bottom: 12px

**Content:**
- Username text
- Optional `.winner-badge` with trophy emoji

**Example:**
```html
<div class="player-name">
  octocat
  <span class="winner-badge">🏆 WINNER</span>
</div>
```

---

### `.winner-badge`
**Purpose:** Trophy badge showing winner.

**Applied To:** `<span>` inside `.player-name` (only for winner)

**Styles:**
- Display: inline-block
- Background: #f39c12 (gold)
- Color: white
- Padding: 4px 12px
- Border radius: 20px (pill shape)
- Font size: 0.9rem
- Font weight: bold
- Margin left: 10px
- Text: "🏆 WINNER"

**Visual:** Rounded pill with "🏆 WINNER" text

**Usage:**
```html
<!-- Applied only to winner -->
<span class="winner-badge">🏆 WINNER</span>
```

---

### `.player-stats`
**Purpose:** Container for contribution statistics.

**Applied To:** `<div>` containing stat rows

**Styles:**
- Font size: 1rem
- Color: #555 (medium gray)
- Margin bottom: 16px

**Contains:** Multiple `.stat-row` elements

### `.stat-row`
**Purpose:** Individual statistic (label + value).

**Applied To:** `<div>` for each stat

**Styles:**
- Display: flex
- Justify content: space-between (label left, value right)
- Margin bottom: 8px

**Contains:**
- `.stat-label` (left side)
- `.stat-value` (right side)

**Example:**
```html
<div class="stat-row">
  <span class="stat-label">Total Contributions:</span>
  <span class="stat-value">2,986</span>
</div>
<div class="stat-row">
  <span class="stat-label">Period:</span>
  <span class="stat-value">2025-04-13 to 2026-04-15</span>
</div>
```

### `.stat-label`
**Purpose:** Style label text in statistics.

**Styles:**
- Font weight: 600 (semi-bold)
- Color: #333 (dark gray)

### `.stat-value`
**Purpose:** Style numeric/text values in statistics.

**Styles:**
- Color: #667eea (purple, matches theme)
- Font weight: bold

---

## Contribution Graph Classes

### `.contribution-graph-label`
**Purpose:** Label above the contribution grid.

**Applied To:** `<div>` with text "Last Year Activity"

**Styles:**
- Font size: 0.9rem
- Font weight: 600 (semi-bold)
- Color: #666 (medium gray)
- Margin bottom: 10px
- Text transform: uppercase
- Letter spacing: 0.5px

**Example:**
```html
<div class="contribution-graph-label">Last Year Activity</div>
<div class="contribution-grid">...</div>
```

---

### `.contribution-grid`
**Purpose:** Container for the entire contribution graph visualization.

**Applied To:** `<div>` generated by `renderContributionGrid()`

**Styles:**
- Display: flex
- Flex direction: column
- Gap: 3px (space between weeks)
- Padding: 10px
- Background: white
- Border radius: 6px
- Overflow-x: auto (horizontal scroll on mobile)

**Contains:** Multiple `.contribution-week` elements (52-53)

**Size:** ~520px width (52 weeks × 10px/week)

### `.contribution-week`
**Purpose:** Single week row in the graph.

**Applied To:** `<div>` for each week

**Styles:**
- Display: flex
- Gap: 3px (space between days)

**Contains:** 7 `.contribution-day` elements

### `.contribution-day`
**Purpose:** Individual day square in the contribution graph.

**Applied To:** `<div>` for each day

**Styles:**
- Width: 12px
- Height: 12px
- Border radius: 2px (slight rounding)
- Cursor: pointer (indicates interactivity)
- Transition: opacity 0.2s (smooth hover)
- Background color: Inline style based on contribution level

**Background Colors (Inline):**
```
Level 0 → #ebedf0 (light gray)
Level 1 → #c6e48b (light green)
Level 2 → #40c463 (green)
Level 3 → #30a14e (dark green)
Level 4 → #216e39 (very dark green)
```

**Hover Effect:**
- Opacity: 0.8 (slight fade)

**Tooltip:**
- HTML title attribute: "Mon: 4 contributions"
- Shows on hover

**Example:**
```html
<div class="contribution-day" 
     style="background-color: #40c463;" 
     title="Mon: 4 contributions"></div>
```

### `.grid-placeholder`
**Purpose:** Message when contribution data unavailable.

**Applied To:** `<div>` when weeks array is empty

**Styles:**
- Padding: 20px
- Text align: center
- Color: #999 (light gray)
- Background: white
- Border radius: 6px
- Font size: 0.9rem

**Content:** "No contribution data available"

**Used For:**
- User with zero contributions
- API returned invalid data

---

## VS Badge Classes

### `.vs-badge`
**Purpose:** Visual "VS" separator between player cards.

**Applied To:** `<div>` in results-container between cards

**Styles:**
- Text align: center
- Font weight: bold
- Font size: 1.3rem
- Color: white
- Background: Purple gradient (same as button)
- Padding: 12px 20px
- Border radius: 8px
- Align self: center (centers horizontally)
- Margin: -10px 0 (overlaps cards slightly)
- Z-index: 10 (appears above cards)
- Box shadow: 0 4px 12px rgba(102, 126, 234, 0.4)

**Visual Effect:** 
- Appears "floating" between cards
- Purple gradient matches theme
- Shadow creates depth

**Content:** "VS"

**Example:**
```html
<div class="results-container">
  <div class="player-result">...</div>
  <div class="vs-badge">VS</div>
  <div class="player-result">...</div>
</div>
```

---

## Battle Summary Classes

### `.battle-summary`
**Purpose:** Announcement of battle winner/tie.

**Applied To:** `<div>` at bottom of results

**Styles:**
- Text align: center
- Margin top: 20px
- Padding: 15px
- Background: #667eea (purple, matches theme)
- Color: white
- Border radius: 8px
- Font size: 1.2rem
- Font weight: bold

**Content Examples:**
- "🎉 octocat wins with 514 more contributions!"
- "🎉 torvalds wins with 100 more contributions!"
- "🤝 It's a tie!"

---

## State Management CSS

### `.show` (State Class)
**Purpose:** Make element visible.

**Applied To:**
- `.error.show` → Shows error message
- `.loading.show` → Shows loading indicator
- `.results.show` → Shows results section

**Property:** `display: block` (toggle from `display: none`)

**JavaScript Usage:**
```javascript
// Show
element.classList.add('show');

// Hide
element.classList.remove('show');

// Toggle
element.classList.toggle('show');
```

---

## Responsive Design

### Mobile Breakpoints

**Small screens (<600px):**
- Flex direction adjusts for readability
- Padding reduced
- Font sizes may scale down

**Note:** All styles in this page are desktop-first with minimal mobile-specific changes.

---

## Color Palette Reference

| Usage | Color | Hex |
|-------|-------|-----|
| Primary (Button, Theme) | Purple | #667eea |
| Primary Dark (Gradient) | Deep Purple | #764ba2 |
| Success/Contribution | Green | #40c463 |
| Error (Background) | Light Red | #fee |
| Error (Text) | Dark Red | #c33 |
| Winner (Gold) | Gold | #f39c12 |
| Text (Primary) | Dark Gray | #333 |
| Text (Secondary) | Medium Gray | #555 |
| Background | Light Gray | #f5f5f5 |
| Border | Light Gray | #e0e0e0 |

---

## Animation Summary

### Dots Animation
- **Name:** `dots`
- **Duration:** 1.5 seconds
- **Repeat:** Infinite
- **Type:** Steps (4 frames)
- **Used in:** `.loading::after`

### Smooth Transitions
- **Button hover:** 0.2s transform + shadow
- **Contribution day hover:** 0.2s opacity
- **Input focus:** 0.2s border color

---

## CSS Organization

The styles are organized in the following order:

1. Global (`*`, `body`, `main`)
2. Headings (`h1`, `.subtitle`)
3. Form (`.battle-form`, `.input-group`, `input`, `label`, `.vs`)
4. Button (`button` and pseudo-classes)
5. Status (`.error`, `.loading`)
6. Results (`.results`, `.results-container`)
7. Player cards (`.player-result`, stats)
8. Contribution graph (`.contribution-grid` and parts)
9. VS badge
10. Battle summary
11. Animations (`@keyframes`)

---

## Related Documentation

- [Function Reference](./FUNCTION_REFERENCE.md) - Which classes are applied by functions
- [User Flow](./USER_FLOW.md) - When classes are added/removed
- [Source Code](../src/pages/index.astro) - Full CSS implementation
