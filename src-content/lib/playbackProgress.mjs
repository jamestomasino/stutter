export function clampIndex(index, total) {
  if (!Number.isFinite(total) || total <= 0) return 0
  const maxIndex = total - 1
  const normalized = Number.isFinite(index) ? Math.trunc(index) : 0
  return Math.min(Math.max(normalized, 0), maxIndex)
}

export function normalizeProgress(progress) {
  const normalized = Number(progress)
  if (!Number.isFinite(normalized)) return 0
  return Math.min(Math.max(normalized, 0), 1)
}

export function progressToIndex(progress, total) {
  if (!Number.isFinite(total) || total <= 0) return 0
  const normalizedProgress = normalizeProgress(progress)
  const maxIndex = total - 1
  return clampIndex(Math.round(normalizedProgress * maxIndex), total)
}

export function indexToProgress(index, total) {
  if (!Number.isFinite(total) || total <= 0) return 0
  const maxIndex = total - 1
  if (maxIndex <= 0) return 0
  const normalizedIndex = clampIndex(index, total)
  return normalizedIndex / maxIndex
}
