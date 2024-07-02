declare module "@/components/ui/select" {
  import * as React from "react";

  export const SelectLabel: React.FC<React.HTMLAttributes<HTMLLabelElement>>;
  export const Select: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
  export const SelectGroup: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const SelectValue: React.FC<React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }>;
  export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const SelectItem: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }>;
}
