'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useNavProgress } from '@/context/nav/nav-progress';

export default function RouteListener() {
  const pathname = usePathname();
  const search = useSearchParams();
  const { stop } = useNavProgress();

  useEffect(() => {
    stop();
  }, [pathname, search, stop]);

  return null;
}
