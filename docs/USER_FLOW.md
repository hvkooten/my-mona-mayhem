# User Flow Documentation - Mona Mayhem Battle

## Overview

This document describes the complete user journey and technical flow when a user initiates a "battle" on the Mona Mayhem battle page.

## User Actions

### How to Start a Battle

Users can start a battle in **two ways:**

#### 1. Click the Battle Button
```
1. User enters username in "Player 1" input
2. User enters username in "Player 2" input
3. User clicks "⚔️ BATTLE!" button
4. Battle flow begins
```

#### 2. Press Enter in Input Field
```
1. User enters username in either input field
2. User presses Enter key
3. Battle flow begins (same as button click)
```

Both methods trigger the same `handleBattle()` function.

---

## Complete Battle Flow

### Visual Flow Chart

```
┌─────────────────────────────────────┐
│ User enters two GitHub usernames    │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│ User clicks BATTLE or presses Enter │
└──────────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────┐
    │ Validate Input Validation │
    └──┬────────────────────────┘
       │
       ├─ Empty? ──── Show Error ──────┐
       │                                 │
       └─ Valid ────── Continue ────┐   │
                                    │   │
                                    ▼   │
                    ┌─ Show Loading State
                    │ Disable Button
                    │
                    ▼
    ┌──────────────────────────────────┐
    │ Fetch Both Users (Parallel)      │
    │ - GET /api/contributions/user1   │
    │ - GET /api/contributions/user2   │
    └──┬───────────────────────────────┘
       │
       ├─ Error? ──── Show Error Msg ──┐
       │                                │
       └─ Success ──── Continue ────┐   │
                                    │   │
                                    ▼   │
    ┌──────────────────────────────┐   │
    │ Validate API Responses       │   │
    │ Check data structure valid   │   │
    └──┬───────────────────────────┘   │
       │                               │
       ├─ Invalid? ── Show Error ──┐   │
       │                            │   │
       └─ Valid ──── Continue ──┐   │   │
                                │   │   │
                                ▼   │   │
    ┌─────────────────────────────────────┐
    │ Calculate Statistics                │
    │ - Total contributions              │
    │ - Date ranges                      │
    │ - Prepare PlayerData objects       │
    └──┬──────────────────────────────────┘
       │
       ▼
    ┌─────────────────────────────────────┐
    │ Display Results                     │
    │ - Render both player cards         │
    │ - Render contribution graphs       │
    │ - Determine & show winner          │
    │ - VS badge between players         │
    │ - Stats and date ranges            │
    └─┬───────────────────────────────────┘
      │
      ▼
    ┌─────────────────────────────────────┐
    │ Clean Up                            │
    │ - Hide loading indicator           │
    │ - Enable battle button             │
    │ - Ready for next battle            │
    └─────────────────────────────────────┘
```

---

## Detailed Step-by-Step Execution

### Step 1: Input Validation

**Code:** `handleBattle()` - Lines 1-5

```javascript
const username1 = player1Input.value.trim();
const username2 = player2Input.value.trim();

hideError();
hideResults();

if (!username1 || !username2) {
  showError('Please enter both usernames');
  return;  // Exit early
}
```

**Checks:**
- Both fields must have content (after trimming whitespace)
- If either is empty → Show error and stop

**Error Message:** "Please enter both usernames"

**State Changes:**
- Clear previous errors
- Clear previous results
- Display error message (red background)

---

### Step 2: Show Loading State

**Code:** `handleBattle()` - Lines 6-7

```javascript
battleBtn.disabled = true;
showLoading();
```

