import { useEffect, useRef, useState } from 'react';

export interface SelectOption { value: string; label: string; }

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  placeholder?: string;
}

const CustomSelect = ({ options, value, onChange, error, placeholder = 'Select an option' }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className={`ent-input ent-custom-select${error ? ' error' : ''}${open ? ' open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <span style={{ color: selected ? 'var(--text)' : 'var(--text-3)', fontWeight: selected ? 500 : 400, flex: 1 }}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className="ent-select-chevron" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="ent-select-panel" style={{ maxHeight: 220, overflowY: 'auto' }}>
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              className={`ent-select-opt${value === o.value ? ' active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
              {value === o.value && (
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
