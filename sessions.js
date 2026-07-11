const sessions = {};

export function getSession(phone) {
  if (!sessions[phone]) {
    sessions[phone] = {};
  }

  return sessions[phone];
}

export function clearSession(phone) {
  delete sessions[phone];
}

