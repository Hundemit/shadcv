"use client";

import { useEffect, useRef, useState } from "react";

export function useCopyToClipboard({ timeout = 1500 } = {}) {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => clearTimeout(resetTimer.current);
  }, []);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      clearTimeout(resetTimer.current);
      setIsCopied(false);
      return false;
    }

    clearTimeout(resetTimer.current);
    setIsCopied(true);
    resetTimer.current = setTimeout(() => setIsCopied(false), timeout);
    return true;
  }

  return { isCopied, copyToClipboard };
}
