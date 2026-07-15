const processed = new Set();

export function isProcessed(messageId) {
  return processed.has(messageId);
}

export function markProcessed(messageId) {
  processed.add(messageId);

  setTimeout(() => {
    processed.delete(messageId);
  }, 5 * 60 * 1000); // 5 minutes
}
