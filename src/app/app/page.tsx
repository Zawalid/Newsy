'use client';

import { NewsletterScanner } from '@/components/newsletter-scanner';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  // Handle when scanning completes
  const handleScanComplete = (results: Newsletter[]) => {
    setNewsletters(results);
  };

  return (
    <div className='container mx-auto space-y-6 py-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Newsletter Manager</h1>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-3'>
          <NewsletterScanner onComplete={handleScanComplete} maxResults={100} useCache={true} incrementalScan={true} />
        </div>

        {newsletters.length > 0 && (
          <div className='md:col-span-3'>
            <Card className='p-6'>
              <h2 className='mb-4 text-xl font-semibold'>All Newsletters ({newsletters.length})</h2>
              <div className='grid gap-4 md:grid-cols-3'>
                {newsletters.map((newsletter) => (
                  <Card key={newsletter.id} className='flex flex-col justify-between p-4'>
                    <div>
                      <h3 className='truncate font-medium' title={newsletter.name}>
                        {newsletter.name}
                      </h3>
                      <p className='text-muted-foreground truncate text-sm' title={newsletter.email}>
                        {newsletter.email}
                      </p>
                    </div>
                    <div className='mt-4 flex justify-end'>
                      {newsletter.unsubscribeUrl && (
                        <a
                          href={newsletter.unsubscribeUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary text-sm hover:underline'
                        >
                          Unsubscribe
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
