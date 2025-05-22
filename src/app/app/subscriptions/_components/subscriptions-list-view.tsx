import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { SubscriptionListItem } from './subscription-list-item';

interface SubscriptionsListViewProps {
  subscriptions: UserSubscriptionWithNewsletter[];
  selectedSubscriptions: string[];
  toggleSelection: (id: string) => void;
  toggleAllSelections: () => void;
  toggleFavorite: (id: string) => void;
  handleUnsubscribe: (subscription: UserSubscriptionWithNewsletter) => void;
  handleOpenTagDialog: (subscription: UserSubscriptionWithNewsletter) => void;
}

export function SubscriptionsListView({
  subscriptions,
  selectedSubscriptions,
  toggleSelection,
  toggleAllSelections,
  toggleFavorite,
  handleUnsubscribe,
  handleOpenTagDialog,
}: SubscriptionsListViewProps) {
  return (
    <motion.div
      className='overflow-hidden rounded-md border'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <table className='w-full'>
        <thead>
          <tr className='bg-muted/50 border-b'>
            <th className='p-2 text-left'>
              <Checkbox
              className='rounded-xs'
                checked={selectedSubscriptions.length === subscriptions.length}
                onCheckedChange={toggleAllSelections}
              />
            </th>
            <th className='p-2 text-left text-sm font-medium'>Newsletter</th>
            <th className='hidden p-2 text-left text-sm font-medium md:table-cell'>Email Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {subscriptions.map((subscription) => (
              <SubscriptionListItem
                key={subscription.id}
                subscription={subscription}
                isSelected={selectedSubscriptions.includes(subscription.id)}
                onToggleSelection={toggleSelection}
                onToggleFavorite={toggleFavorite}
                onUnsubscribe={handleUnsubscribe}
                onOpenTagDialog={handleOpenTagDialog}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
}
