"use client";

import { Badge } from "@/components/ui/custom/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, ChevronDownIcon, CircleIcon, ClockIcon, WrenchIcon, XCircleIcon } from "lucide-react";

import { isValidElement } from "react";
import { CodeBlock } from "@/components/ai-elements/code-block";

// types
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ToolUIPart } from "ai";

type ToolProps = ComponentPropsWithoutRef<typeof Collapsible>;
type ToolHeaderProps = { title?: string; type: ToolUIPart["type"]; state: ToolUIPart["state"]; className?: string };
type ToolContentProps = ComponentPropsWithoutRef<typeof CollapsibleContent>;
type ToolInputProps = ComponentPropsWithoutRef<"div"> & { input: ToolUIPart["input"] };
type ToolOutputProps = ComponentPropsWithoutRef<"div"> & { output: ToolUIPart["output"]; errorText: ToolUIPart["errorText"] };

// constants
const ICONS = {
  "input-streaming": <CircleIcon className="size-7" />,
  "input-available": <ClockIcon className="size-7 animate-pulse" />,
  "approval-requested": <ClockIcon className="size-7 text-yellow-600" />,
  "approval-responded": <CheckCircleIcon className="size-7 text-blue-600" />,
  "output-available": <CheckCircleIcon className="size-7 text-green-600" />,
  "output-error": <XCircleIcon className="size-7 text-red-600" />,
  "output-denied": <XCircleIcon className="size-7 text-orange-600" />,
} as const;
const LABELS = {
  "input-streaming": "Pending",
  "input-available": "Running",
  "approval-requested": "Awaiting Approval",
  "approval-responded": "Responded",
  "output-available": "Completed",
  "output-error": "Error",
  "output-denied": "Denied",
} as const;

export const Tool = ({ className, ...props }: ToolProps) => <Collapsible className={cn("group mb-4 w-full rounded-md border", className)} {...props} />;

export const ToolHeader = ({ className, title, type, state, ...props }: ToolHeaderProps) => (
  <CollapsibleTrigger className={cn("flex w-full items-center justify-between gap-4 p-3 text-lg", className)} {...props}>
    <div className="text-muted-foreground flex flex-wrap items-center gap-2">
      <WrenchIcon className="size-7" />
      {title ?? type.split("-").slice(1).join("-")}
      <Badge className="gap-2 rounded-lg" variant="outline">
        {ICONS[state]}
        {LABELS[state]}
      </Badge>
    </div>
    <ChevronDownIcon className="text-muted-foreground size-7 transition-transform group-data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
);

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in outline-none",
      className,
    )}
    {...props}
  />
);

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <div className={cn("space-y-2 overflow-hidden p-4", className)} {...props}>
    <h4 className="text-muted-foreground tracking-wide uppercase">Parameters</h4>
    <div className="bg-muted/50 rounded-md">
      <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
    </div>
  </div>
);

export const ToolOutput = ({ className, output, errorText, ...props }: ToolOutputProps) => {
  if (!(output || errorText)) return null;

  let Output = <div>{output as ReactNode}</div>;

  if (typeof output === "object" && !isValidElement(output)) {
    Output = <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />;
  } else if (typeof output === "string") {
    Output = <CodeBlock code={output} language="json" />;
  }

  return (
    <div className={cn("space-y-2 p-4", className)} {...props}>
      <h4 className="text-muted-foreground tracking-wide uppercase">{errorText ? "Error" : "Result"}</h4>
      <div className={cn("overflow-x-auto [&_table]:w-full", errorText ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-foreground")}>
        {errorText && <div>{errorText}</div>}
        {Output}
      </div>
    </div>
  );
};
