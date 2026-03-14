import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAppContext } from '../context/AppContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useAppContext();

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      const role = email === 'abaalfadeel1@gmail.com' ? 'admin' : 'client';
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: role,
        createdAt: new Date()
      });

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-codiar-surface border border-codiar-border rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">إنشاء حساب جديد</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-codiar-bg border border-codiar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-codiar-accent focus:border-codiar-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-codiar-bg border border-codiar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-codiar-accent focus:border-codiar-accent transition-colors"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-codiar-bg border border-codiar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-codiar-accent focus:border-codiar-accent transition-colors"
              dir="ltr"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-codiar-accent text-codiar-bg font-bold py-3 rounded-xl hover:bg-codiar-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </button>
        </form>

        <p className="text-center mt-6 text-codiar-text-muted">
          لديك حساب بالفعل؟ <Link to="/login" className="text-codiar-accent hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
