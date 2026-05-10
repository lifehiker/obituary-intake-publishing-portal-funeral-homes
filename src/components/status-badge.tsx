import { Badge } from "@/components/ui/badge";
import { STATUS_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn(STATUS_STYLES[status] || "bg-slate-100 text-slate-900")}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
