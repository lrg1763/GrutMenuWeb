import { useState } from 'react'
import { LangProvider, useLangContext } from './context/LangContext'
import { useLang } from './hooks/useLang'
import { useMenuData } from './hooks/useMenuData'
import { useActiveSection } from './hooks/useActiveSection'
import Header from './components/Header'
import SectionTabs from './components/SectionTabs'
import DishGrid from './components/DishGrid'
import DishModal from './components/DishModal'
import DownloadButton from './components/DownloadButton'
import './App.css'

function AppContent() {
  const { lang } = useLangContext()
  const { sections, dishes } = useMenuData()
  const [activeSectionId, setActiveSectionId] = useActiveSection(sections)
  const [selectedDish, setSelectedDish] = useState(null)

  const filteredDishes = dishes.filter((d) => d.sectionId === activeSectionId)

  return (
    <div className="app">
      <Header />
      <SectionTabs
        sections={sections}
        activeId={activeSectionId}
        onSelect={setActiveSectionId}
      />
      <main className="main">
        <DishGrid
          dishes={filteredDishes}
          onSelectDish={setSelectedDish}
        />
      </main>
      <DownloadButton />
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useLang()

  return (
    <LangProvider lang={lang} setLang={setLang}>
      <AppContent />
    </LangProvider>
  )
}
