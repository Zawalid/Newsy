'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface HoverEffectProps<T extends React.ElementType = 'div'> {
  as?: T;
  children: React.ReactNode;
  className?: string;
  alwaysActive?: boolean;
  disableTranslate?: boolean;
}

export function HoverEffect<T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  alwaysActive = false,
  disableTranslate = false,
  ...props
}: HoverEffectProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof HoverEffectProps<T>>) {
  const Component = as || 'div';

  return (
    <Component
      className={cn(
        'group/hover relative overflow-hidden rounded-xl transition-all duration-300',
        !disableTranslate && 'will-change-transform hover:-translate-y-0.5',
        'hover:shadow-md',
        alwaysActive && 'shadow-md',
        !disableTranslate && alwaysActive && '-translate-y-0.5',
        className
      )}
      {...props}
    >
      {/* Rest of your component remains the same */}
      <div
        className={cn(
          'absolute inset-0 -z-10 transition-opacity duration-300',
          alwaysActive ? 'opacity-100' : 'opacity-0 group-hover/hover:opacity-100'
        )}
      >
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:4px_4px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)]' />
      </div>

      <div
        className={cn(
          'absolute inset-0 -z-10  bg-gradient-to-br from-transparent via-gray-300/80 to-transparent p-px transition-opacity duration-300 dark:via-white/10',
          alwaysActive ? 'opacity-100' : 'opacity-0 group-hover/hover:opacity-100'
        )}
      />

      {/* <div className='relative z-10'>{children}</div> */}
      {children}
    </Component>
  );
}
