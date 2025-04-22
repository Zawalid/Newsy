"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { HexColorPicker } from "react-colorful";

import {
  Bold,
  Italic,
  Highlighter,
  Strikethrough,
  Code,
  ChevronDown,
  Paintbrush,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Underline as UnderlineIcon,
} from "lucide-react";

import { Toggle } from "./toggle";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Underline,
  Superscript,
  Subscript,
  Highlight.configure({ multicolor: true }),
  TextStyle,
  // TextAlign.configure({
  //   types: ["heading", "paragraph"],
  // }),
  Color,
];

type TiptapEditorProps = {
  content?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  className?: string;
};

export function TiptapEditor({ content, placeholder, onChange, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: placeholder || "Start writing...",
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-hidden min-h-12",
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onChange?.(isContentEmpty(content) ? "" : content);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-lg min-w-fit border bg-card">
      <div className="flex items-center gap-1 border-b p-1">
        {[
          {
            name: "bold",
            onClick: () => editor.chain().focus().toggleBold().run(),
            disabled: !editor.can().chain().focus().toggleBold().run(),
            Icon: Bold,
          },
          {
            name: "italic",
            onClick: () => editor.chain().focus().toggleItalic().run(),
            disabled: !editor.can().chain().focus().toggleItalic().run(),
            Icon: Italic,
          },
          {
            name: "strike",
            onClick: () => editor.chain().focus().toggleStrike().run(),
            disabled: !editor.can().chain().focus().toggleStrike().run(),
            Icon: Strikethrough,
          },
          {
            name: "underline",
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            disabled: !editor.can().chain().focus().toggleUnderline().run(),
            Icon: UnderlineIcon,
          },
          {
            name: "superscript",
            onClick: () => editor.chain().focus().toggleSuperscript().run(),
            disabled: !editor.can().chain().focus().toggleSuperscript().run(),
            Icon: SuperscriptIcon,
          },
          {
            name: "subscript",
            onClick: () => editor.chain().focus().toggleSubscript().run(),
            disabled: !editor.can().chain().focus().toggleSubscript().run(),
            Icon: SubscriptIcon,
          },
          {
            name: "code",
            onClick: () => editor.chain().focus().toggleCode().run(),
            disabled: !editor.can().chain().focus().toggleCode().run(),
            Icon: Code,
          },
        ].map(({ name, disabled, Icon, onClick }) => (
          <Toggle
            size="sm"
            className="h-6 px-1 [&_svg]:size-3.5 text-xs min-w-6"
            key={name}
            disabled={disabled}
            pressed={editor.isActive(name)}
            onPressedChange={onClick}
          >
            <Icon className="h-4 w-4" />
          </Toggle>
        ))}
        <ColorPicker
          editor={editor}
          name="highlight"
          disabled={() => !editor.can().chain().focus().toggleHighlight().run()}
          onClick={(color) => editor.chain().focus().toggleHighlight({ color }).run()}
          Icon={Highlighter}
        />
        <ColorPicker
          editor={editor}
          name="textStyle"
          disabled={(color) => !editor.can().chain().focus().setColor(color).run()}
          onClick={(color) => editor.chain().focus().setColor(color).run()}
          Icon={Paintbrush}
        />
      </div>
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

type ColorPickerProps = {
  editor: Editor;
  name: string;
  disabled: (color: string) => boolean;
  onClick: (color: string) => void;
  Icon: React.ElementType;
};

function ColorPicker({ editor, name, Icon, disabled, onClick }: ColorPickerProps) {
  const [color, setColor] = useState("#ecec00");

  return (
    <div className="flex gap-1">
      <Toggle
        size="sm"
        className="h-6 px-1. min-w-6"
        pressed={editor.isActive(name)}
        disabled={disabled(color)}
        onPressedChange={() => onClick(color)}
      >
        <Icon className="h-4 w-4" />
      </Toggle>
      <Popover>
        <PopoverTrigger asChild>
          <Toggle
            size="sm"
            className="p-0 min-w-1 h-6"
            style={{ backgroundColor: editor.isActive(name) ? color : "" }}
          >
            <ChevronDown size={10} />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <HexColorPicker
            color={color}
            onChange={(color) => {
              setColor(color);
              onClick(color);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const isContentEmpty = (content: string) => {
  if (!content) return true;
  const div = document.createElement("div");
  div.innerHTML = content;
  return div.textContent?.trim() === "";
};
