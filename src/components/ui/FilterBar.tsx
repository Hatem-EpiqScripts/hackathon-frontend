import { useState } from "react";
import { Button } from "@/components/ui/button";

type FilterConfig = {
  key: string;
  label: string;
  placeholder?: string;
};

type FilterBarProps = {
  filters: FilterConfig[];
  onApply: (values: Record<string, string>) => void;
  onClear?: () => void;
};

export function FilterBar({ filters, onApply, onClear }: FilterBarProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});

  function handleChange(key: string, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    const cleaned: Record<string, string> = Object.fromEntries(
      Object.entries(inputs).filter(([_, v]) => v.trim() !== "")
    );
    onApply(cleaned);
  }

  function handleClear() {
    setInputs({});
    onClear?.();
  }

  const hasInput = Object.values(inputs).some((v) => v.trim() !== "");

  return (
    <div className="flex gap-2 items-center">
      {filters.map((f) => (
        <input
          key={f.key}
          type="text"
          placeholder={f.placeholder ?? f.label}
          value={inputs[f.key] ?? ""}
          onChange={(e) => handleChange(f.key, e.target.value)}
          className="border p-2 rounded w-64 cursor-text"
        />
      ))}

      <Button
        onClick={handleApply}
        className="cursor-pointer"
        disabled={!hasInput}
      >
        Apply Filter
      </Button>

      <Button onClick={handleClear} className="cursor-pointer">
        Unapply Filter
      </Button>
    </div>
  );
}
