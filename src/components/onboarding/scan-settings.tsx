'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Clock, FolderSearch, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DEFAULT_SCAN_SETTINGS } from '@/utils/constants';

interface ScanSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSettings: ScanSettings;
  onSaveSettings: (settings: ScanSettings) => void;
}

const SCAN_DEPTH_OPTIONS = [
  { value: 'quick', label: 'Quick Look', description: 'Recent ~1,000 emails. Fastest.', recommended: false },
  { value: 'standard', label: 'Standard Scan', description: 'Recent ~3,000 emails. Good balance.', recommended: true },
  { value: 'deep', label: 'Deep Dive', description: 'Recent ~5,000 emails. Most thorough.', recommended: false },
] as const;

const CATEGORY_OPTIONS: { id: keyof ScanSettings['categories']; label: string }[] = [
  { id: 'primary', label: 'Primary Inbox' },
  { id: 'promotions', label: 'Promotions Tab' },
  { id: 'social', label: 'Social Tab' },
  { id: 'updates', label: 'Updates Tab' },
  { id: 'forums', label: 'Forums Tab' },
];

export function ScanSettings({
  open,
  onOpenChange,
  currentSettings = DEFAULT_SCAN_SETTINGS,
  onSaveSettings,
}: ScanSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ScanSettings>(currentSettings);

  useEffect(() => {
    if (open) {
      setLocalSettings(currentSettings);
    }
  }, [currentSettings, open]);

  const handleSettingChange = useCallback(<K extends keyof ScanSettings>(key: K, value: ScanSettings[K]) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCategoryChange = useCallback((category: keyof ScanSettings['categories'], checked: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      categories: { ...prev.categories, [category]: checked },
    }));
  }, []);

  const handleCancel = useCallback(() => {
    setLocalSettings(currentSettings);
    onOpenChange(false);
  }, [currentSettings, onOpenChange]);

  const handleSaveChanges = useCallback(() => {
    onSaveSettings(localSettings);
    onOpenChange(false);
  }, [localSettings, onSaveSettings, onOpenChange]);

  const noCategoriesSelected = Object.values(localSettings.categories).every((val) => !val);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-[calc(100vw-2rem)] max-w-md flex-col sm:max-w-lg'>
        <SheetHeader className='border-b pb-4 dark:border-slate-800'>
          <SheetTitle className='text-xl font-semibold'>Scan Settings</SheetTitle>
          <SheetDescription>
            Customize how Newsy will scan your inbox. These settings will be used for your next scan.
          </SheetDescription>
        </SheetHeader>

        <div className='flex-grow space-y-6 overflow-y-auto px-0.5 pr-2'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Clock className='h-5 w-5 text-blue-600 dark:text-blue-400' />
              <Label className='text-base font-medium text-slate-900 dark:text-white'>Scan Depth</Label>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='h-4 w-4 cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' />
                  </TooltipTrigger>
                  <TooltipContent className='bg-secondary'>
                    <p className='max-w-[250px] text-xs'>
                      How many recent emails to check. Deeper scans are more thorough but take longer.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <RadioGroup
              value={localSettings.scanDepth}
              onValueChange={(value) => handleSettingChange('scanDepth', value as ScanSettings['scanDepth'])}
              className='space-y-2.5'
            >
              {SCAN_DEPTH_OPTIONS.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`scan-${option.value}`}
                  className={`flex cursor-pointer items-start space-x-3 rounded-md border p-3.5 transition-all hover:border-blue-400 dark:hover:border-blue-600 ${
                    localSettings.scanDepth === option.value
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 dark:border-blue-600 dark:bg-blue-900/20 dark:ring-blue-600'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={`scan-${option.value}`} className='mt-0.5' />
                  <div className='space-y-0.5'>
                    <span className='flex items-center text-sm font-medium'>
                      {option.label}
                      {option.recommended && (
                        <span className='ml-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-700 dark:text-blue-100'>
                          Recommended
                        </span>
                      )}
                    </span>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>{option.description}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Filter className='h-5 w-5 text-blue-600 dark:text-blue-400' />
              <Label className='text-base font-medium text-slate-900 dark:text-white'>Smart Filtering</Label>
            </div>
            <div className='flex items-center justify-between rounded-md border border-slate-200 p-3.5 dark:border-slate-700'>
              <div className='space-y-0.5 pr-4'>
                <Label htmlFor='smart-filtering' className='text-sm font-medium'>
                  Filter common notifications
                </Label>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  Helps focus on newsletters by skipping typical account alerts (e.g., from Google, Amazon).
                </p>
              </div>
              <Switch
                id='smart-filtering'
                checked={localSettings.smartFiltering}
                onCheckedChange={(checked) => handleSettingChange('smartFiltering', checked)}
              />
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <FolderSearch className='h-5 w-5 text-blue-600 dark:text-blue-400' />
              <Label className='text-base font-medium text-slate-900 dark:text-white'>Scan Gmail Categories</Label>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='h-4 w-4 cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' />
                  </TooltipTrigger>
                  <TooltipContent className='bg-secondary'>
                    <p className='max-w-[250px] text-xs'>
                      Choose which Gmail tabs to scan. Newsletters often appear in Primary and Promotions.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='space-y-2.5 rounded-md border border-slate-200 p-3.5 dark:border-slate-700'>
              {CATEGORY_OPTIONS.map(({ id, label }) => (
                <div className='flex items-center space-x-2.5' key={id}>
                  <Checkbox
                    id={`category-${id}`}
                    checked={localSettings.categories[id]}
                    onCheckedChange={(checked) => handleCategoryChange(id, Boolean(checked))}
                  />
                  <Label htmlFor={`category-${id}`} className='text-sm font-normal'>
                    {label}
                  </Label>
                </div>
              ))}
              {noCategoriesSelected && (
                <p className='pt-2 text-xs text-amber-700 dark:text-amber-400'>
                  No categories selected. Newsy will scan broadly (excluding Spam & Trash).
                </p>
              )}
            </div>
          </div>

          <div className='rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/30 dark:text-blue-300'>
            <p className='mb-1 font-semibold'>Your Privacy Matters</p>
            <p>
              Newsy only analyzes email metadata (sender, subject, dates) to identify newsletters and never reads or
              stores your email content.
            </p>
          </div>
        </div>

        <SheetFooter className='flex flex-col-reverse gap-2 border-t pt-6 sm:flex-row sm:justify-end dark:border-slate-800'>
          <Button variant='outline' onClick={handleCancel} className='w-full sm:w-auto'>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} effect='shineHover'>
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
