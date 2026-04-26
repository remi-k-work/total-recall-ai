// services, features, and other libraries
import { defaultRehypePlugins } from "streamdown";
import { harden } from "rehype-harden";

// types
import type { ComponentPropsWithoutRef } from "react";
import type { MessageResponse } from "@/components/ai-elements/custom/message";

type ResponseType = ComponentPropsWithoutRef<typeof MessageResponse>;

// This is a list of rehype plugins along with their respective settings
export const REHYPE_PLUGINS: ResponseType["rehypePlugins"] = [
  defaultRehypePlugins.raw,
  defaultRehypePlugins.katex,
  defaultRehypePlugins.sanitize,
  [
    harden,
    {
      defaultOrigin: process.env.NEXT_PUBLIC_WEBSITE_URL,
      allowedLinkPrefixes: [process.env.NEXT_PUBLIC_WEBSITE_URL],
    },
  ],
] as const;
