import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'

export default function SectionTabs({ sections, activeId, onSelect }) {
  const { lang } = useLangContext()
  const t = translations[lang]
  const getTitle = (section) => t.sectionTitles[section.id] ?? section.title

  return (
    <nav className="section-tabs" aria-label={t.menuSectionsAria}>
      <div className="section-tabs__list">
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
    </nav>
  )
}
