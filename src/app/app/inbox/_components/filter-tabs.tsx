import React, { useRef, useEffect, useState, SetStateAction, Dispatch } from 'react';
import { motion } from 'framer-motion';

const FILTER_OPTIONS = [
  { value: 'is:unread', label: 'Unread' },
  { value: 'is:read', label: 'Read' },
  { value: 'is:important', label: 'Important' },
  { value: 'is:starred', label: 'Starred' },
];

export function FilterTabs({
  filters,
  setFilters,
}: {
  filters: string[];
  setFilters: Dispatch<SetStateAction<string[]>>;
}) {
  const [activeTabRect, setActiveTabRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (filter: string) => {
    setFilters((prev) => {
      const newFilters = prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter];

      return newFilters.length === FILTER_OPTIONS.length ? [] : newFilters;
    });
  };

  useEffect(() => {
    const updateRects = () => {
      if (containerRef.current) setContainerRect(containerRef.current.getBoundingClientRect());

      const activeTabs = tabsRef.current.filter((tab, index) => {
        if (index === 0) return filters.length === 0;
        return filters.includes(FILTER_OPTIONS[index - 1].value);
      });

      if (activeTabs.length > 0 && activeTabs[0]) {
        setActiveTabRect(activeTabs[0].getBoundingClientRect());
      }
    };

    updateRects();

    const abortController = new AbortController();

    window.addEventListener('panels-resized', updateRects, {
      signal: abortController.signal,
    });
    window.addEventListener('resize', updateRects, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [filters]);

  return (
    <div ref={containerRef} className='relative flex w-full gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800'>
      {activeTabRect && containerRect && (
        <motion.div
          className='absolute top-0 z-0 rounded-md bg-white shadow-xs dark:bg-zinc-700'
          initial={false}
          animate={{
            x: activeTabRect.left - containerRect.left - 4,
            y: activeTabRect.top - containerRect.top,
            width: activeTabRect.width,
            height: activeTabRect.height,
            scale: filters.length > 1 ? [1, 1.02, 1] : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        />
      )}

      <button
        ref={(el) => {
          tabsRef.current[0] = el;
        }}
        className={`relative z-10 flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          filters.length === 0
            ? 'bg-white text-zinc-900 dark:bg-zinc-700 dark:text-white'
            : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
        } `}
        onClick={() => setFilters([])}
      >
        All
      </button>

      {FILTER_OPTIONS.map(({ value, label }, index) => (
        <button
          key={value}
          ref={(el) => {
            tabsRef.current[index + 1] = el;
          }}
          className={`relative z-10 flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            filters.includes(value)
              ? 'bg-white text-zinc-900 dark:bg-zinc-700 dark:text-white'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          } `}
          onClick={() => toggleFilter(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
