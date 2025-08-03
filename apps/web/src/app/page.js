'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardCozy } from '../components/ui/cozy/CardCozy';
import { IconCozy } from '../components/ui/cozy/IconCozy';

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Siempre redirigir al dashboard anónimo
    router.replace('/home');
  }, [router]);

  // Loading cozy mientras se hace la redirección
  return (
    <div className="min-h-screen bg-gradient-to-br from-cozy-cream to-cozy-mint flex items-center justify-center">
      <CardCozy variant="dreamy" className="p-12">
        <div className="flex flex-col items-center space-y-4">
          <IconCozy name="loading" size="lg" className="text-cozy-sage animate-spin" />
          <p className="text-cozy-medium-gray font-nunito">Iniciando NextRead...</p>
        </div>
      </CardCozy>
    </div>
  );
}
