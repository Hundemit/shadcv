"use client";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Check, FolderPen, LoaderCircle, TriangleAlert } from "lucide-react";
import { toolbarButtonStyles } from "./toolbar-styles";
import { Button } from "../ui/button";

export function PdfExportButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { resolvedTheme } = useTheme();
  const running = useRef(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    error: boolean;
  } | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function exportPdfs() {
    if (running.current) return;
    running.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: resolvedTheme === "dark" ? "dark" : "light",
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "PDF-Export fehlgeschlagen.");
      setFeedback({ message: result.message, error: false });
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error ? error.message : "PDF-Export fehlgeschlagen.",
        error: true,
      });
    } finally {
      running.current = false;
      setPending(false);
    }
  }
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={toolbarButtonStyles.base}
        aria-label={pending ? pendingLabel : label}
        title={label}
        aria-busy={pending}
        disabled={pending}
        onClick={exportPdfs}
      >
        {pending ? (
          <LoaderCircle
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
        ) : feedback && !feedback.error ? (
          <Check aria-hidden="true" />
        ) : feedback && feedback.error ? (
          <TriangleAlert aria-hidden="true" />
        ) : (
          <FolderPen aria-hidden="true" />
        )}
      </Button>
      {feedback ? (
        <p
          role={feedback.error ? "alert" : "status"}
          className="bg-background text-foreground absolute top-full right-0 z-10 mt-2 max-w-xs rounded-md border px-3 py-2 text-xs shadow-sm"
        >
          {feedback.message}
        </p>
      ) : null}
    </>
  );
}
