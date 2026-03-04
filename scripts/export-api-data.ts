/**
 * Script to fetch badge data from API and export to JSON file.
 * This file is used during CI/CD build when API is not accessible.
 *
 * Run: npx tsx scripts/export-api-data.ts
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const API_URL = 'https://stamps.zhr.pl/api/badges'
const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_FILE = join(__dirname, '..', 'src', 'data', 'badges-data.json')

interface ApiResponse {
  badges: any[]
  categories: any[]
}

/**
 * Clean badge data to fix API inconsistencies
 */
function cleanBadgeData(data: ApiResponse): ApiResponse {
  const cleaned = JSON.parse(JSON.stringify(data)) as ApiResponse

  // Clean badges
  for (const group of cleaned.badges) {
    if (group.spec && Array.isArray(group.spec.badges)) {
      for (const badge of group.spec.badges) {
        // Remove rawBasedOn if exists
        if (badge.rawBasedOn) {
          delete badge.rawBasedOn
        }

        // Fix basedOn: flatten [[]] to []
        if (Array.isArray(badge.basedOn)) {
          badge.basedOn = badge.basedOn.flat().filter(id => id !== badge.id)
        }
      }
    }
  }

  return cleaned
}

async function fetchAndExportData() {
  console.log('Fetching data from API...')

  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json() as ApiResponse

    // Validate response
    if (!Array.isArray(data.badges) || !Array.isArray(data.categories)) {
      throw new Error('Invalid API response structure')
    }

    // Clean the data
    const cleanedData = cleanBadgeData(data)

    // Ensure output directory exists
    const outputDir = dirname(OUTPUT_FILE)
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // Write data to JSON file
    writeFileSync(OUTPUT_FILE, JSON.stringify(cleanedData, null, 2), 'utf-8')

    console.log(`Successfully exported ${cleanedData.badges.length} badges and ${cleanedData.categories.length} categories`)
    console.log(`Output file: ${OUTPUT_FILE}`)

  } catch (error) {
    console.error('Failed to fetch API data:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

fetchAndExportData()
