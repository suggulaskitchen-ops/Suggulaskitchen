function Logo({ className, alt = "Suggula's Kitchen" }) {
  const src = import.meta.env.BASE_URL + 'images/image.png'
  return <img src={src} alt={alt} className={className} />
}

export default Logo
