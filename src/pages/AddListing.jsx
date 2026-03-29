import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader, X } from 'lucide-react';
import { createListing, uploadListingPhotos } from '../api/listings';
import { CATEGORIES } from '../data/listings';
import { toast } from 'sonner';

export default function AddListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const isValid = form.title && form.description && form.price && form.category;

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
    e.target.value = '';
  };

  const removePhoto = (i) => setPhotos((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setLoading(true);
    try {
      const listing = await createListing({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        emoji: '-',
      });
      if (photos.length > 0) {
        await uploadListingPhotos(listing.id, photos);
      }
      toast.success('Объявление опубликовано!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle size={22} style={{ color: 'var(--primary)' }} />
        <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Новое объявление</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Название</label>
          <input type="text" required value={form.title} onChange={set('title')}
            placeholder="Что продаёте?" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Описание</label>
          <textarea required value={form.description} onChange={set('description')}
            placeholder="Опишите товар подробнее..." rows={3}
            className="input-field resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Цена (₸)</label>
          <input type="number" required min={0} value={form.price} onChange={set('price')}
            placeholder="0" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Категория</label>
          <select required value={form.category} onChange={set('category')} className="input-field">
            <option value="">Выберите категорию</option>
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            Фото <span className="text-gray-400 font-normal">(до 5 штук)</span>
          </label>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
          <div className="flex flex-wrap gap-2">
            {photos.map((file, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePhoto(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white">
                  <X size={11} />
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center text-2xl font-light"
                style={{ borderColor: 'var(--border)', color: 'var(--border)' }}>
                +
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', color: 'var(--accent)' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={!isValid || loading}
          className="btn-primary w-full font-medium py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <><Loader size={16} className="animate-spin" /> Публикация...</> : 'Опубликовать объявление'}
        </button>
      </form>
    </div>
  );
}
