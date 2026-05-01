import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: 'var(--bg-light)' }}
      >
        <Heart size={36} style={{ color: 'var(--primary)' }} strokeWidth={1.5} />
      </div>
      <p className="text-base font-semibold" style={{ color: 'var(--primary)' }}>
        У вас нет избранных объявлений
      </p>
      <p className="text-sm text-gray-400 mt-1.5 max-w-xs leading-relaxed">
        Свайпайте объявления вправо на главной, чтобы добавить их в избранное
      </p>
      <Link
        to="/"
        className="btn-primary mt-5 px-5 py-2 rounded-lg text-sm font-medium inline-block"
      >
        Перейти к объявлениям
      </Link>
    </div>
  );
}
