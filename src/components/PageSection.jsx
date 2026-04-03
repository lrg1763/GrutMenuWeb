export default function PageSection({ title, intro, children, className = '', ariaLabel }) {
  return (
    <section className={`page-section ${className}`.trim()} aria-label={ariaLabel}>
      {(title || intro) && (
        <header className="page-section__header">
          {title && <h2 className="page-section__title">{title}</h2>}
          {intro && <p className="page-section__intro">{intro}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
