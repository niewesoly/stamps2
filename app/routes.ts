import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('o-sprawnosciach', 'routes/about.tsx'),
  route(':groupSlug', 'routes/group.tsx'),
  route('sprawnosc/:badgeSlug', 'routes/badge.tsx'),
] satisfies RouteConfig
