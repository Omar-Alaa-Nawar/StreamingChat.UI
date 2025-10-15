# 🎨 Phase 3 Visual Reference - TableA States

**Component:** TableA  
**Purpose:** Visual design reference for all rendering states  
**Date:** October 15, 2025

---

## 📐 Component Anatomy

```
┌─────────────────────────────────────────────────────────┐
│ ┌────┐ Loading table... / Data Table               [×] │ ← Header with icon
│ └────┘                                                  │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Column1        Column2        Column3              │ │ ← Table headers
│ │ ───────────────────────────────────────────────────│ │
│ │ [skeleton] OR [data] OR [data]                     │ │ ← Row 1
│ │ [skeleton] OR [data] OR [data]                     │ │ ← Row 2
│ │ [skeleton] OR [data] OR [data]                     │ │ ← Row 3
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│ X rows                                     ✓ Complete  │ ← Footer
└─────────────────────────────────────────────────────────┘
```

---

## 🎭 State 1: Empty

### When It Appears

- `rows.length === 0`
- Table initialized but no data received yet
- Backend has streamed column headers only

### Visual Characteristics

**Container:**

- Border: `border-gray-300` (light gray, 2px)
- Background: `bg-gray-50` (very light gray)
- Shadow: None
- Border radius: `rounded-2xl` (16px)

**Header Section:**

- Icon background: `bg-gray-200` (light gray rectangle)
- Icon color: `text-gray-400` (gray table icon)
- Text: "Loading table..." in `text-gray-500`

**Table Headers:**

- Text color: `text-gray-400` (muted)
- Border: `border-gray-300` (2px bottom border)
- Background: Transparent

**Table Body:**

- **3 skeleton rows** (fixed count)
- Each cell contains shimmer bar
- Shimmer animation: Left-to-right sweep (1.5s loop)
- Skeleton bar: `h-4 w-24 rounded` (height 16px, width 96px)

**Footer:**

- Not visible (no row count)

### CSS Classes

```jsx
// Container
className = "border-gray-300 bg-gray-50";

// Icon
className = "bg-gray-200 text-gray-400";

// Header text
className = "text-gray-500";

// Table header cells
className = "text-gray-400 border-gray-300";

// Skeleton cells
className = "skeleton h-4 w-24 rounded";
```

### Example Screenshot Description

```
┌──────────────────────────────────────┐
│ [□] Loading table...                │  Gray tones
│                                      │
│ Name         Sales      Region       │  Muted headers
│ ────────────────────────────────────│
│ ░░░░░░░░     ░░░░░      ░░░░░       │  ← Shimmer
│ ░░░░░░░░     ░░░░░      ░░░░░       │  ← Shimmer
│ ░░░░░░░░     ░░░░░      ░░░░░       │  ← Shimmer
│                                      │
└──────────────────────────────────────┘
```

---

## 🎭 State 2: Partial

### When It Appears

