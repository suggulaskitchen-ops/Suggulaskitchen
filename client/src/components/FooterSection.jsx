import { Clock3, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

function FooterSection({ businessInfo, socialLinks }) {
  return (
    <footer className="rounded-3xl bg-slate-950 px-5 py-8 text-slate-300 shadow-2xl shadow-slate-900/20 sm:px-7">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#b8e532]">Stay connected</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Homemade food ready for every event.</h2>
          </div>
          <div className="grid gap-3 rounded-2xl bg-slate-900/80 p-5 text-sm text-slate-400 sm:grid-cols-2">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#b8e532]" />{businessInfo.address || 'Address not configured'}</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-[#b8e532]" />{businessInfo.phone || 'Phone not configured'}</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-[#b8e532]" />{businessInfo.email || 'Email not configured'}</p>
            <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 shrink-0 text-[#b8e532]" />{businessInfo.hours || 'Hours not configured'}</p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2">
          <p>{businessInfo.footerText || 'Homemade Food Business © 2026. All rights reserved.'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => (
                <a key={link.platform} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  {link.platform?.toLowerCase() === 'instagram' ? <Instagram className="h-4 w-4" /> : <Facebook className="h-4 w-4" />}
                  <span>{link.platform}</span>
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
