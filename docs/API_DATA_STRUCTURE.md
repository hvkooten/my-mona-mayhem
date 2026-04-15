# GitHub Contribution API Data Structure (v2)

## Overview

The Mona Mayhem battle page uses GitHub's contribution graph API to fetch user contribution data. The API returns a well-structured JSON response containing weekly contribution data with contribution levels (0-4).

**Endpoint:** `https://github.com/{username}.contribs`

**Example Response URL:** `https://github.com/torvalds.contribs`

## Complete Response Structure

```typescript
{
  schema: "v2",                              // API version
  generated_at: "2026-04-15T17:56:53Z",     // ISO timestamp when data was generated
  from: "2025-04-13",                        // Start date (YYYY-MM-DD)
  to: "2026-04-15",                          // End date (YYYY-MM-DD)
  range_days: 368,                           // Total days in the contribution range
  total_contributions: 2986,                 // Sum of all contributions in the range
  private_contributions_included: false,     // Whether private repository contributions are counted
  colors_full: [                             // Official GitHub color palette
    "#ebedf0",                               // Level 0: No contributions
    "#9be9a8",                               // Level 1: Low activity (alternative palette)
    "#40c463",                               // Level 2: Medium activity
    "#30a14e",                               // Level 3: High activity
    "#216e39"                                // Level 4: Very high activity
  ],
  weeks: [                                   // Array of contribution weeks
    {
      index: 0,                              // Week index in the response
      first_day: "2025-04-13",              // First day of the week (YYYY-MM-DD)
      contribution_days: [                   // Array of 7 days
        {
          weekday: 0,                        // Day of week (0=Sun, 1=Mon, ..., 6=Sat)
          count: 4,                          // Contributions on this day
          level: 1                           // Intensity level (0-4)
        },
        // ... 6 more days
      ]
    },
    // ... more weeks
  ],
  months: [                                  // Month metadata
    {
      month: "2025-04",                      // Month (YYYY-MM format)
      total_weeks: 3                         // Number of weeks in this month
    },
    // ... more months
  ]
}
```

## Data Fields Explained

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `schema` | string | API version (always "v2") |
| `generated_at` | string | ISO 8601 timestamp when data was generated |
| `from` | string | Start date of contribution range (YYYY-MM-DD format) |
| `to` | string | End date of contribution range (YYYY-MM-DD format) |
| `range_days` | number | Total number of days in the range |
| `total_contributions` | number | **Sum of all contributions** in the date range |
| `private_contributions_included` | boolean | Whether private repo contributions are counted |
| `colors_full` | string[] | Array of 5 hex colors for visualization (levels 0-4) |
| `weeks` | Array | Array of `ContributionWeek` objects |
| `months` | Array | Array of month metadata objects |

### Contribution Levels (0-4)

The `level` field in each day indicates contribution intensity:

```
Level 0: #ebedf0 (light gray)  - No contributions
Level 1: #c6e48b (light green) - 1-4 contributions
Level 2: #40c463 (green)       - 5-9 contributions  
Level 3: #30a14e (dark green)  - 10-24 contributions
Level 4: #216e39 (very dark)   - 25+ contributions
```

**Note:** These are approximate boundaries. GitHub may use different thresholds. The `level` field is the authoritative value.

### Week Structure

Each week object contains 7 days (Sunday through Saturday):

```typescript
{
  index: number,                 // 0-52 (week of the year)
  first_day: "YYYY-MM-DD",       // First day (always a Sunday)
  contribution_days: [
    {
      weekday: 0-6,              // 0=Sun, 1=Mon, 2=Tue, ..., 6=Sat
      count: number,             // Total contributions that day
      level: 0-4                 // Intensity level based on count
    }
    // ... 6 more days (7 total)
  ]
}
```

### Date Range Examples

**User with 1 year of data:**
- `from`: "2025-04-13"
- `to`: "2026-04-15"
- `range_days`: 368 (about 1 year)

**User with 0 contributions:**
- `total_contributions`: 0
- All `level` values would be 0
- All `count` values would be 0

## Accessing Contribution Data in Code

### Total Contributions
```typescript
const total = data.total_contributions;  // 2986
```

### Date Range
```typescript
const startDate = data.from;  // "2025-04-13"
const endDate = data.to;      // "2026-04-15"
```

### Iterate Through Weeks
```typescript
data.weeks.forEach(week => {
  console.log(`Week starting ${week.first_day}:`);
  week.contribution_days.forEach(day => {
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.weekday];
    console.log(`  ${dayName}: ${day.count} contributions (level ${day.level})`);
  });
});
```

### Get Color for a Day
```typescript
const CONTRIBUTION_COLORS = {
  0: '#ebedf0',  // No contributions
  1: '#c6e48b',  // Low
  2: '#40c463',  // Medium
  3: '#30a14e',  // High
  4: '#216e39'   // Very high
};

const day = weeks[0].contribution_days[0];
const color = CONTRIBUTION_COLORS[day.level];  // "#c6e48b"
```

## Edge Cases

### User with No Public Contributions
```json
{
  "total_contributions": 0,
  "weeks": [],
  "months": []
}
```

### User Not Found (API Error)
The API returns a 404 error, which is handled by the server-side proxy:
```json
{
  "error": "User 'nonexistent' not found on GitHub",
  "details": "The username does not exist or has no public contributions"
}
```

### Private Contributions
- GitHub shows private contributions in contribution graphs on the profile page
- The API **may** or **may not** include private contributions
- Check the `private_contributions_included` field to determine this

## Performance Notes

- The response includes a full year (52-53 weeks) of data
- Total payload size: ~50-100 KB for active users
- Data is cached server-side for 5 minutes

## Color Palette

The official GitHub contribution colors are:

| Level | Color | Hex | RGB |
|-------|-------|-----|-----|
| 0 | Light gray | #ebedf0 | (235, 237, 240) |
| 1 | Light green | #c6e48b | (198, 228, 139) |
| 2 | Green | #40c463 | (64, 196, 99) |
| 3 | Dark green | #30a14e | (48, 161, 78) |
| 4 | Very dark | #216e39 | (33, 110, 57) |

These match GitHub's official contribution graph colors exactly.

## Related Documentation

- [Function Reference](./FUNCTION_REFERENCE.md) - How to use data fetching functions
- [User Flow](./USER_FLOW.md) - Battle process overview
- [TypeScript Interfaces](./src/pages/index.astro) - Interface definitions with JSDoc
