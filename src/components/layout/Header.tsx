import { useState } from 'react'
import type { BadgeGroup } from '@/data/types'
import TopBar from './TopBar'
import MobileTabBar from './MobileTabBar'
import MobileSearchOverlay from './MobileSearchOverlay'

interface HeaderProps {
  groups: BadgeGroup[]
}

export default function Header({ groups }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <TopBar groups={groups} onSearchClick={() => setSearchOpen(true)} />
      <MobileTabBar searchOpen={searchOpen} onSearchClick={() => setSearchOpen(true)} />

      {/* ───── Mobile Full-Screen Search Overlay ───── */}
      {searchOpen && (
        <MobileSearchOverlay
          groups={groups}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  )
}
