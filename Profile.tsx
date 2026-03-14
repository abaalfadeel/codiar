import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { FileText, Clock, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';

export default function Profile() {
  const { user, role, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'active': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'expired': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوع';
      case 'active': return 'فعال';
      case 'expired': return 'منتهي الصلاحية';
      default: return 'قيد المراجعة';
    }
  };

  const checkExpirationWarning = (validUntil: any) => {
    if (!validUntil) return false;
    const expirationDate = validUntil.toDate();
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 1; // 1 day or less remaining
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-codiar-surface border border-codiar-border rounded-3xl p-8 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">مرحباً، {user.displayName || 'مستخدم'}</h1>
            <p className="text-codiar-text-muted">{user.email}</p>
            {role === 'admin' && (
              <span className="inline-block mt-2 px-3 py-1 bg-codiar-accent/10 text-codiar-accent rounded-full text-sm font-medium border border-codiar-accent/20">
                مدير النظام
              </span>
            )}
          </div>
          <button 
            onClick={logout}
            className="px-6 py-2 border border-red-500/50 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-codiar-accent" />
        طلباتي
      </h2>

      {loading ? (
        <div className="text-center py-12 text-codiar-text-muted">جاري تحميل الطلبات...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-codiar-surface border border-codiar-border rounded-3xl">
          <p className="text-codiar-text-muted mb-4">لا توجد طلبات سابقة</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const isExpiringSoon = order.status === 'active' && checkExpirationWarning(order.validUntil);
            
            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-codiar-surface border border-codiar-border rounded-3xl p-6 shadow-lg"
              >
                {isExpiringSoon && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold">تنبيه انتهاء الصلاحية</h4>
                      <p className="text-sm mt-1">اشتراكك في هذه الخدمة سينتهي خلال أقل من 24 ساعة. يرجى التجديد لتجنب توقف الخدمة.</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-codiar-border">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{order.serviceTitle}</h3>
                    <p className="text-sm text-codiar-text-muted font-mono">{order.orderId}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {order.status === 'paid' || order.status === 'active' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-codiar-text-muted">نوع المشروع:</span>
                      <span className="font-medium">{order.projectType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-codiar-text-muted">المستوى:</span>
                      <span className="font-medium">{order.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-codiar-text-muted">الإجمالي:</span>
                      <span className="font-bold text-codiar-accent">${order.total}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-codiar-text-muted">تاريخ الطلب:</span>
                      <span className="font-medium">{order.createdAt?.toDate().toLocaleDateString('ar-IQ')}</span>
                    </div>
                    {order.validFrom && (
                      <div className="flex justify-between">
                        <span className="text-codiar-text-muted">تاريخ التفعيل:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.validFrom.toDate().toLocaleDateString('ar-IQ')}
                        </span>
                      </div>
                    )}
                    {order.validUntil && (
                      <div className="flex justify-between">
                        <span className="text-codiar-text-muted">تاريخ الانتهاء:</span>
                        <span className={`font-medium flex items-center gap-1 ${isExpiringSoon ? 'text-red-500' : ''}`}>
                          <Calendar className="w-4 h-4" />
                          {order.validUntil.toDate().toLocaleDateString('ar-IQ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
