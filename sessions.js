const sessions = {};

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export function getSession(phone) {
  const now = Date.now();

  if (
    !sessions[phone] ||
    now - sessions[phone].lastActivity > SESSION_TIMEOUT
  ) {
    sessions[phone] = {
      lastActivity: now,
    };
  } else {
    sessions[phone].lastActivity = now;
  }

  return sessions[phone];
}

export function clearSession(phone) {
  delete sessions[phone];
}
