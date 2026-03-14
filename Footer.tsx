import { Code2, Instagram } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Footer() {
  const { t } = useAppContext();

  return (
    <footer className="border-t border-codiar-border bg-codiar-surface py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-8 h-8 text-codiar-accent" />
              <span className="font-bold text-2xl">Codiar</span>
            </div>
            <p className="text-codiar-text-muted leading-relaxed max-w-sm">
              {t.hero.description}
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">{t.nav.services}</h3>
            <ul className="space-y-2 text-codiar-text-muted">
              <li><a href="#services" className="hover:text-codiar-accent transition-colors">{t.services.items.fullWeb.title}</a></li>
              <li><a href="#services" className="hover:text-codiar-accent transition-colors">{t.services.items.ecommerce.title}</a></li>
              <li><a href="#services" className="hover:text-codiar-accent transition-colors">{t.services.items.portfolio.title}</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">{t.contact.title}</h3>
            <div className="flex gap-4">
              <a href="https://instagram.com/codiar.tech" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-codiar-bg border border-codiar-border flex items-center justify-center hover:border-[#E1306C] hover:text-[#E1306C] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@codiar.tech" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-codiar-bg border border-codiar-border flex items-center justify-center hover:border-[#00f2fe] hover:text-[#00f2fe] transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-codiar-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-codiar-text-muted">
          <p>&copy; {new Date().getFullYear()} Codiar. {t.footer.rights}</p>
          <p>{t.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
