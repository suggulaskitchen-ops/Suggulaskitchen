function FooterSection({ businessInfo, socialLinks }) {
  return (
    <footer className="rounded-[2rem] bg-slate-950 px-8 py-12 text-slate-300 shadow-2xl shadow-slate-900/20">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Stay connected</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Homemade food ready for every event.</h2>
          </div>
          <div className="space-y-2 rounded-3xl bg-slate-900/80 p-6 text-sm text-slate-400">
            <p>{businessInfo.address || 'Address not configured'}</p>
            <p>{businessInfo.phone || 'Phone not configured'}</p>
            <p>{businessInfo.email || 'Email not configured'}</p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2">
          <p>{businessInfo.footerText || 'Homemade Food Business © 2026. All rights reserved.'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => (
                <a key={link.platform} href={link.url} target="_blank" rel="noreferrer" className="hover:text-white">
                  {link.platform}
                </a>
              ))
            ) : (
              <span>No social links configured.</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
