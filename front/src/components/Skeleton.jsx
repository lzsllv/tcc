import '../styles/Skeleton.css'

/**
 * Skeleton — placeholder de carregamento
 *
 * Props:
 *   width   {string}  ex: '100%', '200px'
 *   height  {string}  ex: '1em', '48px'
 *   radius  {string}  ex: '8px', '50%'
 *   count   {number}  quantas linhas (padrão: 1)
 *   gap     {string}  gap entre linhas quando count > 1
 */
export default function Skeleton({
  width = '100%',
  height = '1em',
  radius = '6px',
  count = 1,
  gap = '.5rem',
  style = {},
}) {
  if (count > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="skeleton"
            style={{
              width: i === count - 1 ? '65%' : width,
              height,
              borderRadius: radius,
              ...style,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  )
}
