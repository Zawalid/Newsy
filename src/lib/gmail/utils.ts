export const extractAddressInfo = (from: string): AddressBody => {
  // Common patterns: "Name <address@domain.com>" or "address@domain.com (Name)"
  const anglePattern = /^([^<]+)<([^>]+)>$/;
  const parenPattern = /^([^(]+)\s*\(([^)]+)\)$/;

  let name = '';
  let address = '';

  if (anglePattern.test(from)) {
    const match = from.match(anglePattern);
    if (match) {
      name = match[1].trim();
      address = match[2].trim();
    }
  } else if (parenPattern.test(from)) {
    const match = from.match(parenPattern);
    if (match) {
      address = match[1].trim();
      name = match[2].trim();
    }
  } else if (from.includes('@')) {
    // If there's just an address
    address = from.trim();
    // Use domain as name if no better name is available
    name = address.split('@')[0];
  } else {
    return { name: '', address: '' };
  }

  return { name, address };
};

export const getStatusFromLabels = (labels: string[]) => {
  const isRead = !labels.includes('UNREAD');
  const isStarred = labels.includes('STARRED');
  const isImportant = labels.includes('IMPORTANT');

  return { isRead, isStarred, isImportant };
};

export const formatEmailText = (text: string) => {
  const cleaned = text.replace(/(\r?\n){3,}/g, '\n\n');
  const linked = cleaned.replace(
    /(https?:\/\/[^\s]+)/g,
    (url: string) =>
      `<a href="${url}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${url}</a>`
  );

  return linked.replace(/(\s*https?:\/\/[^\s]+)/g, '\n$1\n');
};

export const getFaviconFromEmail = (emailAddress: string): string | null => {
  const match = emailAddress.match(/@([^@]+)$/);
  const domain = match ? match[1] : null;

  if (!domain) return null;

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};
