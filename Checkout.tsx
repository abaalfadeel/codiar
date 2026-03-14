import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, ArrowLeft, MessageCircle, Mail, FileText, CheckCircle2, Download, Phone, Lock } from 'lucide-react';
import { toPng } from 'html-to-image';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';

export default function Checkout() {
  const { serviceId } = useParams();
  const { t, lang, theme } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ArrowIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  const ticketRef = useRef<HTMLDivElement>(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [projectType, setProjectType] = useState('');
  const [otherTypeDesc, setOtherTypeDesc] = useState('');
  const [detailedDesc, setDetailedDesc] = useState('');
  const [complexity, setComplexity] = useState('simple');
  const [extras, setExtras] = useState<string[]>([]);
  const [showTicket, setShowTicket] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = {
    'web-dev': {
      title: t.services.items.fullWeb.title,
      basePrice: 10,
      duration: t.services.items.fullWeb.duration,
    },
    'ecommerce': {
      title: t.services.items.ecommerce.title,
      basePrice: 35,
      duration: t.services.items.ecommerce.duration,
    },
    'portfolio': {
      title: t.services.items.portfolio.title,
      basePrice: 5,
      duration: t.services.items.portfolio.duration,
    },
    'custom': {
      title: t.services.items.custom.title,
      basePrice: 0,
      duration: t.services.items.custom.duration,
    },
  };

  const service = services[serviceId as keyof typeof services];

  if (!service) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t.checkout.notFound}</h2>
          <Link to="/" className="text-codiar-accent hover:underline">{t.checkout.backHome}</Link>
        </div>
      </div>
    );
  }

  const getComplexityPrices = (id: string) => {
    if (id === 'portfolio') {
      return { simple: 0, normal: 10, professional: 25 };
    }
    return { simple: 5, normal: 50, professional: 150 };
  };

  const complexityPrices = getComplexityPrices(serviceId || '');

  const extraPrices = {
    domain: 0,
    email: 10,
    seo: 35,
    maintenanceMonthly: 10,
    maintenanceWeekly: 15,
    maintenanceDaily: 25,
  };

  const calculateTotal = () => {
    let total = service.basePrice;
    total += complexityPrices[complexity as keyof typeof complexityPrices];
    extras.forEach(extra => {
      total += extraPrices[extra as keyof typeof extraPrices];
    });
    return total;
  };

  const handleExtraToggle = (extra: string) => {
    setExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  const generateOrderId = () => {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const [orderId] = useState(generateOrderId());

  const getTicketDetails = () => {
    const typeStr = projectType === 'other' ? `${t.checkout.form.types.other} - ${otherTypeDesc}` : t.checkout.form.types[projectType as keyof typeof t.checkout.form.types] || '';
    const complexityStr = t.checkout.form.levels[complexity as keyof typeof t.checkout.form.levels];
    const extrasStr = extras.length > 0 ? extras.map(e => t.checkout.form.extraItems[e as keyof typeof t.checkout.form.extraItems]).join(', ') : 'None';
    
    return {
      typeStr,
      complexityStr,
      extrasStr,
      total: calculateTotal()
    };
  };

  const handleGenerateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setIsSubmitting(true);
    const details = getTicketDetails();

    try {
      const orderData = {
        orderId,
        userId: user.uid,
        serviceId: serviceId || '',
        serviceTitle: service.title,
        projectType: details.typeStr,
        complexity: details.complexityStr,
        extras: extras,
        total: details.total,
        detailedDesc,
        status: 'pending',
        createdAt: Timestamp.now(),
        clientEmail: user.email,
        clientPhone: phoneNumber
      };

      await setDoc(doc(db, 'orders', orderId), orderData);
      
      // Admin Notification Log
      console.log('%c🔔 NEW ORDER RECEIVED 🔔', 'background: #222; color: #bada55; font-size: 20px; font-weight: bold; padding: 10px;');
      console.log(`%cOrder ID: %c${orderId}`, 'font-weight: bold;', 'color: #00f2fe;');
      console.log(`%cClient: %c${user.email}`, 'font-weight: bold;', 'color: #00f2fe;');
      console.log(`%cPhone: %c${phoneNumber}`, 'font-weight: bold;', 'color: #00f2fe;');
      console.log(`%cService: %c${service.title}`, 'font-weight: bold;', 'color: #00f2fe;');
      console.log(`%cTotal: %c$${details.total}`, 'font-weight: bold;', 'color: #00f2fe;');
      console.log('%c------------------------', 'color: #666;');

      // Send Email Notification to Admin via EmailJS
      try {
        // NOTE: To make this work, create a free account at emailjs.com
        // and replace these placeholder IDs with your actual IDs.
        await emailjs.send(
          'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
          'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
          {
            to_email: 'abaalfadeel1@gmail.com',
            order_id: orderId,
            client_email: user.email,
            client_phone: phoneNumber,
            service: service.title,
            project_type: details.typeStr,
            complexity: details.complexityStr,
            total: details.total,
            description: detailedDesc
          },
          'YOUR_PUBLIC_KEY' // Replace with your EmailJS Public Key
        );
        console.log("Admin email notification sent successfully.");
      } catch (emailError) {
        console.error("Failed to send email notification (Check EmailJS keys):", emailError);
      }

      setShowTicket(true);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const details = getTicketDetails();
    const message = t.checkout.whatsappMsg
      .replace('{orderId}', orderId)
      .replace('{phone}', phoneNumber)
      .replace('{service}', service.title)
      .replace('{type}', details.typeStr)
      .replace('{complexity}', details.complexityStr)
      .replace('{extras}', details.extrasStr)
      .replace('{total}', details.total.toString())
      .replace('{description}', detailedDesc);
    
    const adminPhone = '9647728633229';
    const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleEmailOrder = () => {
    const details = getTicketDetails();
    const message = t.checkout.whatsappMsg
      .replace('{orderId}', orderId)
      .replace('{phone}', phoneNumber)
      .replace('{service}', service.title)
      .replace('{type}', details.typeStr)
      .replace('{complexity}', details.complexityStr)
      .replace('{extras}', details.extrasStr)
      .replace('{total}', details.total.toString())
      .replace('{description}', detailedDesc);
    
    const adminEmail = 'codiartech@gmail.com';
    const subject = `New Order: ${orderId} - ${service.title}`;
    const mailtoUrl = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleDownloadTicket = async () => {
    if (!ticketRef.current || downloadState !== 'idle') return;
    
    setDownloadState('downloading');
    try {
      const dataUrl = await toPng(ticketRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Codiar-Ticket-${orderId}.png`;
      link.click();
      
      setDownloadState('success');
      setTimeout(() => {
        setDownloadState('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to download ticket:', error);
      setDownloadState('idle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-codiar-text-muted hover:text-codiar-accent transition-colors">
          <ArrowIcon className="w-4 h-4" />
          {t.checkout.back}
        </Link>
      </div>

      {!showTicket ? (
        <div className="grid grid-cols-1 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">{t.checkout.summary}</h1>
              <p className="text-codiar-text-muted">{t.checkout.summaryDesc}</p>
            </div>

            <div className="bg-codiar-surface border border-codiar-border rounded-3xl p-8 shadow-2xl shadow-codiar-bg/50 max-w-2xl mx-auto w-full">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-codiar-border">
                <div>
                  <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                  <p className="text-codiar-text-muted text-sm">{t.checkout.duration} {service.duration}</p>
                </div>
                <span className="text-2xl font-mono font-bold text-codiar-accent">${service.basePrice}</span>
              </div>

              <form className="space-y-6 mb-8" onSubmit={handleGenerateTicket}>
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.checkout.form.phone}</label>
                  <div className="relative">
                    <input 
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 11) {
                          setPhoneNumber(val);
                        }
                      }}
                      pattern="07[78]\d{8}"
                      title={t.checkout.form.phoneValidation}
                      maxLength={11}
                      minLength={11}
                      placeholder={t.checkout.form.phonePlaceholder}
                      className="w-full bg-codiar-bg border border-codiar-border rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-1 focus:ring-codiar-accent focus:border-codiar-accent transition-colors"
                      dir="ltr"
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-codiar-text-muted" />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.checkout.form.projectType}</label>
                  <select 
                    required
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-codiar-bg border border-codiar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-codiar-accent focus:border-codiar-accent transition-colors"
                  >
                    <option value="" disabled>{t.checkout.form.projectTypePlaceholder}</option>
                    {Object.entries(t.checkout.form.types).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Other Type Description */}
                {projectType === 'other' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-medium mb-2">{t.checkout.form.otherTypeDesc}</label>
                    <input 
                      type="text"
                      required
                      value={otherTypeDesc}
                      onChange={(e) => setOtherTypeDesc(e.target.value)}
                      className="w-full bg-codiar-bg border border-codiar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-codiar-accent focus:border-codiar-accent transition-colors"
                    />
                  </motion.div>
                )}

                {/* Detailed Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.checkout.form.detailedDesc}</label>
                  <textarea 
                    required
                    rows={4}
                    value={detailedDesc}
                    onChange={(e) => setDetailedDesc(e.target.value)}
                    placeholder={t.checkout.form.detailedDescPlaceholder}
                    className="w-full bg-codiar-bg border border-codiar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-codiar-accent focus:border-codiar-accent transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Complexity */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.checkout.form.complexity}</label>
                  <select 
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full bg-codiar-bg border border-codiar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-codiar-accent focus:border-codiar-accent transition-colors"
                  >
                    {Object.entries(t.checkout.form.levels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label} (+${complexityPrices[key as keyof typeof complexityPrices]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Extras */}
                <div>
                  <label className="block text-sm font-medium mb-3">{t.checkout.form.extras}</label>
                  <div className="space-y-3">
                    {Object.entries(t.checkout.form.extraItems).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${extras.includes(key) ? 'bg-codiar-accent border-codiar-accent' : 'border-codiar-border group-hover:border-codiar-accent'}`}>
                          {extras.includes(key) && <CheckCircle2 className="w-3 h-3 text-codiar-bg" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={extras.includes(key)}
                          onChange={() => handleExtraToggle(key)}
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-codiar-border">
                  <div className="flex justify-between text-xl font-bold mb-6">
                    <span>{t.checkout.total}</span>
                    <span className="text-codiar-accent">${calculateTotal()}</span>
                  </div>

                  <div className="bg-codiar-bg/50 border border-codiar-border rounded-xl p-4 flex items-start gap-3 mb-6">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-codiar-text-muted leading-relaxed">
                      {t.checkout.secure}
                    </p>
                  </div>

                  {!user ? (
                    <div className="bg-codiar-accent/10 border border-codiar-accent/20 rounded-xl p-6 text-center">
                      <Lock className="w-8 h-8 text-codiar-accent mx-auto mb-3" />
                      <h3 className="font-bold mb-2">يجب تسجيل الدخول</h3>
                      <p className="text-sm text-codiar-text-muted mb-4">يرجى تسجيل الدخول أو إنشاء حساب لتتمكن من إتمام الطلب ومتابعته.</p>
                      <button 
                        type="button"
                        onClick={() => navigate('/login', { state: { from: location } })}
                        className="bg-codiar-accent text-codiar-bg font-bold px-6 py-2 rounded-xl hover:bg-codiar-accent-hover transition-colors"
                      >
                        تسجيل الدخول
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-codiar-accent text-codiar-bg font-bold text-lg py-4 rounded-xl hover:bg-codiar-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FileText className="w-5 h-5" />
                      {isSubmitting ? 'جاري إصدار الوصل...' : t.checkout.confirmBtn}
                    </button>
                  )}
                  
                  <p className="text-center text-xs text-codiar-text-muted mt-4">
                    {t.checkout.terms}
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Ticket Container to be captured */}
          <div 
            ref={ticketRef}
            className="bg-codiar-surface border border-codiar-border rounded-3xl p-8 shadow-2xl shadow-codiar-bg/50 relative overflow-hidden mb-8"
          >
            {/* Stamp Effect */}
            <div className="absolute -right-8 top-12 rotate-45 border-4 border-codiar-accent text-codiar-accent font-bold py-2 px-12 text-xl opacity-20 pointer-events-none tracking-widest uppercase">
              {t.checkout.ticket.stamp}
            </div>
            
            {/* Unpaid Stamp Effect */}
            <div className="absolute -left-12 top-24 -rotate-12 border-4 border-red-500 text-red-500 font-bold py-2 px-10 text-xl opacity-30 pointer-events-none tracking-widest uppercase">
              {t.checkout.ticket.unpaidStamp}
            </div>

            {/* Ticket Header */}
            <div className="text-center mb-8 border-b border-codiar-border pb-8 border-dashed">
              <div className="w-16 h-16 bg-codiar-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-codiar-accent" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{t.checkout.ticket.title}</h2>
              <p className="text-codiar-text-muted font-mono">{orderId}</p>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-codiar-text-muted">{t.checkout.ticket.phone}</span>
                <span className="font-medium text-right" dir="ltr">{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-codiar-text-muted">{t.checkout.ticket.service}</span>
                <span className="font-medium text-right">{service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-codiar-text-muted">{t.checkout.ticket.type}</span>
                <span className="font-medium text-right">{getTicketDetails().typeStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-codiar-text-muted">{t.checkout.ticket.complexity}</span>
                <span className="font-medium text-right">{getTicketDetails().complexityStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-codiar-text-muted">{t.checkout.ticket.extras}</span>
                <span className="font-medium text-right max-w-[60%]">{getTicketDetails().extrasStr}</span>
              </div>
              
              {detailedDesc && (
                <div className="pt-4 mt-4 border-t border-codiar-border/50">
                  <span className="text-codiar-text-muted block mb-2">{t.checkout.ticket.desc}</span>
                  <p className="text-sm bg-codiar-bg/50 p-4 rounded-xl border border-codiar-border/50">{detailedDesc}</p>
                </div>
              )}

              <div className="flex justify-between pt-6 mt-6 border-t border-codiar-border border-dashed text-xl font-bold">
                <span>{t.checkout.ticket.total}</span>
                <span className="text-codiar-accent">${calculateTotal()}</span>
              </div>
              
              <div className="text-center pt-4 text-sm font-medium text-emerald-500">
                {t.checkout.ticket.paymentMethod}
              </div>
            </div>

            {/* Ticket Cutouts */}
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-codiar-bg rounded-full"></div>
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-codiar-bg rounded-full"></div>
          </div>

          {/* Ticket Actions (Not captured in image) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {t.checkout.ticket.sendWhatsapp}
            </button>
            <button 
              onClick={handleEmailOrder}
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {t.checkout.ticket.sendEmail}
            </button>
            <button 
              onClick={handleDownloadTicket}
              disabled={downloadState !== 'idle'}
              className={`w-full font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                downloadState === 'success' ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                downloadState === 'downloading' ? 'bg-codiar-border text-codiar-text-muted cursor-not-allowed' :
                'bg-codiar-surface border border-codiar-border hover:border-codiar-accent hover:text-codiar-accent'
              }`}
            >
              {downloadState === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {downloadState === 'success' ? t.checkout.ticket.downloaded :
               downloadState === 'downloading' ? t.checkout.ticket.downloading :
               t.checkout.ticket.download}
            </button>
          </div>
          
          <div className="text-center mt-6">
            <button 
              onClick={() => setShowTicket(false)}
              className="text-codiar-text-muted hover:text-codiar-accent transition-colors"
            >
              {t.checkout.back}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
