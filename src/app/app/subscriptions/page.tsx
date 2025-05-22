'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';

import { EmptyState } from './_components/empty-state';
import { LoadingState } from './_components/loading-state';
import { ErrorState } from './_components/error-state';
import { SubscriptionsToolbar } from './_components/subscriptions-toolbar';
import { SubscriptionsGridView } from './_components/subscriptions-grid-view';
import { SubscriptionsListView } from './_components/subscriptions-list-view';
import { SelectionActions } from './_components/selection-actions';
import { UnsubscribeDialog } from './_components/unsubscribe-dialog';
import { PageHeader } from './_components/page-header';
import { FilteredEmptyState } from './_components/filtered-empty-state';
import { TagManagementDialog } from './_components/tag-management-dialog';

import { useSubscriptions } from './_hooks/use-subscriptions';

export default function SubscriptionsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<UserSubscriptionWithNewsletter[]>([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [unsubscribeDialogOpen, setUnsubscribeDialogOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscriptionWithNewsletter | null>(null);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [editingTags, setEditingTags] = useState<string[]>([]);

  const { subscriptions, isLoading, error } = useSubscriptions();

  useEffect(() => {
    if (!subscriptions.length) return;

    let result = [...subscriptions];

    const statusMap = {
      active: 'ACTIVE',
      unsubscribed: 'UNSUBSCRIBED_BY_USER',
      ignored: 'IGNORED_BY_USER',
    };

    if (statusFilter !== 'all') {
      const targetStatus = statusMap[statusFilter as keyof typeof statusMap];
      if (targetStatus) {
        result = result.filter((sub) => sub.status === targetStatus);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (sub) =>
          sub.newsletter.name.toLowerCase().includes(query) ||
          sub.newsletter.address.toLowerCase().includes(query) ||
          (sub.customNameForUser && sub.customNameForUser.toLowerCase().includes(query)) ||
          (sub.userTags && sub.userTags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    const getSortValue = (sub: UserSubscriptionWithNewsletter) => sub.customNameForUser || sub.newsletter.name;

    result = result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return getSortValue(a).localeCompare(getSortValue(b));
        case 'name-desc':
          return getSortValue(b).localeCompare(getSortValue(a));
        case 'date-added-newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'date-added-oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return 0;
        // case 'last-email-newest':
        // case 'last-email-oldest':
        //   if (!a.lastEmailReceivedAt) return 1;
        //   if (!b.lastEmailReceivedAt) return -1;
        //   const comparison = a.lastEmailReceivedAt.getTime() - b.lastEmailReceivedAt.getTime();
        //   return sortBy === 'last-email-newest' ? -comparison : comparison;
      }
    });

    setFilteredSubscriptions(result);
  }, [subscriptions, statusFilter, searchQuery, sortBy]);

  const handleConfirmUnsubscribe = (bulk: boolean) => {
    setUnsubscribeDialogOpen(false);
    if (bulk) {
      toast.success('Bulk Unsubscribe', {
        description: `Unsubscribed from ${selectedSubscriptions.length} newsletters`,
      });
      setSelectedSubscriptions([]);
    } else {
      if (!currentSubscription) return;
      toast.success('Unsubscribed', {
        description: `You've been unsubscribed from ${currentSubscription.newsletter.name}`,
      });
      setCurrentSubscription(null);
    }
  };

  const toggleFavorite = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (sub) {
      const actionText = sub.isFavorite ? 'removed from' : 'added to';
      toast.success(`${sub.isFavorite ? 'Removed from' : 'Added to'} favorites`, {
        description: `${sub.newsletter.name} ${actionText} favorites`,
      });
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedSubscriptions((prev) => (prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]));
  };

  const toggleAllSelections = () => {
    setSelectedSubscriptions(
      selectedSubscriptions.length === filteredSubscriptions.length ? [] : filteredSubscriptions.map((sub) => sub.id)
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleOpenTagDialog = (subscription: UserSubscriptionWithNewsletter) => {
    if (!subscription) return;
    setCurrentSubscription(subscription);
    setEditingTags(subscription.userTags || []);
    setTagDialogOpen(true);
  };

  const handleUpdateTags = (
    subscriptionId: string
    //  newTags: string[]
  ) => {
    toast.success('Tags updated', {
      description: `Tags have been updated for ${subscriptions.find((s) => s.id === subscriptionId)?.newsletter.name}`,
    });
  };

  const toolbarProps = {
    totalCount: subscriptions.length,
    filteredCount: filteredSubscriptions.length,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (subscriptions.length === 0) return <EmptyState />;

  const viewProps = {
    subscriptions: filteredSubscriptions,
    selectedSubscriptions,
    toggleSelection,
    toggleFavorite,
    handleUnsubscribe: (subscription: UserSubscriptionWithNewsletter) => {
      setCurrentSubscription(subscription);
      setUnsubscribeDialogOpen(true);
    },
    handleOpenTagDialog,
  };

  if (filteredSubscriptions.length === 0) {
    return (
      <div className='container mx-auto max-w-7xl px-4 py-6'>
        <PageHeader />
        <SubscriptionsToolbar {...toolbarProps} />
        <FilteredEmptyState onClearFilters={clearFilters} />
      </div>
    );
  }

  return (
    <div className='max-h-[calc(100vh-60px)] px-4 py-6 pb-20'>
      <PageHeader />
      <SubscriptionsToolbar {...toolbarProps} />

      <AnimatePresence mode='wait'>
        {viewMode === 'grid' ? (
          <SubscriptionsGridView {...viewProps} />
        ) : (
          <SubscriptionsListView {...viewProps} toggleAllSelections={toggleAllSelections} />
        )}
      </AnimatePresence>

      <SelectionActions
        selectedCount={selectedSubscriptions.length}
        onUnsubscribe={() => setUnsubscribeDialogOpen(true)}
        onClearSelection={() => setSelectedSubscriptions([])}
      />

      <UnsubscribeDialog
        open={unsubscribeDialogOpen}
        onOpenChange={setUnsubscribeDialogOpen}
        subscription={currentSubscription}
        onConfirm={() => {
          if (currentSubscription) handleConfirmUnsubscribe(false);
          if (selectedSubscriptions.length > 0) handleConfirmUnsubscribe(true);
        }}
        selectedCount={selectedSubscriptions.length}
      />

      <TagManagementDialog
        open={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        subscription={currentSubscription}
        onUpdateTags={handleUpdateTags}
        userTags={editingTags}
        setUserTags={setEditingTags}
      />
    </div>
  );
}
