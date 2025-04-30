// import { TECH_KEYWORDS, NEWS_LETTERS_DOMAINS } from "./values";

// const NEWSLETTER_HEADERS = [
//   "list-id",
//   "list-unsubscribe",
//   "precedence",
//   "x-mailing-list",
//   "x-newsletter",
//   "x-campaign",
//   "x-campaign-id",
//   "x-report-abuse",
// ];

// function extractDomain(email: string): string | null {
//   const match = email.match(/@([a-zA-Z0-9.-]+)$/);
//   return match ? match[1].toLowerCase() : null;
// }

// export const isNewsletter = async (email: Email): Promise<boolean> => {
//   const body = email.body.text?.toLowerCase() || "";
//   const subject = email.subject?.toLowerCase() || "";

//   const keywordRegex = new RegExp(
//     TECH_KEYWORDS.map((k) => `\\b${k.toLowerCase()}\\b`).join("|"),
//     "i",
//   );
//   const hasKeyWord = keywordRegex.test(body) || keywordRegex.test(subject);

//   const hasHeaders = checkHeaders(email.headers);

//   const senderDomain = email.from?.address
//     ? extractDomain(email.from.address)
//     : null;
//   const fromNewsletter = senderDomain
//     ? NEWS_LETTERS_DOMAINS.some(({ domain }) => senderDomain.endsWith(domain))
//     : false;

//   return hasKeyWord || hasHeaders || fromNewsletter;
// };

// // Generate a Gmail search query that applies the same filters
// export const getNewsletterQuery = (query: string): string => {
//   const domainFilter = NEWS_LETTERS_DOMAINS.map(
//     ({ domain }) => `from:*@${domain}`,
//   ).join(" OR ");
//   const keywordFilter = `subject:${TECH_KEYWORDS.map((k) => `"${k}"`).join(" OR ")}`;
//   const headersFilter = NEWSLETTER_HEADERS.join(" OR ");

//   const queryParts = [
//     query,
//     // headersFilter,
//     // domainFilter, // Match known newsletter domains
//     // keywordFilter, // Match keywords in subject3
//   ];

//   return queryParts.join(" ");
// };
