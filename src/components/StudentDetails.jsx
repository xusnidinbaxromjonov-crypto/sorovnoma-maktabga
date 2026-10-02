import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { X } from 'lucide-react';
import { questions789, questions1011 } from '../data/questions';

export default function StudentDetails({ student, onClose }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const isHighSchool = student.class && (student.class.startsWith('10') || student.class.startsWith('11'));
  const questions = isHighSchool ? questions1011 : questions789;

  useEffect(() => {
    if (student.test_completed) {
      fetchAnswers();
    }
  }, [student]);

  const fetchAnswers = async () => {
    setLoading(true);
    if (false /* SUPABASE FORCED */) {
      const mockAnswers = JSON.parse(localStorage.getItem('mock_answers') || '[]');
      const filtered = mockAnswers.filter(a => a.student_id === student.id);
      setAnswers(filtered);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('test_answers')
      .select('*')
      .eq('student_id', student.id);
      
    if (!error && data) {
      setAnswers(data);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50
    }}>
      <div className="glass-panel" style={{ background: 'white', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <X size={24} color="#6b7280" />
        </button>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>O'quvchi ma'lumotlari</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <DetailItem label="Ism" value={student.first_name} />
          <DetailItem label="Familiya" value={student.last_name} />
          <DetailItem label="Telefon" value={student.phone} />
          <DetailItem label="Sinf" value={student.class} />
          <DetailItem label="Til" value={student.language === 'uz' ? "O'zbekcha" : "Русский"} />
          <DetailItem label="Ro'yxatdan o'tgan sana" value={new Date(student.created_at).toLocaleString()} />
          <DetailItem label="Holat" value={student.test_completed ? "Tugagan" : "Tugallanmagan"} />
          <DetailItem label="Qiziqishi" value={student.interest_area || '—'} />
          {student.test_completed_at && (
            <DetailItem label="Testni tugatgan sana" value={new Date(student.test_completed_at).toLocaleString()} />
          )}
        </div>

        {student.test_completed && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
              Javoblari
            </h3>
            {loading ? <p>Yuklanmoqda...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {answers.map(ans => {
                  const q = questions.find(q => q.id === ans.question_id);
                  if (!q) return null;
                  const selectedOpt = q.options[ans.answer_id];
                  return (
                    <div key={ans.id} style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                      <p style={{ fontWeight: '500', marginBottom: '8px' }}>{q.questionUz}</p>
                      <p style={{ color: 'var(--primary)' }}>Javob: {selectedOpt ? selectedOpt.textUz : 'Noma\'lum'}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const DetailItem = ({ label, value }) => (
  <div>
    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '4px' }}>{label}</p>
    <p style={{ fontWeight: '500' }}>{value}</p>
  </div>
);
