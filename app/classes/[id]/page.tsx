import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ClassDetailClient } from '@/components/classes/class-detail-client';

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: dashboardData } = await supabase
    .rpc('get_class_dashboard', { p_class_id: params.id });

  if (!dashboardData) notFound();
  if (dashboardData.class.teacher_id !== user.id) redirect('/classes');

  return <ClassDetailClient data={dashboardData} />;
}
