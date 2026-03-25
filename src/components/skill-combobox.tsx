"use client";

import { useState, useRef, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SkillComboboxProps {
  skills: { id: string; name: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function SkillCombobox({
  skills,
  selected,
  onChange,
}: SkillComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = query.trim();
  const lowerQuery = trimmed.toLowerCase();

  // Filter skills that match the query and aren't already selected
  const filtered = trimmed
    ? skills.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerQuery) &&
          !selected.includes(s.name)
      )
    : [];

  // Show "Add as new" if query doesn't exactly match any existing skill
  const exactMatch = skills.some(
    (s) => s.name.toLowerCase() === lowerQuery
  );
  const showAddNew = trimmed.length > 0 && !exactMatch && !selected.includes(trimmed);

  function addSkill(name: string) {
    if (!selected.includes(name)) {
      onChange([...selected, name]);
    }
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeSkill(name: string) {
    onChange(selected.filter((s) => s !== name));
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* Selected skills as tags */}
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-sm text-primary"
            >
              {name}
              <button
                type="button"
                onClick={() => removeSkill(name)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search skills or type to add your own..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (trimmed) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (filtered.length > 0) {
                addSkill(filtered[0].name);
              } else if (showAddNew) {
                addSkill(trimmed);
              }
            }
            if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className="pl-9"
        />
      </div>

      {/* Dropdown */}
      {open && (filtered.length > 0 || showAddNew) && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-md">
          {filtered.slice(0, 8).map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => addSkill(skill.name)}
              className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
            >
              {skill.name}
            </button>
          ))}
          {showAddNew && (
            <button
              type="button"
              onClick={() => addSkill(trimmed)}
              className="flex w-full items-center px-3 py-2 text-left text-sm text-primary hover:bg-accent"
            >
              Add &ldquo;{trimmed}&rdquo; as a new skill
            </button>
          )}
        </div>
      )}
    </div>
  );
}