- `rows.length > 0 && rows.length < 3`
- At least 1 row has data
- Still loading (hasn't reached completion threshold)

### Visual Characteristics

**Container:**

- Border: `border-indigo-400` (medium indigo, 2px)
- Background: `bg-white` (pure white)
- Shadow: None yet
- Border radius: `rounded-2xl` (16px)

**Header Section:**

- Icon background: `bg-indigo-100` (light indigo)
- Icon color: `text-indigo-600` (strong indigo)
- Text: "Data Table" in `text-indigo-700`

**Table Headers:**

- Text color: `text-indigo-700` (vibrant)
- Border: `border-indigo-300` (2px bottom border)
- Background: Transparent

**Table Body:**

- **Real data rows** visible
- Each row has `hover:bg-indigo-50` effect
- Row border: `border-gray-200` (light separator)
- Cell text: `text-gray-800` (dark gray)
- If any cell is `undefined`: Shows skeleton placeholder

**Footer:**

- Row count visible: "X row" or "X rows"
- Color: `text-gray-500`
- No "Complete" badge yet

### CSS Classes

```jsx
// Container
className = "border-indigo-400 bg-white";

// Icon
className = "bg-indigo-100 text-indigo-600";

// Header text
className = "text-indigo-700";

// Table header cells
className = "text-indigo-700 border-indigo-300";

// Data rows
className = "border-gray-200 hover:bg-indigo-50";

// Cell text
className = "text-gray-800";

// Footer
className = "text-gray-500";
```

### Example Screenshot Description

```
┌──────────────────────────────────────┐
│ [■] Data Table                      │  Indigo tones
│                                      │
│ Name         Sales      Region       │  Indigo headers
│ ────────────────────────────────────│
│ Alice        1,000      US           │  ← Real data
│ Bob          2,000      UK           │  ← Real data
│                                      │
│ 2 rows                               │  ← Row count
└──────────────────────────────────────┘
```

---

## 🎭 State 3: Complete

### When It Appears

- `rows.length >= 3`
- Completion threshold reached
- All expected data has arrived

### Visual Characteristics

**Container:**

- Border: `border-indigo-500` (strong indigo, 2px)
- Background: `bg-gradient-to-br from-indigo-50 to-blue-100` (gradient)
- Shadow: `shadow-md` (medium drop shadow)
- Border radius: `rounded-2xl` (16px)

**Header Section:**

- Icon background: `bg-gradient-to-br from-indigo-400 to-blue-500` (gradient)
- Icon color: `text-white` (white table icon)
- Text: "Data Table" in `text-indigo-700`

**Table Headers:**

- Text color: `text-indigo-800` (deep indigo)
- Border: `border-indigo-400` (2px bottom border)
- Font weight: Semibold

**Table Body:**

- **Real data rows** (3+ visible)
- Each row has `hover:bg-indigo-50` effect
- Row border: `border-gray-200` (light separator)
- Cell text: `text-gray-800` (dark gray)
- All cells populated (no skeletons)

**Footer:**

- **Left side:** Row count "X rows" in `text-gray-500`
- **Right side:** "Complete" badge with checkmark
  - Badge color: `text-indigo-600`
  - Font weight: Medium
  - Icon: Checkmark in circle (green checkmark)

### CSS Classes

```jsx
// Container
className =
  "border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-100 shadow-md";

// Icon
className = "bg-gradient-to-br from-indigo-400 to-blue-500 text-white";

// Header text
className = "text-indigo-700 font-semibold";

// Table header cells
className = "text-indigo-800 border-indigo-400";

// Data rows
className = "border-gray-200 hover:bg-indigo-50";

// Footer row count
className = "text-gray-500";

// Complete badge
className = "text-indigo-600 font-medium";
```

### Example Screenshot Description

```
┌──────────────────────────────────────┐  ← Gradient border
│ [◆] Data Table                      │  (indigo-500)
│                                      │
│ Name         Sales      Region       │  Deep indigo headers
│ ────────────────────────────────────│
│ Alice        1,000      US           │  ← Real data
│ Bob          2,000      UK           │  ← Real data
│ Carlos       1,500      DE           │  ← Real data
│                                      │
│ 3 rows                  ✓ Complete  │  ← Badge visible
└──────────────────────────────────────┘
    ↑
Gradient background (indigo-50 → blue-100)
Shadow effect visible
```

---

## 🎨 Color Palette Reference

### Gray (Empty State)

```css
border-gray-300:   #D1D5DB
bg-gray-50:        #F9FAFB
bg-gray-200:       #E5E7EB
text-gray-400:     #9CA3AF
text-gray-500:     #6B7280
```

### Indigo (Partial & Complete States)

```css
border-indigo-400:     #818CF8
border-indigo-500:     #6366F1
bg-indigo-50:          #EEF2FF
bg-indigo-100:         #E0E7FF
text-indigo-600:       #4F46E5
text-indigo-700:       #4338CA
text-indigo-800:       #3730A3
bg-gradient (start):   #EEF2FF (indigo-50)
bg-gradient (end):     #DBEAFE (blue-100)
```

### Gradients

**Icon (Complete State):**

```css
background: linear-gradient(to bottom right, #818cf8, #3b82f6);
/* from-indigo-400 to-blue-500 */
```

**Container (Complete State):**

```css
background: linear-gradient(to bottom right, #eef2ff, #dbeafe);
/* from-indigo-50 to-blue-100 */
```

---

## 🔄 State Transitions

### Timing

All state transitions use:

```css
transition-all duration-300
/* 300ms transition for all properties */
```

**Properties that transition:**

- `border-color`
- `background-color`
- `background-image` (gradients)
- `box-shadow`
- `color` (text)

### Transition Sequence

```
Empty State
    ↓ (rows.length becomes > 0)
  [300ms transition]
    ↓
Partial State
    ↓ (rows.length reaches >= 3)
  [300ms transition]
    ↓
Complete State
```

**Visual effect:** Smooth color fade, no jumps or flashes.

---

## 📱 Responsive Behavior

### Overflow

**Table wrapper:**

```jsx
<div className="overflow-x-auto">
  <table className="w-full">
```

**Effect:**

- On small screens, table becomes horizontally scrollable
- Horizontal scrollbar appears if table width > viewport
- No content gets cut off

### Mobile Considerations

- Minimum table width: `w-full` (expands to container)
- Touch-friendly row height: `py-3` (12px vertical padding)
- Readable font size: `text-sm` (14px)
- Adequate spacing between rows: `border-b border-gray-200`

---

## 🎬 Animation Reference

### Skeleton Shimmer

**Keyframe animation:**

```css
@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
```

**Visual effect:**

- Left-to-right shimmer sweep
- 1.5 second loop duration
- Smooth easing
- Infinite repeat
- Professional loading indicator

### Hover Effects

**Table rows:**

```jsx
className = "hover:bg-indigo-50 transition-colors duration-150";
```

**Effect:**

- Instant color change on hover (150ms)
- Background changes to light indigo
- Only on data rows (not skeletons)
- Clear visual feedback for interactivity

---

## 🔍 Component Variants

### Variant 1: No Data Forever (Edge Case)

**Appearance:** Stays in Empty State indefinitely

```
┌──────────────────────────────────────┐
│ [□] Loading table...                │
│ Name         Sales      Region       │
│ ░░░░░░░░     ░░░░░      ░░░░░       │
│ ░░░░░░░░     ░░░░░      ░░░░░       │
│ ░░░░░░░░     ░░░░░      ░░░░░       │
└──────────────────────────────────────┘

User sees: "Still loading..." (shimmer continues)
```

**No timeout - skeleton persists until data arrives.**

---

### Variant 2: Partial Cell Data

**Row 1 complete, Row 2 has undefined cells:**

```
┌──────────────────────────────────────┐
│ [■] Data Table                      │
│ Name         Sales      Region       │
│ ────────────────────────────────────│
│ Alice        1,000      US           │  ← Complete
│ Bob          ░░░░░      ░░░░░       │  ← Partial
│                                      │
│ 2 rows                               │
└──────────────────────────────────────┘
```

**Mix of data and skeleton within same table.**

---

### Variant 3: Large Table (50 rows)

**Appearance:** Same as Complete State + scrollbar

```
┌──────────────────────────────────────┐
│ [◆] Data Table                      │
│ Name         Sales      Region       │ ← Fixed header
│ ────────────────────────────────────│
│ Alice        1,000      US           │ ↕ Scroll
│ Bob          2,000      UK           │ ↕ area
│ Carlos       1,500      DE           │ ↕ (many
│ ...                                  │ ↕ rows)
│ Zara         5,000      CA           │ ↕
│                                      │
│ 50 rows                 ✓ Complete  │
└──────────────────────────────────────┘
```

**Horizontal scroll if needed, vertical overflow handled by browser.**

---

## 🧩 Footer Badge Design

### Complete Badge

**HTML Structure:**

```jsx
<span className="text-indigo-600 font-medium flex items-center gap-1">
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
  Complete
</span>
```

**Visual:**

```
┌─────────────┐
│ ✓ Complete │  ← Indigo text + checkmark icon
└─────────────┘
```

**Icon:** Circle with checkmark (Material Design style)

---

## 📏 Spacing & Layout

### Container Padding

```jsx
className = "p-4"; // 16px padding on all sides
```

### Table Cell Padding

```jsx
className = "py-3 px-3"; // Vertical: 12px, Horizontal: 12px
```

### Gap Between Icon & Text

```jsx
className = "gap-2"; // 8px gap
```

### Gap Between Badge Icon & Text

```jsx
className = "gap-1"; // 4px gap
```

### Border Radius

```jsx
className = "rounded-2xl"; // 16px border radius
className = "rounded-lg"; // 8px (for icon container)
className = "rounded-md"; // 6px (for data cells if needed)
className = "rounded"; // 4px (for skeleton bars)
```

---

## 🎯 Design Principles

### Consistency

- All states use same layout structure
- Only colors and content change
- Predictable visual hierarchy

### Feedback

- Empty: "I'm loading" (shimmer + gray)
- Partial: "I'm working on it" (indigo + real data)
- Complete: "I'm done!" (gradient + badge)

### Professional Polish

- Smooth transitions (300ms)
- Gradient accents (indigo → blue)
- Drop shadows on completion
- Hover effects for interactivity

### Accessibility

- Semantic HTML (`<table>`, `<thead>`, `<tbody>`)
- Clear text contrast (WCAG AA compliant)
- Meaningful alt text for icons
- Keyboard navigation support (browser default)

---

## ✅ Visual QA Checklist

### Empty State

- [ ] Gray border visible (2px solid)
- [ ] Gray background fill
- [ ] Table icon is gray
- [ ] "Loading table..." text visible
- [ ] Skeleton rows shimmer continuously
- [ ] 3 skeleton rows (not 2, not 4)
- [ ] No footer visible

### Partial State

- [ ] Indigo border visible (2px solid)
- [ ] White background
- [ ] Table icon is indigo with light blue bg
- [ ] "Data Table" text visible
- [ ] Real data rows visible
- [ ] Row count in footer
- [ ] Hover effect works on rows
- [ ] No "Complete" badge yet

### Complete State

- [ ] Strong indigo border visible (2px solid)
- [ ] Gradient background (indigo-50 to blue-100)
- [ ] Drop shadow visible
- [ ] Table icon has gradient (indigo-400 to blue-500)
- [ ] Icon text is white
- [ ] "Data Table" text visible
- [ ] All rows have real data
- [ ] Row count in footer (left)
- [ ] "Complete" badge in footer (right)
- [ ] Checkmark icon visible in badge
- [ ] Hover effect works on rows

---

**Visual Reference Complete!** ✅

Use this guide to verify TableA appearance in all states. For code details, see `PHASE3_IMPLEMENTATION.md`.
