'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectionActionsProps {
  selectedCount: number;
  onUnsubscribe: () => void;
  onClearSelection: () => void;
}

export function SelectionActions({ selectedCount, onUnsubscribe, onClearSelection }: SelectionActionsProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className='bg-background text-primary-foreground fixed bottom-4 left-1/2 z-50 flex w-[90%] max-w-2xl -translate-x-1/2 transform items-center justify-between rounded-md border px-4 py-2 shadow-lg'
        >
          <div className='flex items-center'>
            <span>{selectedCount} selected</span>
          </div>
          <div className='flex gap-2'>
            <Button variant='destructive' size='sm' onClick={onUnsubscribe}>
              <Trash2 className='mr-2 h-4 w-4' />
              Unsubscribe Selected
            </Button>
            <Button variant='secondary' size='sm' onClick={onClearSelection}>
              <X className='mr-2 h-4 w-4' />
              Clear Selection
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
