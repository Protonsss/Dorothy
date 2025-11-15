import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import './CommandPalette.css';

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon?: string;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  commands: Command[];
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({
  commands,
  isOpen,
  onClose,
}: CommandPaletteProps): JSX.Element | null {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          Math.min(prev + 1, filteredCommands.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
    }
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return (): void => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="command-palette-overlay" onClick={onClose}>
      <div
        className="command-palette"
        onClick={(e): void => e.stopPropagation()}
      >
        <div className="command-palette-search">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command..."
            value={search}
            onChange={(e): void => setSearch(e.target.value)}
            className="command-palette-input"
          />
        </div>

        <div className="command-palette-results">
          {filteredCommands.length === 0 ? (
            <div className="command-palette-empty">No commands found</div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                className={`command-palette-item ${
                  index === selectedIndex ? 'selected' : ''
                }`}
                onClick={(): void => {
                  cmd.action();
                  onClose();
                }}
                onMouseEnter={(): void => setSelectedIndex(index)}
              >
                {cmd.icon && <span className="command-icon">{cmd.icon}</span>}
                <span className="command-label">{cmd.label}</span>
                {cmd.shortcut && (
                  <span className="command-shortcut">{cmd.shortcut}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function useCommandPalette(commands: Command[]): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  CommandPaletteComponent: () => JSX.Element | null;
} {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return (): void => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: (): void => setIsOpen(true),
    close: (): void => setIsOpen(false),
    CommandPaletteComponent: (): JSX.Element | null => (
      <CommandPalette
        commands={commands}
        isOpen={isOpen}
        onClose={(): void => setIsOpen(false)}
      />
    ),
  };
}
