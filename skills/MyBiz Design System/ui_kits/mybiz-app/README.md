# MyBiz App — UI kit

Click-through recreation of the MyBiz workspace product, composed entirely from the design-system primitives.

**Flow:** `AuthScreen` → `HomeScreen` (banner, action cards, recents) → `GridScreen` (branded base shell, view tabs, filter toolbar, record table).

| File | Surface |
| --- | --- |
| `AuthScreen.jsx` | Sign-in / sign-up, 408px column, 44px controls |
| `TopBar.jsx` | Global bar: menu, logo, ⌘K search, help, notifications, avatar |
| `Sidebar.jsx` | Global nav: Home / Starred / Shared / Workspaces + footer utilities + Create |
| `HomeScreen.jsx` | Trial banner, four start-path cards, recently-opened grid |
| `GridScreen.jsx` | White base shell, view tabs, filter chips, `DataTable` |

Interactions that work: sign in, toggle sidebar, navigate Home ↔ base, switch view tabs, select rows (row number → checkbox), select-all, dismiss banner, add record → toast.

Data is fictional. The grid shows 8 of 412 records as an abbreviated stand-in.
