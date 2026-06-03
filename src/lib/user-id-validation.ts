/**
 * BetKing User ID validation — shared by client (PredictionSection)
 * and server (predictions.functions.ts).
 *
 * Based on analysis of ~13,300 real BetKing User IDs:
 *  - digits only
 *  - length 6, 7, or 8
 *  - never starts with 0
 *
 * On top of those format rules we reject obvious junk / spam patterns
 * (all-same digit, sequential, only two distinct digits, long runs).
 *
 * HOW TO TWEAK:
 *  - To widen/narrow length, change MIN_LEN / MAX_LEN.
 *  - To loosen a spam rule, comment out the relevant `if` block in
 *    `validateBetkingUserId`.
 */

export const MIN_LEN = 6;
export const MAX_LEN = 8;

const ASC = "0123456789";
const DESC = "9876543210";

export function validateBetkingUserId(raw: string): { ok: true } | { ok: false; reason: string } {
  const id = raw.trim();

  if (!/^[0-9]+$/.test(id)) {
    return { ok: false, reason: "User ID must contain digits only." };
  }
  if (id.length < MIN_LEN || id.length > MAX_LEN) {
    return { ok: false, reason: `User ID must be between ${MIN_LEN} and ${MAX_LEN} digits.` };
  }
  if (id.startsWith("0")) {
    return { ok: false, reason: "User ID cannot start with 0." };
  }
  // All same digit: 111111, 22222222, etc.
  if (/^(\d)\1+$/.test(id)) {
    return { ok: false, reason: "User ID looks invalid (all identical digits)." };
  }
  // Strict ascending (123456, 12345678) or descending (87654321, 654321)
  if (ASC.includes(id) || DESC.includes(id)) {
    return { ok: false, reason: "User ID looks invalid (sequential digits)." };
  }
  // 5+ identical digits in a row anywhere (e.g. 1000005, 9999991)
  if (/(\d)\1{4,}/.test(id)) {
    return { ok: false, reason: "User ID looks invalid (too many repeated digits)." };
  }
  // Only two distinct digits in total (e.g. 121212, 1010101, 565656)
  if (new Set(id).size < 3) {
    return { ok: false, reason: "User ID looks invalid (not enough digit variety)." };
  }

  return { ok: true };
}

export function isValidBetkingUserId(raw: string): boolean {
  return validateBetkingUserId(raw).ok;
}
