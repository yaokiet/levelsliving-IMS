import { useCallback, useState } from "react";

export function useAppliedSearch(initial = "") {
  const [searchInput, setSearchInput] = useState(initial);
  const [searchQuery, setSearchQuery] = useState(initial);

  const applySearch = useCallback(() => {
    setSearchQuery(searchInput);
  }, [searchInput]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applySearch();
      }
    },
    [applySearch]
  );

  return {
    searchInput,
    setSearchInput,
    searchQuery,
    setSearchQuery,
    applySearch,
    onKeyDown,
  };
}