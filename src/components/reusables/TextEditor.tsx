import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { EditorToolbar } from "./EditorToolbar"; // adjust import path
import "./TextEditor.css";

interface EditorProps {
  disabled?: boolean;
}

export function TextEditor({ disabled }: EditorProps) {
  const editor = useEditor({
    editable: disabled === false,
    extensions: [
      StarterKit.configure({
        // Configure if needed (e.g., disable some features)
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: "<p>Commencez à écrire ici...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background shadow-sm">
      <EditorToolbar editor={editor} />
      <div className="p-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
