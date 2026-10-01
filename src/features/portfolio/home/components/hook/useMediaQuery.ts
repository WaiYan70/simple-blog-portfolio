import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const updateMatch = () => {
      setMatch(mediaQuery.matches);
    };

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [query]);
  return match;
}
