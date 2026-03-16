export default function IconArrow({ dir }) {
  const isLeft = dir === 'left'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="butt" strokeLinejoin="miter" aria-hidden="true">
      {isLeft ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  )
}
