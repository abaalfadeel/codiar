import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Sun, Moon, Globe, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { lang, setLang, theme, setTheme, t } = useAppContext();
  const { user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-codiar-bg/80 backdrop-blur-md border-b border-codiar-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo(0, 0)}>
            <Code2 className="w-8 h-8 text-codiar-accent group-hover:text-codiar-accent-hover transition-colors" />
            <span className="font-bold text-xl tracking-tight">Codiar</span>
          </Link>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => scrollToSection('services')} className="hidden sm:block text-sm text-codiar-text-muted hover:text-codiar-accent transition-colors">
              {t.nav.services}
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="hidden sm:block text-sm text-codiar-text-muted hover:text-codiar-accent transition-colors">
              {t.nav.portfolio}
            </button>
            <button onClick={() => scrollToSection('contact')} className="hidden sm:block text-sm text-codiar-text-muted hover:text-codiar-accent transition-colors">
              {t.nav.contact}
            </button>

            <div className="flex items-center gap-2 border-l border-codiar-border pl-4 ml-2">
              {user ? (
                <>
                  {role === 'admin' && (
                    <Link to="/admin" className="text-sm font-medium text-codiar-accent hover:underline ml-4">
                      لوحة الإدارة
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-medium bg-codiar-surface border border-codiar-border px-4 py-2 rounded-full hover:border-codiar-accent hover:text-codiar-accent transition-colors">
                    <User className="w-4 h-4" />
                    حسابي
                  </Link>
                </>
              ) : (
                <Link to="/login" className="text-sm font-medium bg-codiar-accent text-codiar-bg px-4 py-2 rounded-full hover:bg-codiar-accent-hover transition-colors">
                  تسجيل الدخول
                </Link>
              )}
              
              <button 
                onClick={toggleTheme}
                className="p-2 text-codiar-text-muted hover:text-codiar-accent hover:bg-codiar-surface rounded-full transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={toggleLang}
                className="flex items-center gap-1 p-2 text-codiar-text-muted hover:text-codiar-accent hover:bg-codiar-surface rounded-full transition-colors font-medium text-sm"
                aria-label="Toggle Language"
              >
                <Globe className="w-5 h-5" />
                <span className="uppercase">{lang === 'ar' ? 'EN' : 'AR'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
