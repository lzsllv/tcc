import '../styles/LoadingButton.css'

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
