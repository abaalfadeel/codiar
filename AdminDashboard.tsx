import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ShieldCheck, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (role !== 'admin') return;
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role]);

  if (role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">غير مصرح لك بالدخول</h2>
          <p className="text-codiar-text-muted mt-2">هذه الصفحة مخصصة للمدراء فقط.</p>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'active') {
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(now.getMonth() + 1);
        
        updateData.validFrom = Timestamp.fromDate(now);
        updateData.validUntil = Timestamp.fromDate(nextMonth);
      }
      
      await updateDoc(orderRef, updateData);
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, ...updateData } : o));
    } catch (error) {
      console.error("Error updating order:", error);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    } finally {
      setUpdating(null);
    }
  };

  const handleRenew = async (orderId: string, currentValidUntil: any) => {
    setUpdating(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      
      const newValidUntil = new Date(currentValidUntil.toDate());
      newValidUntil.setMonth(newValidUntil.getMonth() + 1);
      
      const updateData = { 
        status: 'active',
        validUntil: Timestamp.fromDate(newValidUntil) 
      };
      
      await updateDoc(orderRef, updateData);
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, ...updateData } : o));
    } catch (error) {
      console.error("Error renewing order:", error);
      alert('حدث خطأ أثناء تجديد الاشتراك');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="w-8 h-8 text-codiar-accent" />
        <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
      </div>

      {loading ? (
        <div className="text-center py-12 text-codiar-text-muted">جاري تحميل الطلبات...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order, index) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-codiar-surface border border-codiar-border rounded-3xl p-6 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{order.serviceTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      order.status === 'active' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      order.status === 'expired' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {order.status === 'active' ? 'فعال' : order.status === 'paid' ? 'مدفوع' : order.status === 'expired' ? 'منتهي' : 'قيد المراجعة'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-codiar-text-muted mb-4">
                    <div>
                      <p><strong className="text-white">رقم الطلب:</strong> <span className="font-mono">{order.orderId}</span></p>
                      <p><strong className="text-white">العميل:</strong> {order.clientEmail}</p>
                      <p><strong className="text-white">الهاتف:</strong> <span dir="ltr">{order.clientPhone}</span></p>
                    </div>
                    <div>
                      <p><strong className="text-white">النوع:</strong> {order.projectType}</p>
                      <p><strong className="text-white">المستوى:</strong> {order.complexity}</p>
                      <p><strong className="text-white">الإجمالي:</strong> <span className="text-codiar-accent font-bold">${order.total}</span></p>
                    </div>
                  </div>
                  
                  {(order.validFrom || order.validUntil) && (
                    <div className="flex gap-4 text-sm bg-codiar-bg/50 p-3 rounded-xl border border-codiar-border/50">
                      {order.validFrom && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-codiar-text-muted" />
                          <span className="text-codiar-text-muted">من:</span> {order.validFrom.toDate().toLocaleDateString('ar-IQ')}
                        </span>
                      )}
                      {order.validUntil && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-codiar-text-muted" />
                          <span className="text-codiar-text-muted">إلى:</span> {order.validUntil.toDate().toLocaleDateString('ar-IQ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 min-w-[200px]">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'paid')}
                      disabled={updating === order.id}
                      className="w-full py-2 px-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      تأكيد الدفع
                    </button>
                  )}
                  
                  {(order.status === 'pending' || order.status === 'paid') && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'active')}
                      disabled={updating === order.id}
                      className="w-full py-2 px-4 bg-blue-500/10 text-blue-500 border border-blue-500/50 rounded-xl hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      تفعيل الاشتراك (شهر)
                    </button>
                  )}
                  
                  {(order.status === 'active' || order.status === 'expired') && (
                    <button 
                      onClick={() => handleRenew(order.id, order.validUntil || Timestamp.now())}
                      disabled={updating === order.id}
                      className="w-full py-2 px-4 bg-codiar-accent/10 text-codiar-accent border border-codiar-accent/50 rounded-xl hover:bg-codiar-accent hover:text-codiar-bg transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      تجديد الاشتراك (شهر)
                    </button>
                  )}
                  
                  {order.status === 'active' && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'expired')}
                      disabled={updating === order.id}
                      className="w-full py-2 px-4 bg-red-500/10 text-red-500 border border-red-500/50 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      إيقاف / إنهاء
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
