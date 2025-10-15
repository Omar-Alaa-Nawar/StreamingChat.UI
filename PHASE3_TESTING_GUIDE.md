# 🧪 Phase 3 Testing & QA Guide

**Testing Scope:** TableA Progressive Rendering  
**Date:** October 15, 2025  
**Status:** Ready for Testing

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Manual Test Scenarios](#manual-test-scenarios)
3. [Backend Mock Messages](#backend-mock-messages)
4. [Visual State Assertions](#visual-state-assertions)
5. [Integration Test Examples](#integration-test-examples)
6. [Edge Cases & Error Handling](#edge-cases--error-handling)
7. [Performance Testing](#performance-testing)
8. [Backwards Compatibility Tests](#backwards-compatibility-tests)

---

## 🚀 Quick Start

### Prerequisites

1. Frontend running: `npm start`
2. Backend Phase 3 endpoint available at `http://127.0.0.1:8001/chat`
3. Browser DevTools open (Console + Network tabs)

### Basic Test

```bash
# User input:
"show me a sales table"

# Expected:
# 1. Empty table appears with 3 skeleton rows
# 2. Rows progressively fill in
# 3. Gradient border activates at 3+ rows
# 4. "Complete" badge appears
```

---

## 🧪 Manual Test Scenarios

### Test 1: Single Progressive Table

**Objective:** Verify empty → partial → complete states

**User Input:**

```
show me a sales table
```

**Expected Backend Stream:**

```
Here's the sales data:
$$${"type":"TableA","id":"sales-1","data":{"columns":["Product","Revenue","Quarter"],"rows":[]}}$$$
$$${"type":"TableA","id":"sales-1","data":{"columns":["Product","Revenue","Quarter"],"rows":[["Widget A",25000,"Q1"]]}}$$$
$$${"type":"TableA","id":"sales-1","data":{"columns":["Product","Revenue","Quarter"],"rows":[["Widget A",25000,"Q1"],["Widget B",32000,"Q2"]]}}$$$
$$${"type":"TableA","id":"sales-1","data":{"columns":["Product","Revenue","Quarter"],"rows":[["Widget A",25000,"Q1"],["Widget B",32000,"Q2"],["Widget C",41000,"Q3"]]}}$$$
```

**Visual Checklist:**

- [ ] Text "Here's the sales data:" appears first
- [ ] Empty table shell appears with headers: Product | Revenue | Quarter
- [ ] 3 skeleton rows visible (gray shimmer bars)
- [ ] Container has gray border (`border-gray-300`)
- [ ] Icon is gray
- [ ] "Loading table..." text visible
- [ ] First row appears: "Widget A | 25000 | Q1"
- [ ] Border changes to indigo (`border-indigo-400`)
- [ ] "Data Table" header text visible
- [ ] Second row appears: "Widget B | 32000 | Q2"
- [ ] Third row appears: "Widget C | 41000 | Q3"
- [ ] Border changes to strong indigo (`border-indigo-500`)
- [ ] Background becomes gradient (indigo-50 to blue-100)
- [ ] Shadow appears around table
- [ ] "Complete" badge with checkmark appears
- [ ] Footer shows "3 rows"

**Console Logs (Expected):**

```
[PARSE] Found complete component at index: X
[PARSE] Parsed component: TableA sales-1
[NEW] Adding new component: sales-1
[UPDATE] Updating component in buffer: sales-1
[MERGE] Merging with existing component: sales-1
```

---

### Test 2: Multiple Independent Tables

**Objective:** Verify independent ID-based updates

**User Input:**

```
compare US and UK sales
```

**Expected Backend Stream:**

```
Here are the regional comparisons:

US Sales:
$$${"type":"TableA","id":"us-table","data":{"columns":["Product","Sales"],"rows":[["A",100],["B",200],["C",300]]}}$$$

UK Sales:
$$${"type":"TableA","id":"uk-table","data":{"columns":["Product","Sales"],"rows":[["A",80],["B",150],["C",220]]}}$$$
```

**Visual Checklist:**

- [ ] Text "Here are the regional comparisons:" appears
- [ ] Text "US Sales:" appears
- [ ] First table appears with 3 rows
- [ ] First table shows complete state (gradient border)
- [ ] Text "UK Sales:" appears between tables
- [ ] Second table appears with 3 rows
- [ ] Second table shows complete state (gradient border)
- [ ] Both tables render independently (no mixing of data)
- [ ] Both tables have unique IDs (us-table, uk-table)

---

### Test 3: Mixed Components (SimpleComponent + TableA)

**Objective:** Verify coexistence of different component types

**User Input:**

```
show me a dashboard with summary card and data table
```

**Expected Backend Stream:**

```
Here's your dashboard:

$$${"type":"SimpleComponent","id":"summary-card","data":{"title":"Total Sales","value":50000,"description":"Last 30 days","timestamp":"2024-10-14T10:30:00Z"}}$$$

$$${"type":"TableA","id":"sales-table","data":{"columns":["Rep","Sales","Target"],"rows":[["Alice",15000,12000],["Bob",20000,18000],["Carlos",15000,15000]]}}$$$
```

**Visual Checklist:**

- [ ] Text "Here's your dashboard:" appears
- [ ] SimpleComponent card appears (Phase 2 style)
- [ ] Card shows: "Total Sales" | 50000 | "Last 30 days"
- [ ] TableA table appears below card
- [ ] Table shows 3 rows with complete state
- [ ] No styling interference between components
- [ ] Both components maintain independent IDs

---

### Test 4: Empty Table (Edge Case)

**Objective:** Verify skeleton state remains when no rows arrive

**User Input:**

```
show me an empty table
```

**Expected Backend Stream:**

```
Here's a table with no data yet:
$$${"type":"TableA","id":"empty-table","data":{"columns":["Name","Value","Status"],"rows":[]}}$$$
No data has been loaded.
```

**Visual Checklist:**

- [ ] Text "Here's a table with no data yet:" appears
- [ ] Empty table with headers appears
- [ ] 3 skeleton rows visible (shimmer animation)
- [ ] Gray border and background (`border-gray-300 bg-gray-50`)
- [ ] "Loading table..." header text
- [ ] Skeleton rows continue shimmering (no timeout)
- [ ] Text "No data has been loaded." appears below
- [ ] No "Complete" badge or row count

---

### Test 5: Partial Cell Data (Advanced)

**Objective:** Verify cell-level skeleton fallbacks

**User Input:**

```
show me incomplete data
```

**Expected Backend Stream:**

```
$$${"type":"TableA","id":"partial-table","data":{"columns":["Name","Age","City"],"rows":[["Alice",25,"NYC"],["Bob",null,"LA"],["Charlie",30,null]]}}$$$
```

**Visual Checklist:**

- [ ] Table appears with 3 rows
- [ ] Row 1: "Alice | 25 | NYC" (all cells filled)
- [ ] Row 2: "Bob | [skeleton] | LA" (Age cell has skeleton)
- [ ] Row 3: "Charlie | 30 | [skeleton]" (City cell has skeleton)
- [ ] Partial state styling (indigo border, white background)
- [ ] Row count shows "3 rows"
- [ ] No "Complete" badge (threshold not met or partial cells exist)

---

### Test 6: Large Table (Performance)

**Objective:** Verify performance with many rows

**User Input:**

```
show me a large sales report
```

**Expected Backend Stream:**

```
$$${"type":"TableA","id":"large-table","data":{"columns":["ID","Name","Sales"],"rows":[
  [1,"Alice",1000],
  [2,"Bob",2000],
  [3,"Carlos",3000],
  ... (up to 50 rows)
]}}$$$
```

**Performance Checklist:**

- [ ] Table renders without lag
- [ ] Scrolling is smooth (overflow-x-auto)
- [ ] No frame drops during rendering
- [ ] Complete state activates (3+ rows threshold met)
- [ ] Row count shows "50 rows"
- [ ] Hover effects work on all rows

**Timing:**

- Initial render: <100ms
- Scroll response: <16ms (60fps)
- Hover effect: immediate

---

## 📡 Backend Mock Messages

### Mock 1: Empty → 1 Row → 3 Rows

```json
[
  "$$$",
  {
    "type": "TableA",
    "id": "test-1",
    "data": {
      "columns": ["Name", "Score"],
      "rows": []
    }
  },
  "$$$"
]

// Wait 500ms

[
  "$$$",
  {
    "type": "TableA",
    "id": "test-1",
    "data": {
      "rows": [["Alice", 95]]
    }
  },
  "$$$"
]

// Wait 500ms

[
  "$$$",
  {
    "type": "TableA",
    "id": "test-1",
    "data": {
      "rows": [
        ["Alice", 95],
        ["Bob", 88],
        ["Carlos", 92]
      ]
    }
  },
  "$$$"
]
```

### Mock 2: Multi-Table

```json
[
  "Comparison:\n\n",
  "Table 1:\n",
  "$$$",
  {
    "type": "TableA",
    "id": "t1",
    "data": {
      "columns": ["X", "Y"],
      "rows": [
        [1, 2],
        [3, 4]
      ]
    }
  },
  "$$$",
  "\n\nTable 2:\n",
  "$$$",
  {
    "type": "TableA",
    "id": "t2",
    "data": {
      "columns": ["A", "B"],
      "rows": [
        [5, 6],
        [7, 8]
      ]
    }
  },
  "$$$"
]
```

---

## ✅ Visual State Assertions

### Empty State Assertions

```javascript
// Locate table container
const table = document.querySelector('[data-component-id="test-1"]');

// Assertions
expect(table).toHaveClass("border-gray-300");
expect(table).toHaveClass("bg-gray-50");
expect(table.querySelector("h3")).toHaveTextContent("Loading table...");

// Skeleton rows
const skeletonRows = table.querySelectorAll(".skeleton");
expect(skeletonRows.length).toBeGreaterThan(0);

// No footer badge
expect(table.querySelector('svg[data-badge="complete"]')).toBeNull();
```

### Partial State Assertions

```javascript
const table = document.querySelector('[data-component-id="test-1"]');

// Assertions
expect(table).toHaveClass("border-indigo-400");
expect(table).toHaveClass("bg-white");
expect(table.querySelector("h3")).toHaveTextContent("Data Table");

// Data rows
const dataRows = table.querySelectorAll("tbody tr");
expect(dataRows.length).toBeGreaterThan(0);

// Row count
expect(table).toHaveTextContent(/\d+ rows?/);
```

### Complete State Assertions

```javascript
const table = document.querySelector('[data-component-id="test-1"]');

// Assertions
expect(table).toHaveClass("border-indigo-500");
expect(table).toHaveClass("bg-gradient-to-br");
expect(table).toHaveClass("shadow-md");

// Complete badge
const badge = table.querySelector('[data-badge="complete"]');
expect(badge).toBeInTheDocument();
expect(badge).toHaveTextContent("Complete");

// Row count
const rows = table.querySelectorAll("tbody tr");
expect(rows.length).toBeGreaterThanOrEqual(3);
```

---

## 🔬 Integration Test Examples

### Jest + React Testing Library

```javascript
import { render, screen, waitFor } from "@testing-library/react";
import TableA from "../components/TableA";

describe("TableA Progressive Rendering", () => {
  test("renders empty state with skeleton rows", () => {
    const data = { columns: ["Name", "Value"], rows: [] };
    render(<TableA data={data} />);

    expect(screen.getByText("Loading table...")).toBeInTheDocument();
    expect(document.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
  });

  test("renders partial state with 1 row", () => {
    const data = {
      columns: ["Name", "Value"],
      rows: [["Alice", 100]],
    };
    render(<TableA data={data} />);

    expect(screen.getByText("Data Table")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("1 row")).toBeInTheDocument();
  });

  test("renders complete state with 3+ rows", () => {
    const data = {
      columns: ["Name", "Value"],
      rows: [
        ["Alice", 100],
        ["Bob", 200],
        ["Carlos", 300],
      ],
    };
    render(<TableA data={data} />);

    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByText("3 rows")).toBeInTheDocument();
  });

  test("handles undefined cell values with skeleton", () => {
    const data = {
      columns: ["Name", "Value"],
      rows: [["Alice", undefined]],
    };
    render(<TableA data={data} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(document.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
  });
});
```

### Cypress E2E Test

```javascript
describe("TableA Progressive Streaming", () => {
  it("should progressively load table rows", () => {
    cy.visit("http://localhost:3000");

    // Send user message
    cy.get('input[type="text"]').type("show me sales table{enter}");

    // Wait for empty table
    cy.contains("Loading table...").should("be.visible");
    cy.get(".skeleton").should("have.length.greaterThan", 0);

    // Wait for first row
    cy.contains("Alice", { timeout: 2000 }).should("be.visible");
    cy.contains("Data Table").should("be.visible");

    // Wait for complete state
    cy.contains("Complete", { timeout: 3000 }).should("be.visible");
    cy.contains("3 rows").should("be.visible");

    // Verify gradient border
    cy.get('[data-component-type="TableA"]')
      .should("have.class", "border-indigo-500")
      .and("have.class", "bg-gradient-to-br");
  });
});
```

---

## 🐛 Edge Cases & Error Handling

### Edge Case 1: No Columns

**Input:**

```json
{ "type": "TableA", "id": "test", "data": { "rows": [] } }
```

**Expected:**

- [ ] Table renders without headers
- [ ] No skeleton rows (columns.length === 0)
- [ ] No crash or error

---

### Edge Case 2: Mismatched Row Length

**Input:**

```json
{
  "type": "TableA",
  "id": "test",
  "data": {
    "columns": ["A", "B", "C"],
    "rows": [
      ["Alice", 100], // Missing 3rd value
      ["Bob", 200, 300]
    ]
  }
}
```

**Expected:**

- [ ] First row renders: "Alice | 100 | [skeleton]"
- [ ] Second row renders: "Bob | 200 | 300"
- [ ] No JavaScript errors
- [ ] Graceful degradation

---

### Edge Case 3: Invalid Data Types

**Input:**

```json
{
  "type": "TableA",
  "id": "test",
  "data": {
    "columns": ["Name", "Score"],
    "rows": [[{ "name": "Alice" }, { "score": 100 }]]
  }
}
```

**Expected:**

- [ ] Cells render as `[object Object]` (React default)
- [ ] No crash
- [ ] Consider adding type validation in future

---

### Edge Case 4: Rapid Updates (10 updates/sec)

**Scenario:** Backend sends 10 row updates per second

**Expected:**

- [ ] UI remains responsive
- [ ] No visual glitches or flickering
- [ ] Latest data always displayed
- [ ] Performance remains smooth (<16ms per frame)

**Test:**

```javascript
// Simulate rapid updates
for (let i = 0; i < 100; i++) {
  setTimeout(() => {
    updateTableData({ rows: generateRows(i) });
  }, i * 100); // 10 updates/sec
}
```

---

## 📊 Performance Testing

### Metrics to Track

| Metric                    | Target     | Measurement Method                |
| ------------------------- | ---------- | --------------------------------- |
| Initial render time       | <100ms     | `performance.mark()` in component |
| Row append time (per row) | <5ms       | Time between state updates        |
| State transition time     | 300ms      | CSS transition duration           |
| Memory usage (50 rows)    | <5MB delta | Chrome DevTools Memory Profiler   |
| Scroll FPS (large table)  | 60fps      | Chrome DevTools Performance tab   |

### Performance Test Script

```javascript
// Run in browser console
const startTime = performance.now();

// Trigger table render with 50 rows
const data = {
  columns: ["ID", "Name", "Value"],
  rows: Array.from({ length: 50 }, (_, i) => [i, `User ${i}`, i * 100]),
};

// Measure render time
performance.measure("table-render", startTime);
console.log(
  `Render time: ${performance.getEntriesByName("table-render")[0].duration}ms`
);

// Measure memory
const memBefore = performance.memory.usedJSHeapSize;
// ... render table ...
const memAfter = performance.memory.usedJSHeapSize;
console.log(`Memory delta: ${(memAfter - memBefore) / 1024 / 1024}MB`);
```

---

## 🔄 Backwards Compatibility Tests

### Test BC-1: Phase 0 (Text Only)

**Input:**

```
Hello, how are you?
```

**Expected:**

- [ ] Plain text response
- [ ] No components rendered
- [ ] Normal streaming behavior
- [ ] No errors in console

---

### Test BC-2: Phase 1 (SimpleComponent)

**Input:**

```
show me a card
```

**Backend:**

```
$$${"type":"SimpleComponent","id":"card-1","data":{"title":"Report","value":100}}$$$
```

**Expected:**

- [ ] SimpleComponent renders (Phase 1 style)
- [ ] No changes to existing behavior
- [ ] Gradient styling preserved

---

### Test BC-3: Phase 2 (Progressive SimpleComponent)

**Input:**

```
show me a progressive card
```

**Backend:**

```
$$${"type":"SimpleComponent","id":"prog-1","data":{}}$$$
$$${"type":"SimpleComponent","id":"prog-1","data":{"title":"Sales"}}$$$
$$${"type":"SimpleComponent","id":"prog-1","data":{"value":500}}$$$
```

**Expected:**

- [ ] Empty → Partial → Complete states work
- [ ] Skeleton loaders in SimpleComponent
- [ ] ID-based merging functions correctly
- [ ] No interference with TableA

---

## 📝 Test Report Template

### Test Session Report

**Date:** ******\_\_\_******  
**Tester:** ******\_\_\_******  
**Environment:** ******\_\_\_******

**Tests Passed:** **\_** / **\_**  
**Tests Failed:** **\_** / **\_**

**Failed Tests:**

| Test ID | Description | Expected | Actual | Severity | Notes |
| ------- | ----------- | -------- | ------ | -------- | ----- |
|         |             |          |        |          |       |

**Performance Metrics:**

| Metric               | Target | Actual | Pass/Fail |
| -------------------- | ------ | ------ | --------- |
| Initial render       | <100ms |        |           |
| State transition     | 300ms  |        |           |
| Scroll FPS (50 rows) | 60fps  |        |           |

**Browser Compatibility:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Issues Found:**

1. ***
2. ***

**Recommendations:**

1. ***
2. ***

---

## 🎯 Acceptance Criteria

### Must Pass

- ✅ All 6 manual test scenarios pass
- ✅ No console errors during any test
- ✅ All backwards compatibility tests pass
- ✅ Performance targets met (<100ms render, 60fps scroll)
- ✅ Visual states match design specifications
- ✅ Progressive rendering works smoothly

### Should Pass

- ✅ Edge cases handled gracefully
- ✅ Large tables (50 rows) perform well
- ✅ Multi-table scenarios work correctly
- ✅ Cell-level partial data handled properly

### Nice to Have

- ✅ Rapid updates (10/sec) don't cause glitches
- ✅ Memory usage remains stable
- ✅ Accessibility features work (keyboard navigation, ARIA)

---

**Testing Status:** Ready to Begin ✅  
**Next Steps:** Run manual tests, then automated suite  
**Questions?** Refer to `PHASE3_IMPLEMENTATION.md`
