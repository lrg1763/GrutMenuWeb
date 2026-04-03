import { useState } from 'react'
import { useMenuData } from '../hooks/useMenuData'
import { useActiveSection } from '../hooks/useActiveSection'
import { useLangContext } from '../context/LangContext'
import { translations } from '../i18n'
import SectionTabs from '../components/SectionTabs'
import DishGrid from '../components/DishGrid'
import DishModal from '../components/DishModal'
import DownloadButton from '../components/DownloadButton'

export default function MenuPage() {
  const { lang } = useLangContext()
  const t = translations[lang]
  const { sections, dishes, loading, error, retry } = useMenuData()
  const [activeSectionId, setActiveSectionId] = useActiveSection(sections)
  const [selectedDish, setSelectedDish] = useState(null)

  const filteredDishes = dishes.filter((d) => d.sectionId === activeSectionId)

  if (loading && sections.length === 0) {
    return (
      <div className="menu-page menu-page--loading" aria-live="polite">
        <p className="menu-page__message">{t.menuLoading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="menu-page menu-page--error" role="alert">
        <p className="menu-page__message">{t.menuError}</p>
        <button type="button" className="menu-page__retry" onClick={retry}>
          {t.retry}
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="menu-page">
        <div className="main menu-page__top-title-wrap">
          <section className="menu-page__top-title-section">
            <h1 className="menu-page__top-title">{t.navMenu}</h1>
            <p className="menu-page__top-intro">{t.pageDescriptionMenu}</p>
          </section>
        </div>
        <SectionTabs
          sections={sections}
          activeId={activeSectionId}
          onSelect={setActiveSectionId}
        />
        <main className="main">
          <section className="menu-page__grid-section">
            <DishGrid
              dishes={filteredDishes}
              onSelectDish={setSelectedDish}
            />
          </section>
        </main>
      </div>
      <DownloadButton />
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </>
  )
}
