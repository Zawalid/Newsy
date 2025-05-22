import { motion, AnimatePresence } from 'framer-motion';
import { SubscriptionCard } from './subscription-card';

interface SubscriptionsGridViewProps {
  subscriptions: UserSubscriptionWithNewsletter[];
  selectedSubscriptions: string[];
  toggleSelection: (id: string) => void;
  toggleFavorite: (id: string) => void;
  handleUnsubscribe: (subscription: UserSubscriptionWithNewsletter) => void;
  handleOpenTagDialog: (subscription: UserSubscriptionWithNewsletter) => void;
}

export function SubscriptionsGridView({
  subscriptions,
  selectedSubscriptions,
  toggleSelection,
  toggleFavorite,
  handleUnsubscribe,
  handleOpenTagDialog,
}: SubscriptionsGridViewProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence initial={false}>
        {subscriptions.map((subscription) => (
          <motion.div
            key={subscription.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <SubscriptionCard
              subscription={subscription}
              isSelected={selectedSubscriptions.includes(subscription.id)}
              onToggleSelection={toggleSelection}
              onToggleFavorite={toggleFavorite}
              onUnsubscribe={handleUnsubscribe}
              onOpenTagDialog={handleOpenTagDialog}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}