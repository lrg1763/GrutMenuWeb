import { useState, useEffect } from 'react'

export function useActiveSection(sections) {
  const [activeSectionId, setActiveSectionId] = useState('')

  useEffect(() => {
    if (sections.length === 0) return
    if (activeSectionId) return
    const hash = window.location.hash.slice(1)
    const fromHash = sections.find((s) => s.id === hash)
    setActiveSectionId(fromHash ? hash : sections[0].id)
  }, [sections, activeSectionId])

  useEffect(() => {
    if (activeSectionId) {
      window.location.hash = activeSectionId
    }
  }, [activeSectionId])

  return [activeSectionId, setActiveSectionId]
}
