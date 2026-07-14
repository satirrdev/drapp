import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, '..', 'public')
const DATA_DIR = join(PUBLIC, 'data')
const REPO_URL = 'https://f-droid.org/repo'
const PER_PAGE = 20

function getLocalizedValue(entry, field) {
  if (!entry) return null
  if (entry[field]) return entry[field]
  const loc = entry.localized
  if (!loc) return null
  if (loc['en-US'] && loc['en-US'][field]) return loc['en-US'][field]
  for (const key of Object.keys(loc)) {
    if (loc[key][field]) return loc[key][field]
  }
  return null
}

function getLocalizedIconUrl(entry) {
  if (!entry) return null
  const loc = entry.localized
  if (!loc) return null
  const iconFile =
    (loc['en-US'] && loc['en-US'].icon) ||
    (() => { for (const k of Object.keys(loc)) if (loc[k].icon) return loc[k].icon; return null })()
  if (!iconFile) return null
  return `${REPO_URL}/${entry.packageName}/en-US/${iconFile}`
}

function getDirectIconUrl(entry) {
  if (!entry || !entry.icon) return null
  return `${REPO_URL}/icons/${entry.icon}`
}

function sanitizeId(id) {
  return id.replace(/\//g, '_')
}

async function main() {
  let raw

  try {
    console.log('Downloading F-Droid index...')
    const res = await fetch('https://f-droid.org/repo/index-v1.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    raw = await res.json()
    console.log('Downloaded successfully')
  } catch (err) {
    console.warn(`Download failed: ${err.message}`)
    const fallbackFile = join(PUBLIC, 'apps-fallback.json')
    if (existsSync(fallbackFile)) {
      console.log('Using fallback data...')
      raw = JSON.parse(readFileSync(fallbackFile, 'utf-8'))
    } else {
      console.error('No fallback available.')
      process.exit(1)
    }
  }

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

  const appsMap = {}
  for (const entry of raw.apps || []) {
    if (entry.packageName) appsMap[entry.packageName] = entry
  }

  const allCardData = []
  const searchIndex = []

  for (const [pkgName, versions] of Object.entries(raw.packages || {})) {
    if (!versions || versions.length === 0) continue
    const latest = versions[versions.length - 1]
    if (!latest) continue

    const meta = appsMap[pkgName]
    const name = getLocalizedValue(meta, 'name') || latest.name || pkgName
    const summary = getLocalizedValue(meta, 'summary') || latest.summary || ''
    const localizedIcon = getLocalizedIconUrl(meta)
    const directIcon = getDirectIconUrl(meta)
    const iconUrl = localizedIcon || directIcon
    const desc = getLocalizedValue(meta, 'description') || ''

    allCardData.push({
      id: pkgName,
      n: name,
      s: summary,
      i: iconUrl,
      v: latest.versionName || '',
      c: meta?.categories || [],
    })

    searchIndex.push({ id: pkgName, n: name, c: meta?.categories || [] })

    const appData = {
      n: name,
      s: summary,
      i: iconUrl,
      v: latest.versionName || '',
      c: meta?.categories || [],
      d: desc,
      src: meta?.sourceCode || null,
      lic: meta?.license || null,
      web: meta?.webSite || null,
      up: meta?.lastUpdated || null,
      vc: latest.versionCode || '',
    }

    const safeId = sanitizeId(pkgName)
    writeFileSync(join(DATA_DIR, `${safeId}.json`), JSON.stringify(appData), 'utf-8')
  }

  // Write page files (20 apps each)
  const totalPages = Math.ceil(allCardData.length / PER_PAGE)
  for (let i = 0; i < totalPages; i++) {
    const start = i * PER_PAGE
    const pageData = allCardData.slice(start, start + PER_PAGE)
    writeFileSync(join(PUBLIC, `page_${i}.json`), JSON.stringify(pageData), 'utf-8')
  }

  // Write search index
  writeFileSync(join(PUBLIC, 'search_index.json'), JSON.stringify(searchIndex), 'utf-8')

  const idxSize = (Buffer.byteLength(JSON.stringify(searchIndex)) / 1024).toFixed(0)
  console.log(`search_index.json: ${searchIndex.length} apps (${idxSize}KB)`)
  console.log(`page_0.json to page_${totalPages - 1}.json: ${totalPages} pages, ${PER_PAGE} per page`)
  console.log(`data/: ${allCardData.length} individual files`)

  if (!existsSync(join(PUBLIC, 'apps-fallback.json'))) {
    writeFileSync(join(PUBLIC, 'apps-fallback.json'), JSON.stringify(raw), 'utf-8')
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
