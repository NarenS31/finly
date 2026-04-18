import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ClassesDashboardClient } from '@/components/classes/classes-dashboard-client';

export default async function ClassesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  return <ClassesDashboardClient classes={classes ?? []} userId={user.id} />;
}
