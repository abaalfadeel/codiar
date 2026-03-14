import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Code, ShoppingCart, User, CheckCircle2, MessageCircle, Mail, Phone, Sparkles, Instagram, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { t, lang } = useAppContext();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const [activeModal, setActiveModal] = useState<'instagram' | 'tiktok' | null>(null);

  const services = [
    {
      id: 'web-dev',
      title: t.services.items.fullWeb.title,
      description: t.services.items.fullWeb.desc,
      price: t.services.items.fullWeb.price,
      duration: t.services.items.fullWeb.duration,
      icon: Code,
    },
    {
      id: 'ecommerce',
      title: t.services.items.ecommerce.title,
      description: t.services.items.ecommerce.desc,
      price: t.services.items.ecommerce.price,
      duration: t.services.items.ecommerce.duration,
      icon: ShoppingCart,
    },
    {
      id: 'portfolio',
      title: t.services.items.portfolio.title,
      description: t.services.items.portfolio.desc,
      price: t.services.items.portfolio.price,
      duration: t.services.items.portfolio.duration,
      icon: User,
    },
    {
      id: 'custom',
      title: t.services.items.custom.title,
      description: t.services.items.custom.desc,
      price: t.services.items.custom.price,
      duration: t.services.items.custom.duration,
      icon: Sparkles,
    },
  ];

  const portfolio = [
    {
      id: 1,
      title: t.portfolio.items.restaurant.title,
      category: t.portfolio.items.restaurant.category,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      title: t.portfolio.items.fashion.title,
      category: t.portfolio.items.fashion.category,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      title: t.portfolio.items.cafe.title,
      category: t.portfolio.items.cafe.category,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 4,
      title: t.portfolio.items.ecommerce.title,
      category: t.portfolio.items.ecommerce.category,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 5,
      title: t.portfolio.items.wedding.title,
      category: t.portfolio.items.wedding.category,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-animate">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute inset-0 bg-codiar-bg/80 backdrop-blur-[2px]"></div>
        
        {/* Floating elements for extra animation */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-codiar-accent/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            {t.hero.title1} <span className="text-codiar-accent">{t.hero.titleAccent}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-codiar-text-muted max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a 
              href="#services" 
              className="inline-flex items-center justify-center gap-2 bg-codiar-accent text-white px-8 py-4 rounded-full font-semibold hover:bg-codiar-accent-hover transition-colors text-lg shadow-lg shadow-codiar-accent/20"
            >
              {t.hero.browseServices}
              <ArrowIcon className="w-5 h-5" />
            </a>
            <a 
              href="#portfolio" 
              className="inline-flex items-center justify-center gap-2 bg-codiar-surface border border-codiar-border text-codiar-text px-8 py-4 rounded-full font-semibold hover:border-codiar-text-muted transition-colors text-lg"
            >
              {t.hero.ourWork}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-codiar-surface/30 border-y border-codiar-border/50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.services.title}</h2>
            <p className="text-codiar-text-muted max-w-2xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-codiar-surface border border-codiar-border rounded-2xl p-8 hover:border-codiar-accent/50 transition-colors group flex flex-col h-full shadow-xl shadow-black/5"
              >
                <div className="w-14 h-14 bg-codiar-bg rounded-xl flex items-center justify-center mb-6 border border-codiar-border group-hover:border-codiar-accent/30 transition-colors">
                  <service.icon className="w-7 h-7 text-codiar-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-codiar-text-muted mb-8 flex-grow leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-4 mt-auto">
                  <div className="flex items-center justify-between text-sm border-t border-codiar-border pt-4">
                    <span className="text-codiar-text-muted">{t.services.startingAt}</span>
                    <span className="font-mono font-bold text-lg text-codiar-accent">{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-codiar-text-muted">{t.services.duration}</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <Link 
                    to={`/checkout/${service.id}`}
                    className="block w-full text-center py-3 mt-4 rounded-xl bg-codiar-bg border border-codiar-border hover:border-codiar-accent hover:text-codiar-accent transition-colors font-medium"
                  >
                    {t.services.order}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.portfolio.title}</h2>
              <p className="text-codiar-text-muted max-w-2xl">
                {t.portfolio.subtitle}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 border border-codiar-border">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-codiar-bg/90 via-codiar-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex justify-between items-center w-full">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        {t.portfolio.completed}
                      </span>
                      <span className="text-sm font-medium text-white hover:text-codiar-accent transition-colors flex items-center gap-1">
                        {t.portfolio.visit} <ArrowIcon className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-codiar-accent transition-colors">{item.title}</h3>
                <p className="text-sm text-codiar-text-muted">{item.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-codiar-surface/50 border-t border-codiar-border scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.contact.title}</h2>
          <p className="text-codiar-text-muted mb-12">
            {t.contact.subtitle}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <a href="https://wa.me/9647728633229" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-6 rounded-2xl bg-codiar-bg border border-codiar-border hover:border-[#25D366] hover:text-[#25D366] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-codiar-surface flex items-center justify-center mb-3 group-hover:bg-[#25D366]/10 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">{t.contact.whatsapp}</span>
            </a>
            
            <a href="mailto:codiartech@gmail.com" className="flex flex-col items-center p-6 rounded-2xl bg-codiar-bg border border-codiar-border hover:border-codiar-accent hover:text-codiar-accent transition-colors group">
              <div className="w-12 h-12 rounded-full bg-codiar-surface flex items-center justify-center mb-3 group-hover:bg-codiar-accent/10 transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">{t.contact.email}</span>
            </a>
            
            <a href="tel:+9647728633229" className="flex flex-col items-center p-6 rounded-2xl bg-codiar-bg border border-codiar-border hover:border-codiar-accent hover:text-codiar-accent transition-colors group">
              <div className="w-12 h-12 rounded-full bg-codiar-surface flex items-center justify-center mb-3 group-hover:bg-codiar-accent/10 transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">{t.contact.phone}</span>
            </a>

            <button onClick={() => setActiveModal('instagram')} className="flex flex-col items-center p-6 rounded-2xl bg-codiar-bg border border-codiar-border hover:border-[#E1306C] hover:text-[#E1306C] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-codiar-surface flex items-center justify-center mb-3 group-hover:bg-[#E1306C]/10 transition-colors">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">{t.contact.instagram}</span>
            </button>

            <button onClick={() => setActiveModal('tiktok')} className="flex flex-col items-center p-6 rounded-2xl bg-codiar-bg border border-codiar-border hover:border-[#00f2fe] hover:text-[#00f2fe] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-codiar-surface flex items-center justify-center mb-3 group-hover:bg-[#00f2fe]/10 transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </div>
              <span className="font-medium text-sm">{t.contact.tiktok}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Social Media Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-codiar-bg/80 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-codiar-surface border border-codiar-border rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 text-codiar-text-muted hover:text-codiar-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${activeModal === 'instagram' ? 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]' : 'bg-black dark:bg-white'}`}>
                  {activeModal === 'instagram' ? (
                    <Instagram className="w-10 h-10 text-white" />
                  ) : (
                    <svg className="w-10 h-10 fill-white dark:fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">Codiar</h3>
                <p className="text-codiar-text-muted mb-6">@codiar.tech</p>
                
                <p className="text-sm mb-8 leading-relaxed">
                  {t.hero.description}
                </p>

                <a 
                  href={activeModal === 'instagram' ? 'https://instagram.com/codiar.tech' : 'https://tiktok.com/@codiar.tech'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 rounded-xl font-bold text-white transition-colors ${activeModal === 'instagram' ? 'bg-[#E1306C] hover:bg-[#C13584]' : 'bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'}`}
                >
                  {t.contact.visitProfile}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
