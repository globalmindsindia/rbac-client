// src/components/CreatableCombobox.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check, Plus } from "lucide-react";

// CreatableCombobox.tsx
type Props = {
  value: string;
  onChange: (val: string) => void;
  options: readonly string[]; // accept readonly too
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function CreatableCombobox({
  value,
  onChange,
  options,
  placeholder = "Search or enter...",
  disabled,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const normalized = React.useMemo(
    () => options.map((o) => ({ label: o, value: o })),
    [options]
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter((o) => o.label.toLowerCase().includes(q));
  }, [normalized, query]);

  const selected = value || "";

  function handleSelect(next: string) {
    onChange(next);
    setOpen(false);
    setQuery("");
  }

  function handleCreate() {
    const custom = query.trim();
    if (!custom) return;
    onChange(custom);
    setOpen(false);
    setQuery("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={`w-full justify-between rounded-xl border-border bg-input ${
            className ?? ""
          }`}
        >
          <span className="truncate">{selected || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
            className="h-9"
          />
          <CommandList className="max-h-64">
            {filtered.length === 0 ? (
              <>
                <CommandEmpty>No results found</CommandEmpty>
                <div className="p-2">
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    onClick={handleCreate}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create “{query.trim()}”
                  </Button>
                </div>
              </>
            ) : (
              <CommandGroup>
                {filtered.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => handleSelect(opt.value)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="truncate">{opt.label}</span>
                      {opt.value === selected ? (
                        <Check className="h-4 w-4 opacity-80" />
                      ) : null}
                    </div>
                  </CommandItem>
                ))}
                {!!query.trim() &&
                  !normalized.some(
                    (o) => o.label.toLowerCase() === query.trim().toLowerCase()
                  ) && (
                    <CommandItem onSelect={handleCreate}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create “{query.trim()}”
                    </CommandItem>
                  )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
