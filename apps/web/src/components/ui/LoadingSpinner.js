import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="animate-spin w-6 h-6 text-gray-500 mb-2" />
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  );
}
