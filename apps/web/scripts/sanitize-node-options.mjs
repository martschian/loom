/** @param {string | undefined} raw */
export function sanitizeNodeOptions(raw) {
  if (!raw) return undefined
  const sanitized = raw
    .split(/\s+/)
    .filter((flag) => !/--no?-(experimental-)?webstorage/.test(flag))
    .join(' ')
    .trim()
  return sanitized || undefined
}

/** @param {NodeJS.ProcessEnv} env */
export function applySanitizedNodeOptions(env) {
  const next = { ...env }
  const sanitized = sanitizeNodeOptions(next.NODE_OPTIONS)
  if (!next.NODE_OPTIONS) return next
  if (sanitized === next.NODE_OPTIONS) return next
  if (sanitized) next.NODE_OPTIONS = sanitized
  else delete next.NODE_OPTIONS
  return next
}
