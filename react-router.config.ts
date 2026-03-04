import type { Config } from '@react-router/dev/config'
import { fetchBadgeGroups } from './src/data/api'

export default {
  // SSG mode - pre-render all routes at build time
  ssr: false,
  async prerender() {
    try {
      const groups = await fetchBadgeGroups()
      const groupPaths = groups.map((g: { slug: string }) => `/${g.slug}`)
      const badgePaths = groups.flatMap((g: { spec: { badges: Array<{ slug: string }> } }) =>
        g.spec.badges.map((b: { slug: string }) => `/sprawnosc/${b.slug}`)
      )
      return ['/', '/o-sprawnosciach', ...groupPaths, ...badgePaths]
    } catch (error) {
      // Log error but allow build to continue
      console.warn('Failed to fetch routes for prerender, falling back to static routes:', error instanceof Error ? error.message : error)
      // Fallback to basic routes - app will fetch data client-side
      return ['/', '/o-sprawnosciach']
    }
  },
} satisfies Config
