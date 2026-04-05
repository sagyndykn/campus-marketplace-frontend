import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function ChatDialog() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <Link to="/chat" className="flex items-center gap-1 text-sm mb-6" style={{ color: '#082673' }}>
        <ChevronLeft size={16} /> Назад
      </Link>
    </div>
  );
}
