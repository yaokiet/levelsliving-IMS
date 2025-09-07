"use client";

import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createItemComponent } from "@/lib/api/apiItemComponent";
import { getAllItems } from "@/lib/api/itemsApi";
import { Button } from "@/components/ui/button";
import type { Item } from "@/types/item";

// Types for items fetched to add as children
type ItemSummary = {
  id: number;
  item_name: string;
  sku: string;
};

interface ItemAddChildItemProps {
  item: Item; // parent item (from useItem in page.tsx)
  excludeIds?: number[]; // optional: ids to exclude (already linked children)
  onAdded?: () => void | Promise<void>; // callback after successful add to refresh parent
}

/**
 * A reusable dialog component to add child items to an existing item.
 * Uses the current item's ID as the parent ID when adding children.
 *
 * @param {Item} item The parent item to add children to.
 * @param {number[]?} excludeIds Optional: IDs to exclude from the list of available items.
 * @param {() => void | Promise<void>?} onAdded Optional: callback after successful add to refresh parent.
 * @returns {JSX.Element}
 */
export function ItemAddChildItem({
  item,
  excludeIds = [],
  onAdded,
}: ItemAddChildItemProps) {
  const parentItemId = item.id;
  const [open, setOpen] = useState(false);

  // Separate input vs. applied search term
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [qtyById, setQtyById] = useState<Map<number, string>>(new Map());

  // State for available items to select from
  const [availableItems, setAvailableItems] = useState<ItemSummary[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      setListError(null);
      setSearchInput("");
      setSearchQuery("");
      setSelected(new Set());
      setSubmitting(false);
      setAvailableItems([]);
      setQtyById(new Map());
    }
  }, []);

  // Fetch all items (by calling api) when dialog opens
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const run = async () => {
      setListLoading(true);
      setListError(null);
      try {
        const all = await getAllItems();
        if (cancelled) return;
        // Map to minimal summary shape if needed
        const mapped: ItemSummary[] = all.map((it) => ({
          id: it.id,
          item_name: it.item_name,
          sku: it.sku,
        }));
        setAvailableItems(mapped);
      } catch (e: any) {
        if (cancelled) return;
        setListError(e?.message || "Failed to load items.");
      } finally {
        if (!cancelled) setListLoading(false);
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [open]);

  // Filtered items based on search and excludeIds
  // Some IDs to exclude: parent item itself + already linked children + any passed excludeIds
  const filtered = useMemo(() => {
    const exclude = new Set<number>([parentItemId, ...excludeIds]);
    const q = searchQuery.trim().toLowerCase();
    return availableItems
      .filter((it) => !exclude.has(it.id))
      .filter((it) => {
        if (!q) return true;
        return (
          it.item_name.toLowerCase().includes(q) ||
          it.sku.toLowerCase().includes(q)
        );
      });
  }, [availableItems, excludeIds, parentItemId, searchQuery]);

    /**
   * Apply the search only when button clicked or Enter pressed.
   */
  const applySearch = () => {
    setSearchQuery(searchInput);
  };

  /**
   * Toggles the selection of an item to add as a child to the parent item.
   * If the item is already selected, it will be deselected and the quantity
   * will be removed. If the item is not selected, it will be selected with
   * a default quantity of 1.
   * @param {number} id The ID of the item to toggle selection.
   */
  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const nextQty = new Map(qtyById);
      if (next.has(id)) {
        next.delete(id);
        nextQty.delete(id); // remove qty when unselecting
      } else {
        next.add(id);
        if (!nextQty.has(id)) nextQty.set(id, "1"); // default qty
      }
      setQtyById(nextQty);
      return next;
    });
  };

  /**
   * Updates the quantity of an item to add as a child to the parent item.
   * If the item is not selected, this does nothing.
   * @param {number} id The ID of the item to update the quantity for.
   * @param {string} val The new quantity value.
   */
  const setQty = (id: number, val: string) => {
    setQtyById((prev) => {
      const next = new Map(prev);
      next.set(id, val);
      return next;
    });
  };

  const allFilteredIds = useMemo(() => filtered.map((i) => i.id), [filtered]);
  const allFilteredSelected = useMemo(
    () =>
      allFilteredIds.length > 0 &&
      allFilteredIds.every((id) => selected.has(id)),
    [allFilteredIds, selected]
  );

  //   Way of searching to be changed
  // Fetch from API with search param instead of filtering all in memory
  /**
   * Toggles the selection of all items that are filtered by the current search
   * and not excluded by the excludeIds prop.
   * If all items are already selected, this will unselect all of them.
   * If some or none of the items are selected, this will select all of them.
   */
  const toggleSelectAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      const nextQty = new Map(qtyById);
      const ids = allFilteredIds;
      if (ids.length === 0) return next;
      const allSelected = ids.every((id) => next.has(id));
      if (allSelected) {
        ids.forEach((id) => {
          next.delete(id);
          nextQty.delete(id);
        });
      } else {
        ids.forEach((id) => {
          next.add(id);
          if (!nextQty.has(id)) nextQty.set(id, "1");
        });
      }
      setQtyById(nextQty);
      return next;
    });
  };

  // helper to parse positive int
  const parseQty = (s: string | undefined): number | null => {
    const n = Number.parseInt((s ?? "").trim(), 10);
    if (!Number.isFinite(n) || n < 1) return null;
    return n;
  };

  /**
   * Handles the "Confirm" button click by validating the form state and building
   * a payload suitable for the `createItemComponent` API function. If the form
   * state is invalid, returns a promise that resolves to an object with a
   * `status` property set to 400 and an `error` property with an error message
   * for the user. If the form state is valid, attempts to call the
   * `createItemComponent` API function with the updated item data. If the API call
   * is successful, returns a promise that resolves to an object with a `status`
   * property set to 200 and calls the `onAdded` callback (if provided). If the
   * API call fails, returns a promise that resolves to an object with a `status`
   * property set to 500 and an `error` property with an error message for the
   * user.
   *
   * @returns { Promise<{ status: number; error?: string; }> }
   */
  const onConfirm = async () => {
    setError(null);

    if (selected.size === 0) {
      setError("Please select at least one item to add as a child.");
      return { status: 400 };
    }

    try {
      setSubmitting(true);

      // Validate all selected quantities
      const invalidQtyIds = Array.from(selected).filter((childId) => parseQty(qtyById.get(childId)) === null);
      if (invalidQtyIds.length > 0) {
        setError("Please enter a valid positive integer quantity for all selected items.");
        setSubmitting(false);
        return { status: 400 };
      }

      //   Build payloads for each selected item
      const payloads = Array.from(selected).map((childId) => ({
        parent_id: parentItemId,
        child_id: childId,
        qty_required: parseQty(qtyById.get(childId)) as number,
      }));

      const results = await Promise.allSettled(
        payloads.map((p) => createItemComponent(p))
      );

      const rejected = results.filter((r) => r.status === "rejected");
      if (rejected.length > 0) {
        setError(
          `Failed to add ${rejected.length} of ${results.length} selected item(s). Please try again.`
        );
        return { status: 422 };
      }

      await onAdded?.();
      return { status: 200 };
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "An error occurred while adding child items.");
      return { status: 500 };
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCount = selected.size;

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Add Child Item(s)
      </Button>

      <ReusableDialog
        open={open}
        onOpenChange={handleOpenChange}
        dialogTitle="Add Child Items"
        confirmButtonText={submitting ? "Adding..." : "Add Selected"}
        cancelButtonText="Cancel"
        onConfirm={onConfirm}
      >
        <div className="grid gap-4">
          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              placeholder="Search by name or SKU..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applySearch();
                }
              }}
              disabled={submitting}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={applySearch}
              disabled={submitting}
            >
              Search
            </Button>
          </div>

          <div className="max-h-72 overflow-auto border rounded">
            {listLoading ? (
              <div className="p-3 text-sm text-muted-foreground">
                Loading items...
              </div>
            ) : listError ? (
              <div className="p-3 text-sm text-red-500">{listError}</div>
            ) : filtered.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                No items available.
              </div>
            ) : (
              <ul className="divide-y">
                {filtered.map((it) => {
                  const checked = selected.has(it.id);
                  const qtyVal = qtyById.get(it.id) ?? "";
                  return (
                    <li
                      key={it.id}
                      className="flex items-center justify-between gap-3 p-2 hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          id={`child-${it.id}`}
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={() => toggle(it.id)}
                          disabled={submitting}
                        />
                        <label
                          htmlFor={`child-${it.id}`}
                          className="flex flex-col cursor-pointer"
                        >
                          <span className="text-sm font-medium">
                            {it.item_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            SKU: {it.sku}
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={`qty-${it.id}`}
                          className="text-xs text-muted-foreground"
                        >
                          Qty required
                        </label>
                        <input
                          id={`qty-${it.id}`}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          step={1}
                          className="w-20 border rounded px-2 py-1 text-right"
                          value={qtyVal}
                          onChange={(e) => setQty(it.id, e.target.value)}
                          disabled={!checked || submitting}
                          placeholder="1"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Selected: {selectedCount}
          </div>
        </div>
      </ReusableDialog>
    </>
  );
}