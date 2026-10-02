import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { questions9, categories9 } from '../../data/questions9';
import ProgressBar from '../../components/ProgressBar';
import { supabase } from '../../services/supabase';

export default function Test9() {
  const { t, langCode } = useLanguage();
  const navigate = useNavigate();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const q = questions9[currentIdx];
  const total = questions9.length;
  
  const isUz = langCode === 'uz';
  const questionText = q ? (isUz ? q.textUz : q.textRu) : '';

  useEffect(() => {
    const sid = localStorage.getItem('studentId');
    if (!sid) navigate('/');
  }, [navigate]);

  if (!q) return null;

  const handleSelect = (val) => {
    setAnswers({ ...answers, [q.id]: val });
    setError('');
  };

  const handleNext = async () => {
    if (answers[q.id] === undefined) {
      setError(t.selectAnswerError || "Iltimos, javobni tanlang / Пожалуйста, выберите ответ");
      return;
    }

    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      await finishTest();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setError('');
    }
  };

  const finishTest = async () => {
    setSubmitting(true);
    try {
      const studentId = localStorage.getItem('studentId');
      
      const scores = {}; 
      categories9.forEach(c => scores[c.id] = 0);
      
      for (const qObj of questions9) {
        if (answers[qObj.id] === 1) { // 1 = Yes
          scores[qObj.category] += 1;
        }
      }
      
      let maxScore = -1;
      let topCandidates = [];
      for (const [cId, score] of Object.entries(scores)) {
        if (score > maxScore) {
          maxScore = score;
          topCandidates = [parseInt(cId)];
        } else if (score === maxScore) {
          topCandidates.push(parseInt(cId));
        }
      }
      
      const topCategoryId = topCandidates[Math.floor(Math.random() * topCandidates.length)];
      const topCategory = categories9.find(c => c.id === topCategoryId);
      const interestName = isUz ? topCategory.nameUz : topCategory.nameRu;
      
      if (false /* SUPABASE FORCED */) {
        const mockStudents = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const updatedStudents = mockStudents.map(s => {
          if (s.id === studentId) {
            return { ...s, test_completed: true, interest_area: interestName, test_completed_at: new Date().toISOString() };
          }
          return s;
        });
        localStorage.setItem('mock_students', JSON.stringify(updatedStudents));

        localStorage.setItem('resultText', interestName);
        navigate('/result');
        return;
      }

      await supabase.from('students').update({
        test_completed: true,
        interest_area: interestName,
        test_completed_at: new Date().toISOString()
      }).eq('id', studentId);
      
      localStorage.setItem('resultText', interestName);
      navigate('/result');
      
    } catch (err) {
      console.error(err);
      setError("Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container slide-up">
      <div className="glass-panel content-box" style={{ maxWidth: '600px' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>
          {t.questionPrefix || "Savol / Вопрос"} {currentIdx + 1} / {total}
        </h4>
        
        <ProgressBar current={currentIdx + 1} total={total} />
        
        <h2 style={{ marginBottom: '24px', fontSize: '1.25rem', lineHeight: '1.5' }}>
          {questionText}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <div 
            onClick={() => handleSelect(1)}
            style={{
              padding: '16px 20px', borderRadius: '12px',
              border: `2px solid ${answers[q.id] === 1 ? 'var(--primary)' : 'rgba(0,0,0,0.05)'}`,
              background: answers[q.id] === 1 ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {isUz ? "Ha" : "Да"}
          </div>
          <div 
            onClick={() => handleSelect(0)}
            style={{
              padding: '16px 20px', borderRadius: '12px',
              border: `2px solid ${answers[q.id] === 0 ? 'var(--primary)' : 'rgba(0,0,0,0.05)'}`,
              background: answers[q.id] === 0 ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {isUz ? "Yo'q" : "Нет"}
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}
        
        <div style={{ display: 'flex', gap: '16px' }}>
          {currentIdx > 0 && (
            <button className="btn-secondary" onClick={handlePrev} disabled={submitting}>
              {t.prevBtn || "Oldingi / Назад"}
            </button>
          )}
          <button className="btn-primary" onClick={handleNext} disabled={submitting}>
            {submitting ? '...' : (currentIdx === total - 1 ? (t.finishBtn || "Tugatish / Завершить") : (t.nextBtn || "Keyingi / Далее"))}
          </button>
        </div>
      </div>
    </div>
  );
}
