# Function Reference - Battle Page Client-Side Functions

## Overview

This document describes all TypeScript/JavaScript functions in the Mona Mayhem battle page (`src/pages/index.astro`).

## Core Battle Functions

### `handleBattle()`

**Purpose:** Main orchestration function for the entire battle flow.

**Signature:**
```typescript
async function handleBattle(): Promise<void>
```

**Behavior:**
1. Validates both username inputs are filled
2. Shows loading state and disables battle button
3. Fetches both users' contribution data in parallel using `Promise.all()`
4. Validates API responses
5. Calculates statistics (totals, date ranges)
6. Renders battle results with winner determination
7. Handles errors gracefully
8. Restores UI state (hide loading, enable button)

**Called By:**
- Battle button click event
- Enter key in either input field

**Error Handling:**
- Catches validation errors (empty usernames)
- Catches API errors (user not found, network issues)
- Displays user-friendly error messages

**Example:**
```typescript
// Called automatically by event listeners
// Input validation → Fetch data → Render results
```

**Flow Diagram:**
```
Start
  ↓
Validate inputs → Error if empty
  ↓
Show loading + disable button
  ↓
Fetch both users (parallel)
  ↓
Validate responses
  ↓
Calculate stats
  ↓
Display results + determine winner
  ↓
Hide loading + enable button
  ↓
End
```

---

## Data Fetching Functions

### `fetchContributions(username: string)`

**Purpose:** Fetches a user's contribution data from the server API.

**Signature:**
```typescript
async function fetchContributions(username: string): Promise<ContributionData>
```

**Parameters:**
- `username` (string): GitHub username (case-insensitive)

**Returns:**
- `Promise<ContributionData>`: Resolves to contribution data object

**Throws:**
- `Error` if API returns error or username not found

**Error Messages:**
- "User 'xyz' not found on GitHub"
- "Failed to fetch data for xyz"
- "GitHub service temporarily unavailable"

**Caching:**
- Server-side cache: 5 minutes TTL
- No client-side caching

**Example:**
```typescript
try {
  const data = await fetchContributions('torvalds');
  console.log(data.total_contributions);  // 2986
} catch (error) {
  console.error(error.message);
}
```

**See Also:**
- [API Data Structure](./API_DATA_STRUCTURE.md)
- `handleBattle()` - Main caller

---

## Data Processing Functions

### `calculateTotalContributions(data: ContributionData)`

**Purpose:** Extracts total contribution count from API response.

**Signature:**
```typescript
function calculateTotalContributions(data: ContributionData): number
```

**Parameters:**
- `data` (ContributionData): Contribution data from API

**Returns:**
- `number`: Total contributions (0 if data invalid)

**Behavior:**
- Safely accesses `data.total_contributions`
- Returns 0 if data is null/undefined
- Logs errors to console if data invalid

**Example:**
```typescript
const total = calculateTotalContributions(data);
console.log(total.toLocaleString());  // "2,986"
```

**Performance:** O(1) - single property access

---

### `getDateRange(data: ContributionData)`

**Purpose:** Extracts date range from contribution data.

**Signature:**
```typescript
function getDateRange(data: ContributionData): { start: string; end: string }
```

**Parameters:**
- `data` (ContributionData): Contribution data from API

**Returns:**
- `{ start: string; end: string }`: Date range object
  - `start`: Start date (YYYY-MM-DD format) or 'N/A'
  - `end`: End date (YYYY-MM-DD format) or 'N/A'

**Example:**
```typescript
const range = getDateRange(data);
console.log(range);  // { start: '2025-04-13', end: '2026-04-15' }
```

**Edge Cases:**
- Returns `{ start: 'N/A', end: 'N/A' }` if data is null/undefined

---

### `renderContributionGrid(data: ContributionData, username: string)`

**Purpose:** Generates HTML for contribution graph visualization.

**Signature:**
```typescript
function renderContributionGrid(data: ContributionData, username: string): string
```

**Parameters:**
- `data` (ContributionData): Contribution data from API
- `username` (string): GitHub username (used for debugging)

