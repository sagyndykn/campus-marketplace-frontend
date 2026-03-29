import { Heart } from 'lucide-react';

export default function Wishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <Heart size={48} className="mb-4" style={{ color: '#d1d5db' }} />
      <p className="text-lg font-semibold" style={{ color: '#082673' }}>Вишлист</p>
    </div>
  );
}
