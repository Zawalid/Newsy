import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useDebounce } from '@/hooks/use-debounce';

export const useEmailsSearchAndFilters = () => {
  const [filters, setFilters] = useQueryState('filters', parseAsArrayOf(parseAsString).withDefault([]));
  const [q] = useQueryState('q', { defaultValue: '' });
  const [pageToken] = useQueryState('pageToken');

  const query = useDebounce(`${q}${filters.length > 0 ? filters.join(' OR ') : ''}`, 500);

  return {
    filters,
    setFilters,
    query,
    searchQuery: q,
    pageToken,
  };
};