**Returns:**
- `string`: HTML markup for contribution grid

**HTML Structure:**
```html
<div class="contribution-grid">
  <div class="contribution-week">
    <div class="contribution-day" style="background-color: #c6e48b;" title="Mon: 4 contributions"></div>
    <!-- ... 6 more days -->
  </div>
  <!-- ... more weeks -->
</div>
```

**Visualization Details:**
- Each week rendered as a horizontal row
- Each day rendered as a 12×12px colored square
- Color determined by contribution level (0-4)
- Tooltip on hover shows day name and contribution count

**Color Mapping:**
```
Level 0 → #ebedf0 (no contributions)
Level 1 → #c6e48b (low)
Level 2 → #40c463 (medium)
Level 3 → #30a14e (high)
Level 4 → #216e39 (very high)
```

**Edge Cases:**
- Returns placeholder message if weeks array is empty
- Returns placeholder if data is null/undefined

**Example:**
```typescript
const html = renderContributionGrid(data, 'torvalds');
resultsDiv.innerHTML = html;
```

**CSS Classes Used:**
- `.contribution-grid` - Container
- `.contribution-week` - Week row
- `.contribution-day` - Individual day square

**See Also:**
- [CSS Class Reference](./CSS_REFERENCE.md)
- `CONTRIBUTION_COLORS` object

---

## Display Functions

### `displayResults(player1: PlayerData, player2: PlayerData)`

**Purpose:** Renders the battle comparison results showing both players' data and winner.

**Signature:**
```typescript
function displayResults(player1: PlayerData, player2: PlayerData): void
```

**Parameters:**
- `player1` (PlayerData): First player's data
- `player2` (PlayerData): Second player's data

**Renders:**
- Player 1 card (left side)
- Player 2 card (right side)
- VS badge between players
- Contribution graphs for both
- Winner announcement
- Stats (total contributions, date range)

**Winner Determination:**
- Compares `player1.totalContributions` vs `player2.totalContributions`
- Winner gets gold gradient background and 🏆 badge
- Tie shows 🤝 emoji

**HTML Output:**
```html
<div class="results-container">
  <div class="player-result winner">
    <div class="player-name">torvalds 🏆 WINNER</div>
    <div class="player-stats">
      <div class="stat-row">
        <span class="stat-label">Total Contributions:</span>
        <span class="stat-value">2,986</span>
      </div>
      <!-- ... -->
    </div>
    <div class="contribution-graph-label">Last Year Activity</div>
    <!-- contribution grid HTML -->
  </div>
  <div class="vs-badge">VS</div>
  <!-- ... player 2 ... -->
</div>
<div class="battle-summary">🎉 torvalds wins with 1,200 more contributions!</div>
```

**CSS Classes Applied:**
- `.results-container`
- `.player-result`, `.player-result.winner`
- `.vs-badge`
- `.winner-badge`
- `.battle-summary`

**Called By:**
- `handleBattle()` - after data validation

**See Also:**
- [CSS Class Reference](./CSS_REFERENCE.md)

---

## UI State Functions

### `showError(message: string)`

**Purpose:** Displays error message to user.

**Signature:**
```typescript
function showError(message: string): void
```

**Behavior:**
- Sets error text content
- Adds `.show` class (makes visible)

**Example:**
```typescript
showError('Please enter both usernames');
```

---

### `hideError()`

**Purpose:** Hides error message.

**Signature:**
```typescript
function hideError(): void
```

**Behavior:**
- Clears error text
- Removes `.show` class (makes hidden)

---

### `showLoading(message?: string)`

**Purpose:** Shows loading indicator with optional custom message.

**Signature:**
```typescript
function showLoading(message: string = 'Fetching battle data'): void
```

**Parameters:**
- `message` (string, optional): Custom loading message (default: "Fetching battle data")

**Behavior:**
- Sets loading text
- Adds `.show` class
- Shows animated "..." dots

**Example:**
```typescript
showLoading('Comparing warriors...');
```

---

