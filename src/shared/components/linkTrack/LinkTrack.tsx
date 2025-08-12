'use client';
import { useNavProgress } from '@/context/nav/nav-progress';
import Link, { LinkProps } from 'next/link';
import { MouseEvent, PropsWithChildren } from 'react';
type Props = PropsWithChildren<
  LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
>;

export function LinkTrack({ children, onClick, className, ...props }: Props) {
  const { start } = useNavProgress();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    ) {
      start(); // включаем глобальный лоадер
    }
  };

  return (
    <Link className={className} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
