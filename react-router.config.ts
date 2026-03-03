import type { Config } from '@react-router/dev/config'
import { fetchBadgeGroups } from './src/data/api'

export default {
  ssr: true,
  async prerender() {
    const groups = await fetchBadgeGroups()
    const groupPaths = groups.map((g: { slug: string }) => `/${g.slug}`)
    const badgePaths = groups.flatMap((g: { spec: { badges: Array<{ slug: string }> } }) =>
      g.spec.badges.map((b: { slug: string }) => `/sprawnosc/${b.slug}`)
    )
    return ['/', ...groupPaths, ...badgePaths]
  },
} satisfies Config
