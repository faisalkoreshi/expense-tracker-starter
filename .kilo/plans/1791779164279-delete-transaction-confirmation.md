# Delete Transaction With Confirmation

## Goal

Let the user delete a single transaction, guarded by an explicit confirmation step so no transaction is removed by a stray click.

## Boundaries Affected

| File | Change |
|---|---|
| `src/App.jsx` | Add `handleDeleteTransaction`; pass `onDelete` to `TransactionList` |
| `src/TransactionList.jsx` | Add a Delete button per row; own `pendingDelete` state; render `ConfirmDialog` |
| `src/ConfirmDialog.jsx` | **New** reusable confirmation modal |
| `src/App.css` | Add modal overlay/dialog/button styles |
| `src/TransactionForm.jsx` | **No change** |

## Important Corrections To The Request

1. The request references `@TransactionForm`, but `src/TransactionForm.jsx:3` only owns the add-form fields (`description`, `amount`, `type`, `category`) and calls `onSubmit`. It renders no transaction rows and holds no per-transaction data, so there is nothing to delete from it. Rows are rendered by `src/TransactionList.jsx:39-48` — that is where the delete trigger and confirmation belong.
2. `src/App.css:141-147` already defines an unused `.delete-btn` class; reuse it for the row action instead of adding a new class.

## Decisions

- **Source of truth stays in `App.jsx`.** `TransactionList` holds only transient UI state (`pendingDeleteId`), mirroring how `handleAddTransaction` already flows from `App` into `TransactionForm`.
- **Custom React modal** over `window.confirm()`: the project has no dependencies beyond React and styles everything with plain CSS, so a native dialog would be the only unstyled element in the UI. It is also non-blocking and reusable.
- Modal shows the **description and amount** of the doomed transaction so the user sees exactly what they are removing.
- Three ways to abort: **Cancel button**, **backdrop click**, and **Escape key**. None of these delete anything.

## Data Flow

```
TransactionList row click "Delete"
  -> setPendingDeleteId(t.id)            (local UI state only)
  -> renders ConfirmDialog
      -> Cancel / Escape / backdrop -> setPendingDeleteId(null)
      -> Confirm -> onDelete(t.id)
                       -> App.handleDeleteTransaction
                          setTransactions(prev => prev.filter(t => t.id !== id))
                          -> Summary recomputes automatically (derives from transactions)
```

## Implementation Tasks

1. **Create `src/ConfirmDialog.jsx`** — props: `title`, `message`, `confirmLabel` (default `"Confirm"`), `onConfirm`, `onCancel`. Render `null` when not open is not needed if the parent conditionally renders it. Include an overlay `div` that closes on click when `e.target === e.currentTarget`, plus a `useEffect` that binds `keydown` on `document` and calls `onCancel` for `Escape`, cleaning up on unmount. Add `role="dialog"`, `aria-modal="true"`, and `aria-label` from `title`.
2. **Update `src/TransactionList.jsx`** — add `onDelete` to the prop list; add `const [pendingDeleteId, setPendingDeleteId] = useState(null)`; add a fifth `<th>Action</th>` header and a `<td>` with a `<button className="delete-btn">Delete</button>` per row that calls `setPendingDeleteId(t.id)`; below the closing `</table>`, conditionally render `ConfirmDialog` for the transaction matching `pendingDeleteId`, wiring `onConfirm` to call `onDelete(pendingDelete.id)` then `setPendingDeleteId(null)` and `onCancel` to `setPendingDeleteId(null)`. Keep the existing filter logic untouched.
3. **Update `src/App.jsx`** — add `handleDeleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id))` and pass `onDelete={handleDeleteTransaction}` to `TransactionList`. Use the functional `setTransactions` form to avoid a stale closure over `transactions`.
4. **Style in `src/App.css`** — add an overlay (fixed, full viewport, semi-transparent dark, centered flex) and a dialog card (white bg, border, padding, `max-width`, higher `z-index` than the overlay content); style the dialog action row as a flex with gap; give the confirm button a destructive treatment (e.g. dark-red bg) so it is visually distinct from the existing neutral `.delete-btn`. Match the existing flat, minimal aesthetic (solid `#333`/`#eee` palette, no border radius or shadows).

## Edge Cases Cover

| Scenario | Expected behavior |
|---|---|
| Cancel / Escape / backdrop clicked | Modal closes, transaction list unchanged |
| Confirm clicked | Only the matching transaction is removed; `pendingDeleteId` reset so the modal cannot re-open |
| Filter active while deleting | Filter state persists; remaining matching rows still shown, and totals in `Summary` reflect the full unfiltered data |
| Last visible row deleted with a filter applied | Show a "No transactions" message in the table body instead of an empty `<tbody>` |
| Ids | Filtering by `t.id` removes exactly one row; seed ids are `1-8` and new ones use `Date.now()`, so no collisions |

## Validation

1. `npm run lint` from the project root — must pass clean.
2. With the existing dev server on `http://localhost:5173/`, verify: Delete shows the modal with the right description and amount; Cancel, Escape, and backdrop click all close without deleting; Confirm removes only that row; Income/Expenses/Balance in the summary update immediately; Delete still works while a type or category filter is active.
3. Verify the modal is the only visual element that appears above the page content when open.

## Out Of Scope

- Undo/restore of a deleted transaction.
- Deleting multiple transactions or bulk actions.
- Any change to `TransactionForm.jsx`.
