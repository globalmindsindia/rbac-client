// components/newsletter/RichTextEditor.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  List,
  ListOrdered,
  Quote,
  Code,
  Eye,
  Type,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your newsletter content here...",
}) => {
  const [activeView, setActiveView] = useState<"write" | "preview">("write");

  const insertText = (before: string, after: string = "") => {
    const textarea = document.querySelector(
      'textarea[data-editor="true"]'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      const linkText = prompt("Enter link text:") || url;
      insertText(`[${linkText}](${url})`);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      const alt = prompt("Enter alt text:") || "Image";
      insertText(`![${alt}](${url})`);
    }
  };

  const formatButtons = [
    { icon: Bold, action: () => insertText("**", "**"), title: "Bold" },
    { icon: Italic, action: () => insertText("_", "_"), title: "Italic" },
    {
      icon: Underline,
      action: () => insertText("<u>", "</u>"),
      title: "Underline",
    },
    { icon: Quote, action: () => insertText("> "), title: "Quote" },
    { icon: Code, action: () => insertText("`", "`"), title: "Inline Code" },
    { icon: List, action: () => insertText("- "), title: "Bullet List" },
    {
      icon: ListOrdered,
      action: () => insertText("1. "),
      title: "Numbered List",
    },
    { icon: Link, action: insertLink, title: "Insert Link" },
    { icon: Image, action: insertImage, title: "Insert Image" },
  ];

  const renderPreview = (content: string) => {
    // Simple markdown-to-HTML converter for preview
    let html = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic text
      .replace(/_(.*?)_/g, "<em>$1</em>")
      // Underline text
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded">$1</code>')
      // Blockquotes
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-primary pl-4 italic">$1</blockquote>'
      )
      // Unordered list items
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      // Ordered list items
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$1. $2</li>')
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-primary underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Images
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2" />'
      )
      // Line breaks
      .replace(/\r?\n/g, "<br>");

    // Wrap consecutive list items in containers
    html = html.replace(
      /(<li[^>]*>.*?<\/li>(?:\s*<br>\s*<li[^>]*>.*?<\/li>)*)/gs,
      (match) => {
        return `<ul class="space-y-1 my-2">${match.replace(
          /<br>\s*/g,
          ""
        )}</ul>`;
      }
    );

    // Clean up extra line breaks around block elements
    html = html.replace(
      /<br>\s*(?=<(?:blockquote|ul|h[1-6])>)|(?<=<\/(?:blockquote|ul|h[1-6])>)\s*<br>/g,
      ""
    );

    return html;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Content Editor</CardTitle>
          <Tabs
            value={activeView}
            onValueChange={(v) => setActiveView(v as "write" | "preview")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeView === "write" && (
          <>
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-muted/50">
              {formatButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {/* Text Area */}
            <Textarea
              data-editor="true"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[300px] font-mono text-sm"
              style={{ resize: "vertical" }}
            />

            {/* Helper Text */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Markdown Tips:</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <p>
                  **bold** → <strong>bold</strong>
                </p>
                <p>
                  _italic_ → <em>italic</em>
                </p>
                <p>
                  `code` → <code className="bg-muted px-1 rounded">code</code>
                </p>
                <p>
                  [link](url) →{" "}
                  <span className="text-primary underline">link</span>
                </p>
                <p>
                  &gt; quote → <em>quoted text</em>
                </p>
                <p>- bullet → • bullet point</p>
                <p>1. numbered → 1. numbered item</p>
                <p>![alt](url) → image</p>
              </div>
            </div>
          </>
        )}

        {activeView === "preview" && (
          <div className="min-h-[300px] p-4 border rounded-lg bg-background">
            {value ? (
              <div
                className="prose prose-sm max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
              />
            ) : (
              <div className="text-muted-foreground italic text-center py-12">
                Nothing to preview. Start writing in the Write tab.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
