import React from "react";

type TableOfContentsProps = {
  activeSection?: string;
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ activeSection }) => {
  const sections = [
    { id: "name", label: "Name" },
    { id: "avatar", label: "Avatar" },
    { id: "modelProvider", label: "Model provider" },
    { id: "clients", label: "Clients" },
    { id: "plugins", label: "Plugins" },
    { id: "bio", label: "Bio" },
    { id: "lore", label: "Lore" },
    { id: "knowledge", label: "Knowledge" },
    { id: "messageExamples", label: "Message examples" },
    { id: "postExamples", label: "Post examples" },
    { id: "style", label: "Style" },
    { id: "topics", label: "Topics" },
    { id: "adjectives", label: "Adjectives" },
  ];

  return (
    <div className="sticky top-0">
      <h3 className="font-medium mb-3 text-lg text-white text-shadow-sm animate-text-glow">Table of Contents</h3>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block text-sm ${
                activeSection === section.id
                  ? "text-studio-accent font-medium"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {activeSection === section.id && "• "}
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;