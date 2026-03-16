import { useState, useEffect } from 'react'
import { SECTION_SLUG_TO_ID, SECTION_ID_TO_SLUG } from '../constants'

export function useActiveSection(sections) {
  const [activeSectionId, setActiveSectionId] = useState('')

  useEffect(() => {
    if (sections.length === 0) return
    if (activeSectionId) return
    const hash = window.location.hash.slice(1)
    const idFromSlug = SECTION_SLUG_TO_ID[hash]
    const idFromHash = sections.find((s) => s.id === hash)?.id
    const resolvedId = idFromSlug && sections.some((s) => s.id === idFromSlug)
      ? idFromSlug
      : idFromHash ?? sections[0].id
    setActiveSectionId(resolvedId)
  }, [sections, activeSectionId])

  useEffect(() => {
    if (activeSectionId) {
      const slug = SECTION_ID_TO_SLUG[activeSectionId] ?? activeSectionId
      window.location.hash = slug
    }
  }, [activeSectionId])

  return [activeSectionId, setActiveSectionId]
}
