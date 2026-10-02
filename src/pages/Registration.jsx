import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';

export default function Registration() {
  const { t, langCode } = useLanguage();
  const isUz = langCode === 'uz';
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    school: '',
    classNumber: '',
    classLetter: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Admin backdoor tekshiruvi
    const ADMINS = {
      'islombek': 'all',
      'diyora': '3-maktab',
      'dilorom': '4-maktab',
      'shaxribonu': '6-maktab',
      'asadbek': '8-maktab',
      'sayyora': '10-maktab',
      'rahimjon': '13-maktab',
      'karima': '14-maktab',
      'yorqinoy': '15-maktab',
      'eldor': '16-maktab',
      'sanjar': '17-maktab',
      'zafarjon': '18-maktab',
      'navruza': '19-maktab',
      'asiljon': '21-maktab',
      'nematjon': '22-maktab',
      'alohiddin': '23-maktab',
      'tursunoy': '24-maktab',
      'sardorbek': '25-maktab',
      'mohita': '28-maktab'
    };

    const loginId = formData.firstName.trim().toLowerCase();
    
    // Muxlisa ismli 2 ta admin bo'lgani uchun ularni maktabiga qarab ajratamiz
    if (loginId === 'muxlisa') {
      if (formData.school === '9-maktab' || formData.school === '12-maktab') {
        localStorage.setItem('admin_token', 'mock_token');
        localStorage.setItem('admin_school', formData.school);
        navigate('/admin/dashboard');
        return;
      } else {
        setError("Iltimos, maktabingizni ham tanlang (9 yoki 12-maktab)");
        return;
      }
    }

    if (ADMINS[loginId]) {
      localStorage.setItem('admin_token', 'mock_token');
      localStorage.setItem('admin_school', ADMINS[loginId]);
      navigate('/admin/dashboard');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.school || !formData.classNumber || !formData.classLetter) {
      setError(t.emptyFieldError || "Barcha maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    
    try {
      // Vaqtincha test qilish uchun (Supabase ulanmagan bo'lsa)
      if (false /* SUPABASE FORCED */) {
        const mockStudents = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const newStudent = {
          id: 'mock-' + Date.now(),
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.school,
          class: `${formData.classNumber}-${formData.classLetter}`,
          language: langCode,
          created_at: new Date().toISOString(),
          test_completed: false,
          interest_area: null
        };
        mockStudents.push(newStudent);
        localStorage.setItem('mock_students', JSON.stringify(mockStudents));
        localStorage.setItem('studentId', newStudent.id);
        localStorage.setItem('studentClass', `${formData.classNumber}-${formData.classLetter}`);
        navigate('/test');
        return;
      }

      const { data, error: dbError } = await supabase
        .from('students')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.school,
            class: `${formData.classNumber}-${formData.classLetter}`,
            language: langCode
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;
      
      // Save student ID to local storage for test session
      localStorage.setItem('studentId', data.id);
      localStorage.setItem('studentClass', `${formData.classNumber}-${formData.classLetter}`);
      navigate('/test');
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container slide-up">
      <div className="glass-panel content-box">
        <h1 className="gradient-text">{t.registration}</h1>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
          <input
            className="input-field"
            placeholder={t.firstName}
            value={formData.firstName}
            onChange={e => setFormData({...formData, firstName: e.target.value})}
          />
          <input
            className="input-field"
            placeholder={t.lastName}
            value={formData.lastName}
            onChange={e => setFormData({...formData, lastName: e.target.value})}
          />
          <select
            className="input-field"
            value={formData.school}
            onChange={e => setFormData({...formData, school: e.target.value})}
            style={{ cursor: 'pointer', marginBottom: '16px' }}
          >
            <option value="" disabled hidden>{isUz ? "Maktabni tanlang" : "Выберите школу"}</option>
            {Array.from({length: 29}, (_, i) => i + 1).map(num => (
              <option key={num} value={`${num}-maktab`}>{num}-maktab</option>
            ))}
          </select>
          <select
            className="input-field"
            value={formData.classNumber}
            onChange={e => setFormData({...formData, classNumber: e.target.value})}
            style={{ cursor: 'pointer', marginBottom: '16px' }}
          >
            <option value="" disabled hidden>Sinfni tanlang</option>
            <option value="5">5-sinf</option>
            <option value="6">6-sinf</option>
            <option value="7">7-sinf</option>
            <option value="8">8-sinf</option>
            <option value="9">9-sinf</option>
          </select>

          <select
            className="input-field"
            value={formData.classLetter}
            onChange={e => setFormData({...formData, classLetter: e.target.value})}
            style={{ cursor: 'pointer' }}
          >
            <option value="" disabled hidden>Harfni tanlang</option>
            <option value="A">"A" - sinfi</option>
            <option value="B">"B" - sinfi</option>
            <option value="D">"D" - sinfi</option>
            <option value="E">"E" - sinfi</option>
            <option value="G">"G" - sinfi</option>
            <option value="V">"V" - sinfi</option>
          </select>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '...' : t.registerBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
