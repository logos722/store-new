'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useNavProgress } from '@/context/nav/nav-progress';

function RouteListenerInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  const { stop } = useNavProgress();

  useEffect(() => {
    stop();
  }, [pathname, search, stop]);

  return null;
}

export default function RouteListener() {
  return (
    <Suspense fallback={null}>
      <RouteListenerInner />
    </Suspense>
  );
}
