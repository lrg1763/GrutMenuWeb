import { useRef, useState, useEffect } from 'react'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

const SCROLL_STEP = 220

function updateScrollState(el, setCanScrollLeft, setCanScrollRight) {
  if (!el) return
  const { scrollLeft, scrollWidth, clientWidth } = el
  setCanScrollLeft(scrollLeft > 0)
  setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
}

export default function SectionTabs({ sections, activeId, onSelect }) {
  const { lang } = useLangContext()
  const t = translations[lang]
  const getTitle = (section) => t.sectionTitles[section.id] ?? section.title

  const listRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const update = () => updateScrollState(el, setCanScrollLeft, setCanScrollRight)
    update()
    const raf = requestAnimationFrame(update)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [sections])

  const handleScroll = () => {
    updateScrollState(listRef.current, setCanScrollLeft, setCanScrollRight)
  }

  const scroll = (delta) => {
    const el = listRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <nav className="section-tabs" aria-label={t.menuSectionsAria}>
      <div className="section-tabs__inner content-column">
        <div className="section-tabs__scroll-wrap">
          <button
            type="button"
            className="section-tabs__arrow section-tabs__arrow--left"
            aria-label={t.scrollSectionsLeft}
            disabled={!canScrollLeft}
            aria-disabled={!canScrollLeft}
            onClick={() => scroll(-SCROLL_STEP)}
          >
            <svg className="section-tabs__arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div
            ref={listRef}
            className="section-tabs__list"
            onScroll={handleScroll}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`section-tabs__btn ${section.id === activeId ? 'section-tabs__btn--active' : ''}`}
                onClick={() => onSelect(section.id)}
              >
                {getTitle(section)}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="section-tabs__arrow section-tabs__arrow--right"
            aria-label={t.scrollSectionsRight}
            disabled={!canScrollRight}
            aria-disabled={!canScrollRight}
            onClick={() => scroll(SCROLL_STEP)}
          >
            <svg className="section-tabs__arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
