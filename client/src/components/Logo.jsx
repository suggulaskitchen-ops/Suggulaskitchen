function Logo({ className, alt = "Suggula's Kitchen" }) {
  const src = import.meta.env.BASE_URL + 'images/suggula-logo.svg'
  return <img src={src} alt={alt} className={className} />
}

export default Logo
