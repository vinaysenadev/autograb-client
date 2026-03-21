import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

type SelectContextType = {
  value: string | null;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  registerItem: (value: string) => number;
  selectItem: (value: string) => void;
  disabled?: boolean;
};

type SelectProps = {
  value: string | null;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
};

type ItemProps = {
  value: string;
  children: React.ReactNode;
};

const SelectContext = createContext<SelectContextType | null>(null);

const useSelect = () => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Use inside Select");
  return ctx;
};

export const Select = ({
  value,
  onChange,
  disabled = false,
  children,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const itemsRef = useRef<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // register items
  const registerItem = (value: string) => {
    if (!itemsRef.current.includes(value)) {
      itemsRef.current.push(value);
    }
    return itemsRef.current.indexOf(value);
  };

  const selectItem = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value,
        onChange,
        open,
        setOpen,
        highlightedIndex,
        setHighlightedIndex,
        registerItem,
        selectItem,
        disabled,
      }}
    >
      <div ref={containerRef} className="select-container">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = () => {
  const { value, open, setOpen, disabled } = useSelect();

  return (
    <button
      disabled={disabled}
      type="button"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      className="select-trigger"
    >
      <span className="capitalize">{value || "Select Option"}</span>
      <span className="icon material-symbols-outlined">
        keyboard_arrow_down
      </span>
    </button>
  );
};

export const SelectContent = ({ children }: { children: React.ReactNode }) => {
  const { open } = useSelect();

  if (!open) return null;

  return (
    <ul role="listbox" className="select-content">
      {children}
    </ul>
  );
};

export const SelectItem = ({ value, children }: ItemProps) => {
  const { registerItem, selectItem, highlightedIndex, setHighlightedIndex } =
    useSelect();

  const index = registerItem(value);
  const isHighlighted = index === highlightedIndex;

  return (
    <li
      role="option"
      onMouseEnter={() => setHighlightedIndex(index)}
      onClick={() => selectItem(value)}
      className={`select-item ${isHighlighted ? "select-item-highlighted" : "select-item-default"}`}
    >
      {children}
    </li>
  );
};

Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;
