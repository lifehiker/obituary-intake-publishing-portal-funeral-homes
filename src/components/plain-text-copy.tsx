"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlainTextCopy({ text }: { text: string }) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="no-print"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
      }}
    >
      <Copy className="h-4 w-4" />
      Copy plain text
    </Button>
  );
}