### `hideLoading()`

**Purpose:** Hides loading indicator.

**Signature:**
```typescript
function hideLoading(): void
```

**Behavior:**
- Clears loading text
- Removes `.show` class

---

### `hideResults()`

**Purpose:** Clears results display and resets state.

**Signature:**
```typescript
function hideResults(): void
```

**Behavior:**
- Clears HTML content
- Removes `.show` class

---

## Constants

### `CONTRIBUTION_COLORS`

**Purpose:** Maps contribution levels to hex colors.

**Type:**
```typescript
const CONTRIBUTION_COLORS: Record<number, string>
```

**Value:**
```typescript
{
  0: '#ebedf0',  // No contributions (light gray)
  1: '#c6e48b',  // Low activity (light green)
  2: '#40c463',  // Medium activity (green)
  3: '#30a14e',  // High activity (dark green)
  4: '#216e39'   // Very high activity (very dark green)
}
```

**Used By:**
- `renderContributionGrid()` - colorizes contribution squares

**Example:**
```typescript
const color = CONTRIBUTION_COLORS[level];  // Get color for a level
```

---

## TypeScript Interfaces

### `ContributionDay`

**Properties:**
```typescript
{
  weekday: number;    // 0-6 (Sunday-Saturday)
  count: number;      // Contributions that day
  level: number;      // Intensity (0-4)
}
```

### `ContributionWeek`

**Properties:**
```typescript
{
  index: number;                          // Week index
  first_day: string;                      // YYYY-MM-DD
  contribution_days: ContributionDay[];  // 7 days
}
```

### `ContributionData`

**Properties:**
```typescript
{
  schema: string;
  generated_at: string;
  from: string;
  to: string;
  range_days: number;
  total_contributions: number;
  private_contributions_included: boolean;
  colors_full: string[];
  weeks: ContributionWeek[];
  months: Array<{ month: string; total_weeks: number }>;
}
```

### `PlayerData`

**Properties:**
```typescript
{
  username: string;
  totalContributions: number;
  data: ContributionData;
  dateRange: { start: string; end: string };
}
```

---

## Call Graph

```
handleBattle()
  ├─ hideError()
  ├─ hideResults()
  ├─ showError() [if validation fails]
  ├─ showLoading()
  ├─ Promise.all()
  │   ├─ fetchContributions(username1)
  │   └─ fetchContributions(username2)
  ├─ getDateRange(data1)
  ├─ getDateRange(data2)
  ├─ calculateTotalContributions(data1)
  ├─ calculateTotalContributions(data2)
  ├─ displayResults()
  │   └─ renderContributionGrid() [2x]
  ├─ showError() [if error]
  └─ hideLoading()
```

---

## Performance Characteristics

| Function | Time Complexity | Notes |
|----------|-----------------|-------|
| `fetchContributions()` | O(1) network | Cached 5min server-side |
| `calculateTotalContributions()` | O(1) | Property access |
| `getDateRange()` | O(1) | Property access |
| `renderContributionGrid()` | O(n) | n = number of weeks (~52) |
| `displayResults()` | O(n) | Includes grid rendering |
| `handleBattle()` | O(n) + network | Parallel fetches |

---

## Debugging Tips

### Check Console Logs
```typescript
// Errors logged when data validation fails
console.error('Invalid contribution data structure:', data);
console.error('Battle error:', error);
```

### Test with Known Users
- `torvalds` - High contributor (2986+)
- `octocat` - GitHub's mascot (has data)
- `nonexistent` - Will 404

### API Response Validation
Open browser DevTools → Network tab → Check `/api/contributions/[username]` response

### Grid Rendering Issues
Inspect HTML → `.contribution-grid` should contain `.contribution-week` elements with `.contribution-day` divs

---

## Related Documentation

- [API Data Structure](./API_DATA_STRUCTURE.md)
- [User Flow](./USER_FLOW.md)
- [CSS Class Reference](./CSS_REFERENCE.md)
- [Source Code](../src/pages/index.astro) - Full implementation with JSDoc
