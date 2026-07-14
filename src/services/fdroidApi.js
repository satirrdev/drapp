const BASE = import.meta.env.BASE_URL || '/'

const CACHE_PAGE_PREFIX = 'fdroid_page_'
const CACHE_SEARCH_KEY = 'fdroid_search'
const CACHE_DATA_PREFIX = 'fdroid_data_'

let cachedSearchIndex = null
const cachedPages = {}
const cachedData = {}

async function fetchJson(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  return res.json()
}

function saveLS(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

function loadLS(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export async function fetchPage(pageNum) {
  const cacheKey = CACHE_PAGE_PREFIX + pageNum
  if (cachedPages[pageNum]) return cachedPages[pageNum]
  const cached = loadLS(cacheKey)
  if (cached) { cachedPages[pageNum] = cached; return cached }
  const data = await fetchJson(`${BASE}page_${pageNum}.json`)
  saveLS(cacheKey, data)
  cachedPages[pageNum] = data
  return data
}

export async function fetchSearchIndex() {
  if (cachedSearchIndex) return cachedSearchIndex
  const cached = loadLS(CACHE_SEARCH_KEY)
  if (cached) { cachedSearchIndex = cached; return cached }
  const data = await fetchJson(`${BASE}search_index.json`)
  saveLS(CACHE_SEARCH_KEY, data)
  cachedSearchIndex = data
  return data
}

export async function fetchAppData(appId) {
  if (cachedData[appId]) return cachedData[appId]
  const cacheKey = CACHE_DATA_PREFIX + appId
  const cached = loadLS(cacheKey)
  if (cached) { cachedData[appId] = cached; return cached }
  const safeId = appId.replace(/\//g, '_')
  const data = await fetchJson(`${BASE}data/${safeId}.json`)
  saveLS(cacheKey, data)
  cachedData[appId] = data
  return data
}

export function getCategories(index) {
  const cats = new Set()
  for (const entry of index) {
    for (const c of (entry.c || [])) cats.add(c)
  }
  return [...cats].sort()
}

export function searchIndex(index, { query, category }) {
  let filtered = index
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter((a) => a.n.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
  }
  if (category) {
    filtered = filtered.filter((a) => (a.c || []).includes(category))
  }
  return filtered
}
