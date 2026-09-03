import '../styles/LoadingButton.css'

/**
 * LoadingButton — botão primário com estado de carregamento
 *
 * Props:
 *   loading   {boolean}   mostra spinner e desabilita o botão
 *   children  {ReactNode} texto do botão
 *   type      {string}    'button' | 'submit' (default: 'button')
 *   onClick   {fn}
 *   className {string}    classes extras
 *   disabled  {boolean}
 *   loadingText {string}  texto durante loading (padrão: 'Aguarde...')
 */
export default function LoadingButton({
  loading = false,
  children,
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  loadingText = 'Aguarde...',
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn-primary loading-btn ${loading ? 'loading-btn--ativo' : ''} ${className}`}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="loading-spinner" aria-hidden="true" />
          <span>{loadingText}</span>
        </>
      ) : children}
    </button>
  )
}