**State Changes:**
- Battle button becomes disabled (grayed out, can't click)
- Loading indicator appears with message: "Fetching battle data"
- Animated "..." dots cycle

**Duration:** Until battle completes or error occurs

---

### Step 3: Fetch Contribution Data (Parallel)

**Code:** `handleBattle()` - Lines 8-12

```javascript
const [data1, data2] = await Promise.all([
  fetchContributions(username1),
  fetchContributions(username2)
]);
```

**What Happens:**

1. **HTTP Request 1:** `GET /api/contributions/torvalds`
   ```
   Request headers: {Authorization: none needed}
   Response: { schema: "v2", weeks: [...], total_contributions: 2986 }
   ```

2. **HTTP Request 2:** `GET /api/contributions/octocat`
   ```
   Request headers: {Authorization: none needed}
   Response: { schema: "v2", weeks: [...], total_contributions: 3500 }
   ```

**Parallel Execution:**
- Both requests sent simultaneously
- JavaScript waits for **both** to complete before continuing
- If one fails, the whole `Promise.all()` throws

**Caching:**
- Server caches responses for 5 minutes
- Same username within 5 min = cached response (faster)

**Possible Errors:**
- User not found (404)
- Network timeout
- GitHub service unavailable (503)
- Invalid response format

---

### Step 4: Validate API Responses

**Code:** `handleBattle()` - Lines 13-18

```javascript
if (!data1 || typeof data1 !== 'object') {
  throw new Error(`Invalid data received for user ${username1}`);
}
if (!data2 || typeof data2 !== 'object') {
  throw new Error(`Invalid data received for user ${username2}`);
}
```

**Checks:**
- Response is not null/undefined
- Response is an object (not string/number/etc)

**If Invalid:** Throws error → Caught by catch block → Shows error message

---

### Step 5: Calculate Statistics

**Code:** `handleBattle()` - Lines 19-26

```javascript
const dateRange1 = getDateRange(data1);
const dateRange2 = getDateRange(data2);

const player1Data: PlayerData = {
  username: username1,
  totalContributions: calculateTotalContributions(data1),
  data: data1,
  dateRange: dateRange1
};

const player2Data: PlayerData = {
  username: username2,
  totalContributions: calculateTotalContributions(data2),
  data: data2,
  dateRange: dateRange2
};
```

**Calculations:**
- `getDateRange()` → Extracts `from` and `to` dates from API
- `calculateTotalContributions()` → Extracts `total_contributions` from API
- Wraps in `PlayerData` objects for type safety

**Example Result:**
```
player1Data = {
  username: "torvalds",
  totalContributions: 2986,
  data: { /* full API response */ },
  dateRange: { start: "2025-04-13", end: "2026-04-15" }
}
```

---

### Step 6: Display Results

**Code:** `handleBattle()` → `displayResults()`

**Rendering Process:**

#### 6a. Determine Winner
```javascript
const isPlayer1Winner = player1.totalContributions > player2.totalContributions;
const isPlayer2Winner = player2.totalContributions > player1.totalContributions;
const isTie = player1.totalContributions === player2.totalContributions;
```

#### 6b. Generate Contribution Graphs
```javascript
const player1Grid = renderContributionGrid(player1.data, player1.username);
const player2Grid = renderContributionGrid(player2.data, player2.username);
```

Each grid is an HTML string containing:
- 52-53 weeks as horizontal rows
- 7 days per week as colored squares
- Colors based on contribution level (0-4)
- Tooltips with day name and count on hover

#### 6c. Render Complete HTML

```html
<div class="results-container">
  
  <!-- Player 1 Card -->
  <div class="player-result winner">
    <div class="player-name">
      torvalds
      <span class="winner-badge">🏆 WINNER</span>
    </div>
    <div class="player-stats">
      <div class="stat-row">
        <span class="stat-label">Total Contributions:</span>
        <span class="stat-value">2,986</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Period:</span>
        <span class="stat-value">2025-04-13 to 2026-04-15</span>
      </div>
    </div>
    <div class="contribution-graph-label">Last Year Activity</div>
    <!-- Contribution grid HTML -->
  </div>

  <!-- VS Badge -->
  <div class="vs-badge">VS</div>

  <!-- Player 2 Card -->
  <div class="player-result">
    <div class="player-name">
      octocat
    </div>
    <div class="player-stats">
      <div class="stat-row">
        <span class="stat-label">Total Contributions:</span>
        <span class="stat-value">3,500</span>
      </div>
      <!-- ... -->
    </div>
    <!-- ... -->
  </div>

</div>

<!-- Battle Summary -->
<div class="battle-summary">
  🎉 octocat wins with 514 more contributions!
</div>
```

**Visual Differences:**
- Winner: Gold gradient background + 🏆 trophy
- Loser: Light gray background
- Tie: Both gray, 🤝 emoji

---

### Step 7: Clean Up & Reset

**Code:** `handleBattle()` - Finally block

```javascript
finally {
  hideLoading();
  battleBtn.disabled = false;
}
```

**State Changes:**
- Hide loading indicator
- Re-enable battle button
- User can click again for next battle

**Edge Cases:**
- If error occurs → Error message displays but cleanup still runs
- User can clear fields and try again immediately

---

## UI States Throughout Battle

| State | Loading | Button | Error | Results | Description |
|-------|---------|--------|-------|---------|-------------|
| Initial | Hidden | Enabled | Hidden | Hidden | Ready to battle |
| Validating | Hidden | Disabled | Hidden | Hidden | Checking inputs |
| Fetching | Visible | Disabled | Hidden | Hidden | Loading spinner |
| Error | Hidden | Enabled | Visible | Hidden | Show error message |
| Success | Hidden | Enabled | Hidden | Visible | Show results |

---

## Event Listeners

### Battle Button Click
```javascript
battleBtn.addEventListener('click', handleBattle);
```

### Enter Key in Inputs
```javascript
[player1Input, player2Input].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleBattle();
    }
  });
});
```

---

## Error Handling

### Error Types and Messages

| Error | Cause | User Message |
|-------|-------|--------------|
| Empty input | User didn't fill both fields | "Please enter both usernames" |
| User not found | Username doesn't exist on GitHub | "User 'xyz' not found on GitHub" |
| Network error | Connection failed | "Failed to fetch data for xyz" |
| Invalid response | API returned wrong format | "Invalid data received for user xyz" |
| GitHub rate limit | Too many requests | "GitHub service temporarily unavailable" |

### Error Recovery
1. Error message displays with ❌ styling
2. Button re-enabled
3. Loading indicator hidden
4. User can:
   - Correct username and try again
   - Try different usernames
   - Wait and try later (if rate-limited)

---

## Data Flow Diagram

```
┌─────────────────────┐
│ User Input          │
│ - username 1        │
│ - username 2        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ handleBattle()      │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │ (parallel)  │
    ▼             ▼
┌──────────┐  ┌──────────┐
│ fetch    │  │ fetch    │
│ user1    │  │ user2    │
└────┬─────┘  └────┬─────┘
     │             │
     └──────┬──────┘
            ▼
┌──────────────────────────┐
│ ContributionData x2      │
│ - total_contributions    │
│ - weeks[]                │
│ - dates                  │
└──────────┬───────────────┘
           │
    ┌──────┴──────┐
    │ Calculate   │
    ▼             ▼
┌────────────┐  ┌────────────┐
│PlayerData 1│  │PlayerData 2│
└────────┬───┘  └────┬───────┘
         │           │
         └─────┬─────┘
               ▼
        ┌─────────────────┐
        │displayResults() │
        │- Render HTML    │
        │- Show grids     │
        │- Show winner    │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │Results visible  │
        │to user          │
        └─────────────────┘
```

---

## Timeline Example

Using `torvalds` vs `octocat`:

```
T+0ms    ▶ User clicks BATTLE
T+50ms   ▶ Button disabled, loading appears
T+100ms  ▶ Network requests sent (parallel)
T+500ms  ▶ API responses received (~400ms network)
T+550ms  ▶ Data validated, stats calculated
T+600ms  ▶ Grids rendered (52+ weeks)
T+650ms  ▶ HTML inserted into DOM
T+700ms  ▶ Results fully visible
T+750ms  ▶ Button enabled, ready for next battle

Total time: ~700ms (most of this is network latency)
```

---

## Accessibility Features

- Keyboard support: Enter key works like button click
- Error messages: Red background + clear text
- Loading state: Visual indicator (animated dots)
- Button state: Disabled state obvious (grayed out)
- Color contrast: All text meets WCAG AA standards

---

## Performance Optimizations

1. **Parallel Fetching:** Both users fetched simultaneously (not sequential)
2. **Server Caching:** 5-minute TTL reduces repeated API calls
3. **Lazy Grid Rendering:** HTML generated only when needed
4. **Event Delegation:** Single handler for Enter key on both inputs
5. **Debouncing:** Not needed (sequential battles are fine)

---

## Related Documentation

- [Function Reference](./FUNCTION_REFERENCE.md) - Detailed function descriptions
- [API Data Structure](./API_DATA_STRUCTURE.md) - API response format
- [CSS Class Reference](./CSS_REFERENCE.md) - Styling information
- [Source Code](../src/pages/index.astro) - Full implementation
