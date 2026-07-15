export function isValidName(name) {
  return /^[A-Za-z ]{2,50}$/.test(name.trim());
}

export function isValidAge(age) {
  const value = Number(age);
  return Number.isInteger(value) && value >= 1 && value <= 120;
}
