// component css styles
import "@mdxeditor/editor/style.css";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// components
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  Separator,
  UndoRedo,
} from "@mdxeditor/editor";
import {
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

// types
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import type { Ref } from "react";

interface MarkdownEditorProps extends MDXEditorProps {
  ref?: Ref<MDXEditorMethods>;
}

export default function MarkdownEditor({ ref, className, ...props }: MarkdownEditorProps) {
  // Determine whether the current theme is dark or light
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <MDXEditor
      {...props}
      ref={ref}
      className={cn("prose dark:prose-invert min-h-64 max-w-none font-mono", isDarkMode && "dark-theme", className)}
      contentEditableClassName="prose dark:prose-invert min-h-64 max-w-none font-mono"
      suppressHtmlProcessing
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "CSS",
            txt: "TXT",
            sql: "SQL",
            html: "HTML",
            sass: "SASS",
            scss: "SCSS",
            bash: "BASH",
            json: "JSON",
            js: "JavaScript",
            ts: "TypeScript",
            "": "Unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
            py: "Python",
          },
          autoLoadLanguageSupport: true,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "", readOnlyDiff: true }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <Separator />
                        <BlockTypeSelect />
                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <Separator />
                        <ListsToggle />
                        <Separator />
                        <InsertTable />
                        <InsertThematicBreak />
                        <Separator />
                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
    />
  );
}
