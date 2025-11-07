// component css styles
import "@mdxeditor/editor/style.css";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// components
import { BlockTypeSelect, BoldItalicUnderlineToggles, InsertTable, InsertThematicBreak, ListsToggle, MDXEditor, Separator, UndoRedo } from "@mdxeditor/editor";
import { headingsPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";

// types
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import type { Ref } from "react";

interface MarkdownEditorProps extends MDXEditorProps {
  ref?: Ref<MDXEditorMethods>;
}

export default function MarkdownEditor({ ref, className, ...props }: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <MDXEditor
      {...props}
      ref={ref}
      className={cn("prose prose-neutral dark:prose-invert min-h-64 max-w-none font-mono", isDarkMode && "dark-theme", className)}
      contentEditableClassName="prose prose-neutral dark:prose-invert max-w-none font-mono min-h-64"
      suppressHtmlProcessing
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <InsertTable />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
    />
  );
}
