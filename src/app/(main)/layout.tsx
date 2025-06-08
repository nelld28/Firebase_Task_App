import AppLayout from '@/components/layout/app-layout';
import type { PropsWithChildren } from 'react';

export default function MainAppLayout({ children }: PropsWithChildren) {
  return <AppLayout>{children}</AppLayout>;
}
