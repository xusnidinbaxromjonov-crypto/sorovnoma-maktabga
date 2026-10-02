import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../services/supabase';

export default function Test56() {
  const { t, langCode } = useLanguage();
  const navigate = useNavigate();
  const isUz = langCode === 'uz';

  const [formData, setFormData] = useState({
    q1: [], q1Other: '',
    q2: [], q2Other: '',
    q3: [],
    q4: [],
    q5: [],
    q6_1: '', q6_2: '', q6_3: '',
    q7: [], q7Other: '',
    q8: [],
    q9: [], q9Other: '',
    q10: '',
    q11: [], q11Other: '',
    q12: [], q12Other: '',
    q13: '', q13Other: '',
    q14: '',
    q15: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sid = localStorage.getItem('studentId');
    if (!sid) navigate('/');
  }, [navigate]);

  const handleCheck = (field, value) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const studentId = localStorage.getItem('studentId');
      
      let interestName = isUz ? "Hali qiziqishlar to'liq shakllanmagan" : "Интересы еще не сформировались полностью";
      
      // O'quvchi tanlagan variantlar orqali eng kuchli qiziqishni topish
      if (formData.q5.length > 0) {
        interestName = formData.q5[0];
      } else if (formData.q3.length > 0 && formData.q3[0] !== "Hali bilmayman") {
        interestName = formData.q3[0];
      } else if (formData.q9.length > 0) {
        interestName = formData.q9[0];
      } else if (formData.q11.length > 0) {
        interestName = formData.q11[0];
      }

      if (false /* SUPABASE FORCED */) {
        const mockStudents = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const updatedStudents = mockStudents.map(s => {
          if (s.id === studentId) {
            return { ...s, test_completed: true, interest_area: interestName, survey_data: formData, test_completed_at: new Date().toISOString() };
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
        test_completed_at: new Date().toISOString(),
        survey_data: formData // supabase da JSONB column bo'lsa yaxshi
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
    <div className="page-container" style={{ padding: '20px', overflowY: 'auto' }}>
      <div className="glass-panel content-box" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isUz ? "«MENING QIZIQISHLARIM VA KELAJAKDAGI KASBIM»" : "«МОИ ИНТЕРЕСЫ И БУДУЩАЯ ПРОФЕССИЯ»"}
        </h2>
        <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>
          {isUz ? "Ko‘rsatma: Savollarga o‘zingizning haqiqiy fikringiz asosida javob bering. To‘g‘ri yoki noto‘g‘ri javob yo‘q." : "Инструкция: Отвечайте на вопросы искренне, основываясь на своем собственном мнении. Здесь нет правильных или неправильных ответов."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Q1 */}
          <div>
            <h4>{isUz ? "1. Maktabda qaysi fanlarni o‘rganish sizga ko‘proq yoqadi?" : "1. Изучение каких предметов в школе вам нравится больше всего?"}</h4>
            <div className="grid-2col">
              {["Matematika", "Ona tili va adabiyot", "Tarix", "Chet tili", "Informatika", "Biologiya", "Kimyo", "Fizika", "Musiqa", "Tasviriy san’at", "Jismoniy tarbiya"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q1.includes(opt)} onChange={() => handleCheck('q1', opt)} /> {opt}</label>
              ))}
            </div>
            <input name="q1Other" value={formData.q1Other} onChange={handleChange} placeholder={isUz ? "Boshqa..." : "Другое..."} className="input-field" style={{ marginTop: '10px' }} />
          </div>

          {/* Q2 */}
          <div>
            <h4>{isUz ? "2. Bo‘sh vaqtingizda nimalar bilan shug‘ullanishni yoqtirasiz?" : "2. Чем вы любите заниматься в свободное время?"}</h4>
            <div className="grid-2col">
              {["Kitob o‘qish", "Sport", "Rasm chizish", "Qo‘shiq aytish / cholg‘u", "Kompyuter va IT", "Video / montaj / dizayn", "Tabiat va hayvonlar", "Pazandachilik / hunar"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q2.includes(opt)} onChange={() => handleCheck('q2', opt)} /> {opt}</label>
              ))}
            </div>
            <input name="q2Other" value={formData.q2Other} onChange={handleChange} placeholder={isUz ? "Boshqa..." : "Другое..."} className="input-field" style={{ marginTop: '10px' }} />
          </div>

          {/* Q3 */}
          <div>
            <h4>{isUz ? "3. O‘zingizda qaysi qobiliyat kuchliroq deb o‘ylaysiz?" : "3. Какая способность, по вашему мнению, у вас развита сильнее?"}</h4>
            <div className="grid-2col">
              {["Hisoblash va mantiq", "Chiroyli gapirish", "Rasm / chizma chizish", "Texnika va kompyuter", "Musiqa va ijod", "Sport", "Tashkilotchilik", "Tinglash va yordam", "Hali bilmayman"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q3.includes(opt)} onChange={() => handleCheck('q3', opt)} /> {opt}</label>
              ))}
            </div>
          </div>

          {/* Q4 */}
          <div>
            <h4>{isUz ? "4. Yangi narsani o‘rganishda qaysi usul sizga ko‘proq yoqadi?" : "4. Какой способ изучения нового вам нравится больше всего?"}</h4>
            <div className="grid-2col">
              {["O‘qib o‘rganish", "Amalda bajarib ko‘rish", "Video orqali", "Ustozdan so‘rab", "Do‘stlar bilan birgalikda", "Tajriba qilib ko‘rish"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q4.includes(opt)} onChange={() => handleCheck('q4', opt)} /> {opt}</label>
              ))}
            </div>
          </div>

          {/* Q5 */}
          <div>
            <h4>{isUz ? "5. Quyidagi faoliyatlardan qaysi biri sizga eng qiziq?" : "5. Какая из следующих сфер деятельности вам наиболее интересна?"}</h4>
            <div className="grid-2col">
              {["Kompyuter / IT", "Tibbiyot", "Texnika va muhandislik", "San’at va ijod", "Sport", "Ta’lim va pedagogika", "Huquq va davlat xizmati", "Biznes va tadbirkorlik", "Tabiat va ekologiya", "Media / jurnalistika"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q5.includes(opt)} onChange={() => handleCheck('q5', opt)} /> {opt}</label>
              ))}
            </div>
          </div>

          {/* Q6 */}
          <div>
            <h4>{isUz ? "6. Kelajakda qaysi kasb yoki kasblarga qiziqasiz?" : "6. Какими профессиями вы интересуетесь в будущем?"}</h4>
            <input name="q6_1" value={formData.q6_1} onChange={handleChange} className="input-field" placeholder="1..." style={{ marginBottom: '5px' }} />
            <input name="q6_2" value={formData.q6_2} onChange={handleChange} className="input-field" placeholder="2..." style={{ marginBottom: '5px' }} />
            <input name="q6_3" value={formData.q6_3} onChange={handleChange} className="input-field" placeholder="3..." />
          </div>

          {/* Q7 */}
          <div>
            <h4>{isUz ? "7. Bu kasbga qiziqishingizga nima sabab bo‘lgan?" : "7. Что стало причиной вашего интереса к этой профессии?"}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {["Bu kasb menga yoqadi", "Tanishim shu kasbda ishlaydi", "Bolaligimdan xohlayman", "Daromadi yaxshi deb o‘ylayman", "Odamlarga yordam berish", "Hali aniq bilmayman"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q7.includes(opt)} onChange={() => handleCheck('q7', opt)} /> {opt}</label>
              ))}
            </div>
            <input name="q7Other" value={formData.q7Other} onChange={handleChange} placeholder={isUz ? "Boshqa..." : "Другое..."} className="input-field" style={{ marginTop: '10px' }} />
          </div>

          {/* Q8 */}
          <div>
            <h4>{isUz ? "8. Siz ko‘proq qanday ishni bajarishni xohlaysiz?" : "8. Какую работу вы бы предпочли выполнять?"}</h4>
            <div className="grid-2col">
              {["Odamlar bilan ishlash", "Kompyuter bilan ishlash", "Texnika va qurilmalar", "Hayvonlar va tabiat", "Bolalar bilan ishlash", "Ijodiy ishlar", "Mustaqil ishlash", "Jamoa bilan ishlash"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q8.includes(opt)} onChange={() => handleCheck('q8', opt)} /> {opt}</label>
              ))}
            </div>
          </div>

          {/* Q9 */}
          <div>
            <h4>{isUz ? "9. Qaysi to‘garak yoki klub sizni ko‘proq qiziqtiradi?" : "9. Какой кружок или клуб вас больше всего интересует?"}</h4>
            <div className="grid-2col">
              {["IT / robototexnika", "Xorijiy tillar", "Debat", "Sport", "Musiqa", "Teatr", "Rasm / dizayn", "Kitobxonlik", "Ekologiya"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q9.includes(opt)} onChange={() => handleCheck('q9', opt)} /> {opt}</label>
              ))}
            </div>
            <input name="q9Other" value={formData.q9Other} onChange={handleChange} placeholder={isUz ? "Boshqa..." : "Другое..."} className="input-field" style={{ marginTop: '10px' }} />
          </div>

          {/* Q10 */}
          <div>
            <h4>{isUz ? "10. Maktabda yangi to‘garak ochilsa, qaysi yo‘nalishda bo‘lishini xohlardingiz?" : "10. Если бы в школе открылся новый кружок, какое направление вы бы выбрали?"}</h4>
            <textarea name="q10" value={formData.q10} onChange={handleChange} className="input-field" rows="2"></textarea>
          </div>

          {/* Q11 */}
          <div>
            <h4>{isUz ? "11. O‘zingizni kelajakda qanday inson sifatida tasavvur qilasiz?" : "11. Кем вы представляете себя в будущем?"}</h4>
            <div className="grid-2col">
              {["Yaxshi mutaxassis", "Tadbirkor", "Olim", "Ijodkor", "Sportchi", "Rahbar", "O‘qituvchi"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q11.includes(opt)} onChange={() => handleCheck('q11', opt)} /> {opt}</label>
              ))}
            </div>
            <input name="q11Other" value={formData.q11Other} onChange={handleChange} placeholder={isUz ? "Boshqa..." : "Другое..."} className="input-field" style={{ marginTop: '10px' }} />
          </div>

          {/* Q12 */}
          <div>
            <h4>{isUz ? "12. Sizga kasb tanlashda kimning maslahati ko‘proq ta’sir qiladi?" : "12. Чей совет больше всего влияет на ваш выбор профессии?"}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {["Ota-onam", "O‘qituvchim", "Sinfdoshlarim / do‘stlarim", "Maktab maslahatchisi", "Psixolog", "O‘zim mustaqil tanlayman"].map(opt => (
                <label key={opt}><input type="checkbox" checked={formData.q12.includes(opt)} onChange={() => handleCheck('q12', opt)} /> {opt}</label>
              ))}
            </div>
            <input name="q12Other" value={formData.q12Other} onChange={handleChange} placeholder={isUz ? "Boshqa..." : "Другое..."} className="input-field" style={{ marginTop: '10px' }} />
          </div>

          {/* Q13 */}
          <div>
            <h4>{isUz ? "13. Kelajakdagi kasbingiz haqida ma’lumot olishni xohlaysizmi?" : "13. Хотите ли вы получить информацию о вашей будущей профессии?"}</h4>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              {["Ha", "Yo'q", "Hali o'ylab ko'rmaganman"].map(opt => (
                <label key={opt}><input type="radio" name="q13" value={opt} checked={formData.q13 === opt} onChange={handleChange} /> {opt}</label>
              ))}
            </div>
            <input name="q13Other" value={formData.q13Other} onChange={handleChange} placeholder={isUz ? "Agar «Ha» bo‘lsa, qaysi kasb haqida?" : "Если «Да», то о какой профессии?"} className="input-field" style={{ marginTop: '10px' }} />
          </div>

          {/* Q14 */}
          <div>
            <h4>{isUz ? "14. Siz maktab hayotini yaxshilash uchun qanday yangi g‘oya yoki tashabbus taklif qilgan bo‘lardingiz?" : "14. Какую новую идею или инициативу вы бы предложили для улучшения школьной жизни?"}</h4>
            <textarea name="q14" value={formData.q14} onChange={handleChange} className="input-field" rows="3"></textarea>
          </div>

          {/* Q15 */}
          <div>
            <h4>{isUz ? "15. O‘zingiz haqingizda biz bilishimiz kerak deb hisoblagan boshqa qiziqishingiz, qobiliyatingiz yoki orzuingiz bormi?" : "15. Есть ли другие интересы, способности или мечты, о которых нам следует знать?"}</h4>
            <textarea name="q15" value={formData.q15} onChange={handleChange} className="input-field" rows="3"></textarea>
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? '...' : (t.finishBtn || "Tugatish / Завершить")}
          </button>
        </form>
      </div>
    </div>
  );
}
