// services, features, and other libraries
import { DateTime } from "effect";

// types
import type { ReactNode } from "react";

interface DateTimeAtProps {
  icon: ReactNode;
  title: string;
  date: Date;
}

export default function DateTimeAt({ icon, title, date }: DateTimeAtProps) {
  return (
    <section className="bg-background rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-4">
      <div className="flex items-center justify-center gap-2 uppercase">
        {icon}
        {title}
      </div>
      <p className="text-muted-foreground text-center">
        {DateTime.formatLocal(DateTime.unsafeFromDate(date), { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
      </p>
    </section>
  );
}
