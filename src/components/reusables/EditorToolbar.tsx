import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Pilcrow,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";
import { Editor } from "@tiptap/react"; // Import the Editor type

interface EditorToolbarProps {
  className?: string;
  editor: Editor | null; // Receive the editor instance
}

type HeadingLevel = "p" | "h1" | "h2" | "h3" | "h4";

const headingOptions = [
  { label: "Paragraphe", value: "p", icon: Pilcrow, level: null },
  { label: "Titre 1", value: "h1", icon: Heading1, level: 1 },
  { label: "Titre 2", value: "h2", icon: Heading2, level: 2 },
  { label: "Titre 3", value: "h3", icon: Heading3, level: 3 },
  { label: "Titre 4", value: "h4", icon: Heading4, level: 4 },
];

export function EditorToolbar({ className = "", editor }: EditorToolbarProps) {
  // Get the current heading level from the editor state
  const getActiveHeading = (): HeadingLevel => {
    if (!editor) return "p";
    for (const option of headingOptions) {
      if (option.value === "p") continue;
      if (editor.isActive("heading", { level: option.level })) {
        return option.value as HeadingLevel;
      }
    }
    return "p";
  };

  const activeHeading = getActiveHeading();

  // Handler for heading select change
  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as HeadingLevel;
    if (!editor) return;
    if (value === "p") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = headingOptions.find((h) => h.value === value)?.level;
      if (level) {
        editor.chain().focus().toggleHeading({ level }).run();
      }
    }
  };

  const tools = [
    // Groupe : Formatage de texte
    {
      group: "text",
      items: [
        { icon: Bold, action: "toggleBold", label: "Gras", shortcut: "Ctrl+B" },
        {
          icon: Italic,
          action: "toggleItalic",
          label: "Italique",
          shortcut: "Ctrl+I",
        },
        {
          icon: Underline,
          action: "toggleUnderline",
          label: "Souligné",
          shortcut: "Ctrl+U",
        },
        {
          icon: Strikethrough,
          action: "toggleStrike",
          label: "Barré",
          shortcut: "Ctrl+Shift+X",
        },
      ],
    },
    // Groupe : Listes
    {
      group: "lists",
      items: [
        { icon: List, action: "toggleBulletList", label: "Liste à puces" },
        {
          icon: ListOrdered,
          action: "toggleOrderedList",
          label: "Liste numérotée",
        },
        { icon: ListTodo, action: "toggleTaskList", label: "Liste de tâches" },
      ],
    },
    // Groupe : Insertion
    {
      group: "insert",
      items: [
        { icon: Link, action: "setLink", label: "Lien", shortcut: "Ctrl+K" },
        { icon: Image, action: "setImage", label: "Image" },
        { icon: Minus, action: "setHorizontalRule", label: "Séparateur" },
        { icon: Code, action: "toggleCodeBlock", label: "Code" },
        { icon: Quote, action: "toggleBlockquote", label: "Citation" },
      ],
    },
  ];

  // Helper to check if a command is active
  const isActive = (action: string, options?: any) => {
    if (!editor) return false;
    switch (action) {
      case "toggleBold":
        return editor.isActive("bold");
      case "toggleItalic":
        return editor.isActive("italic");
      case "toggleUnderline":
        return editor.isActive("underline");
      case "toggleStrike":
        return editor.isActive("strike");
      case "toggleBulletList":
        return editor.isActive("bulletList");
      case "toggleOrderedList":
        return editor.isActive("orderedList");
      case "toggleTaskList":
        return editor.isActive("taskList");
      case "toggleCodeBlock":
        return editor.isActive("codeBlock");
      case "toggleBlockquote":
        return editor.isActive("blockquote");
      // For link, image, hr we don't typically show active state
      default:
        return false;
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 p-2 bg-muted/30 rounded-xl border border-border/60 backdrop-blur-sm ${className}`}
      role="toolbar"
      aria-label="Barre d'outils de l'éditeur"
    >
      {/* Sélecteur de type de titre */}
      <div className="flex items-center gap-1.5 pr-2 mr-1 border-r border-border/50">
        <div className="relative">
          <select
            value={activeHeading}
            onChange={handleHeadingChange}
            className="appearance-none h-8 pl-7 pr-8 text-xs font-medium bg-background hover:bg-muted/50 rounded-md border border-border/50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-foreground"
            aria-label="Type de titre"
          >
            {headingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Icône du type sélectionné */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            {(() => {
              const selected = headingOptions.find(
                (h) => h.value === activeHeading,
              );
              if (selected) {
                const Icon = selected.icon;
                return <Icon className="h-3.5 w-3.5" />;
              }
              return <Pilcrow className="h-3.5 w-3.5" />;
            })()}
          </div>
          {/* Flèche du select */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <svg className="h-3 w-3 fill-current" viewBox="0 0 10 6">
              <path d="M0 0l5 6 5-6z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Groupes d'outils */}
      {tools.map((group, groupIndex) => (
        <div
          key={group.group}
          className={`flex items-center gap-0.5 ${
            groupIndex < tools.length - 1
              ? "pr-2 mr-1 border-r border-border/50"
              : ""
          }`}
        >
          {group.items.map((tool) => {
            const active = isActive(tool.action);
            return (
              <button
                key={tool.action}
                type="button"
                onClick={() => {
                  if (!editor) return;
                  // Handle special actions that need additional logic
                  switch (tool.action) {
                    case "setLink":
                      const url = window.prompt("Entrez l'URL du lien:");
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                      }
                      break;
                    case "setHorizontalRule":
                      editor.chain().focus().setHorizontalRule().run();
                      break;
                    default:
                      // For toggle commands, just call the command
                      editor.chain().focus()[tool.action]().run();
                      break;
                  }
                }}
                className={`group relative h-8 w-8 flex items-center justify-center rounded-md hover:bg-background hover:shadow-sm transition-all ${
                  active
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                } focus:outline-none focus:ring-1 focus:ring-primary/30`}
                aria-label={tool.label}
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""}`}
              >
                <tool.icon className="h-4 w-4" />

                {/* Tooltip au survol */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-foreground text-background text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                    {tool.label}
                    {tool.shortcut && (
                      <span className="ml-1.5 text-[9px] opacity-70">
                        {tool.shortcut}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ))}

      {/* Espace flexible pour d'éventuelles actions supplémentaires */}
      <div className="flex-1" />
      
    </div>
  );
}
