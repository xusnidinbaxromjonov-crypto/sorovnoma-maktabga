import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const ADMINS = {
  'islombek': { school: 'all', pass: '12345' },
  'diyora': { school: '3-maktab', pass: '12345' },
  'dilorom': { school: '4-maktab', pass: '12345' },
  'shaxribonu': { school: '6-maktab', pass: '12345' },
  'asadbek': { school: '8-maktab', pass: '12345' },
  'muxlisa9': { school: '9-maktab', pass: '12345' },
  'sayyora': { school: '10-maktab', pass: '12345' },
  'muxlisa12': { school: '12-maktab', pass: '12345' },
  'rahimjon': { school: '13-maktab', pass: '12345' },
  'karima': { school: '14-maktab', pass: '12345' },
  'yorqinoy': { school: '15-maktab', pass: '12345' },
  'eldor': { school: '16-maktab', pass: '12345' },
  'sanjar': { school: '17-maktab', pass: '12345' },
  'zafarjon': { school: '18-maktab', pass: '12345' },
  'navruza': { school: '19-maktab', pass: '12345' },
  'asiljon': { school: '21-maktab', pass: '12345' },
  'nematjon': { school: '22-maktab', pass: '12345' },
  'alohiddin': { school: '23-maktab', pass: '12345' },
  'tursunoy': { school: '24-maktab', pass: '12345' },
  'sardorbek': { school: '25-maktab', pass: '12345' },
  'mohita': { school: '28-maktab', pass: '12345' }
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkExistingSession = async () => {
      if (localStorage.getItem('admin_token') === 'mock_token') {
        navigate('/admin/dashboard');
        return;
      }
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/admin/dashboard');
        }
      }
    };
    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const loginId = email.trim().toLowerCase();
      
      // Maxsus adminlarni tekshirish (parolsiz)
      if (ADMINS[loginId]) {
        localStorage.setItem('admin_token', 'mock_token');
        localStorage.setItem('admin_school', ADMINS[loginId].school);
        navigate('/admin/dashboard');
        return;
      }

      // Vaqtincha test qilish uchun (Supabase ulanmagan bo'lsa)
      if (!import.meta.env.VITE_SUPABASE_URL) {
        if (loginId === 'admin@admin.com') {
          localStorage.setItem('admin_token', 'mock_token');
          localStorage.setItem('admin_school', 'all');
          navigate('/admin/dashboard');
          return;
        } else {
          throw new Error("Bunday admin mavjud emas.");
        }
      }

      // Supabase orqali haqiqiy email login qilinmaydi chunki faqat maxsus adminlar ishlatilmoqda.
      // Agar kiritilgan ism maxsus adminlar ro'yxatida bo'lmasa xato beramiz.
      throw new Error("Bunday admin ro'yxatda yo'q.");

    } catch (err) {
      console.error(err);
      setError(err.message || "Kirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container slide-up">
      <div className="glass-panel content-box">
        <h1 className="gradient-text">Admin Panel</h1>
        
        <form onSubmit={handleLogin} style={{ marginTop: '24px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Login (Ism yoki Email)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          
          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '...' : 'Kirish / Вход'}
          </button>
        </form>
      </div>
    </div>
  );
}
