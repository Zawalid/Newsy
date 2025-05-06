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

  // Clean up escaped quotes in names
  name = name.replace(/\\"/g, '');

  // Remove surrounding quotes if they exist
  if (name.startsWith('"') && name.endsWith('"')) {
    name = name.substring(1, name.length - 1);
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

export const isNewsletter = (email: EmailMetadata): boolean => {
  const { fromRaw, subject, unsubscribeUrl, listId, from } = email;
  const address = from?.address?.toLowerCase(); // Ensure address exists and is lowercase

  // --- 1. DEFINITIVE SIGNALS ---
  if (unsubscribeUrl || listId) return true;
  if (!address || !subject) return false;

  // --- 2. EXCLUSIONS --- common transactional/support/security emails based on sender address.
  const excludedDomainsOrPatterns = [
    '@google.com',
    '.google.com',
    '@apple.com',
    '.apple.com',
    '@microsoft.com',
    '.microsoft.com',
    '@github.com',
    '@amazon.com',
    '@facebook.com',
    '@linkedin.com',
    'support.',
    'service.',
    'help.',
    'noreply.',
    'no-reply.',
    'donotreply.',
    'account.',
    'accounts.',
    'security.',
    'verification.',
    'alert.',
    'billing.',
    'payment.',
  ];

  const addressAfterAt = address.substring(address.indexOf('@') + 1);

  for (const pattern of excludedDomainsOrPatterns) {
    if (pattern.startsWith('@') || pattern.startsWith('.')) {
      if (address.endsWith(pattern)) {
        if (fromRaw && /newsletter|digest|weekly|monthly/i.test(fromRaw)) return true;
        return false;
      }
    } else {
      if (addressAfterAt.startsWith(pattern)) {
        if (fromRaw && /newsletter|digest|weekly|monthly/i.test(fromRaw)) return true;
        return false;
      }
    }
  }

  // --- 3. REPLY/FORWARD FILTERING ---
  if (/^(re:|fw:|fwd:)/i.test(subject)) return false;

  // --- 4. STRONG NEWSLETTER SIGNALS ---
  const strongSignalKeywords = /newsletter|digest|weekly|monthly|bulletin|roundup|briefing|edition/i;
  if ((fromRaw && strongSignalKeywords.test(fromRaw)) || (subject && strongSignalKeywords.test(subject))) {
    return true;
  }

  // --- 5. MODERATE SIGNALS WITH CONFIRMATION ---
  // Keywords often used by newsletters but ALSO by transactional emails.
  const moderateSignalKeywords = /update|alert|notification|report|insights|tips/i;
  if ((fromRaw && moderateSignalKeywords.test(fromRaw)) || (subject && moderateSignalKeywords.test(subject))) {
    const confirmationPatterns = [
      /\[\s*issue\s*#?\d+\s*\]/i, // [Issue #123]
      /vol\.\s*\d+/i, // Vol. 45
      /no\.\s*\d+/i, // No. 10
      /\d{1,2}\/\d{1,2}\/\d{2,4}/, // Date like M/D/YY or MM/DD/YYYY
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b\s+\d{1,2}/i, // Month Day
      /daily\supdate|weekly\sroundup|monthly\sreview|daily\sdigest/i, // Common phrases
      /issue\s+\d+/i, // issue 15
      /day\s+\d+/i, // day 7 (e.g., of a course)
    ];
    if (subject && confirmationPatterns.some((pattern) => pattern.test(subject))) return true;
  }

  // --- 6. DOMAIN HEURISTICS (Lower Confidence) ---
  const newsletterDomainPatterns = [
    'news.',
    'email.',
    'mail.',
    'mailer.',
    'enews.',
    'e-news.',
    'letter.',
    'updates.',
    'notification.',
    'info.',
    'marketing.',
    'explore.',
    'discover.',
    'community.',
    'go.',
    'reply.', // Sometimes used for marketing sends
  ];

  if (newsletterDomainPatterns.some((pattern) => addressAfterAt.startsWith(pattern))) {
    return true;
  }

  return false;
};
