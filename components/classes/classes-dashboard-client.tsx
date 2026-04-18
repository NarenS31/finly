'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Icon } from '@/components/ui/icons';
import Link from 'next/link';

interface Class {
  id: string;
  code: string;
  name: string;
  age_tier: string;
  created_at: string;
}

interface Props {
  classes: Class[];
  userId: string;
}

export function ClassesDashboardClient({ classes: initialClasses, userId }: Props) {
  const supabase = createClient();
  const [classes, setClasses] = useState(initialClasses);
  const [creating, setCreating] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassTier, setNewClassTier] = useState<'8-12' | '13-17'>('13-17');
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const createClass = async () => {
    if (!newClassName.trim()) return;
    setCreating(true);

    const { data: code } = await supabase.rpc('generate_class_code');

    const { data: newClass, error } = await supabase
      .from('classes')
      .insert({
        name: newClassName.trim(),
        age_tier: newClassTier,
        teacher_id: userId,
        code,
      })
      .select()
      .single();

    if (!error && newClass) {
      setClasses(prev => [newClass, ...prev]);
      setNewClassName('');
      setShowForm(false);
    }
    setCreating(false);
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(
      `Join my Finly class using code: ${code} at ${typeof window !== 'undefined' ? window.location.origin : 'finly.app'}/join`
    );
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const archiveClass = async (classId: string) => {
    await supabase
      .from('classes')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', classId);
    setClasses(prev => prev.filter(c => c.id !== classId));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.8px', margin: 0 }}>
            Your classes
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', margin: '6px 0 0' }}>
            Create a class, share the code with your students, and track their progress.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Icon.BookOpen style={{ width: '16px', height: '16px' }} />
          New class
        </button>
      </div>

      {/* Create class form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px', border: '1.5px solid var(--green-border)', background: 'var(--green-bg)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--black)', margin: '0 0 16px' }}>
            Create a new class
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Class name
              </label>
              <input
                type="text"
                placeholder='e.g. "Period 3 Personal Finance"'
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createClass()}
                style={{
                  width: '100%', height: '44px',
                  border: '1.5px solid var(--border-strong)',
                  borderRadius: '10px', padding: '0 14px',
                  fontSize: '14px', fontFamily: 'inherit',
                  background: 'var(--white)', color: 'var(--black)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Age group
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['8-12', '13-17'] as const).map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setNewClassTier(tier)}
                    style={{
                      padding: '7px 16px', borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: newClassTier === tier ? 'var(--green)' : 'var(--border-strong)',
                      background: newClassTier === tier ? 'var(--white)' : 'transparent',
                      color: newClassTier === tier ? 'var(--green-deeper)' : 'var(--gray-500)',
                      fontSize: '13px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                    }}
                  >
                    Ages {tier}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                className="btn-primary"
                onClick={createClass}
                disabled={creating || !newClassName.trim()}
                style={{ flex: 1 }}
              >
                {creating ? 'Creating...' : 'Create class'}
              </button>
              <button
                className="btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {classes.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <Icon.BookOpen style={{ width: '48px', height: '48px', color: 'var(--gray-300)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--black)', margin: '0 0 8px' }}>
            No classes yet
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--gray-400)', margin: '0 0 20px' }}>
            Create a class and share the code with your students.
          </p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Create your first class
          </button>
        </div>
      )}

      {/* Class list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {classes.map(cls => (
          <div key={cls.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            {/* Code badge */}
            <div style={{
              background: 'var(--black)', color: '#fff',
              borderRadius: '10px', padding: '10px 14px',
              fontFamily: 'monospace', fontSize: '18px', fontWeight: 700,
              letterSpacing: '2px', flexShrink: 0,
              minWidth: '80px', textAlign: 'center',
            }}>
              {cls.code}
            </div>

            {/* Class info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--black)', marginBottom: '3px' }}>
                {cls.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-400)', fontWeight: 500 }}>
                Ages {cls.age_tier} · Created {new Date(cls.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                className="btn-outline"
                onClick={() => copyCode(cls.code)}
                title="Copy join link"
                style={{ fontSize: '13px', padding: '7px 14px' }}
              >
                {copiedCode === cls.code ? '✓ Copied' : 'Copy code'}
              </button>
              <Link href={`/classes/${cls.id}`}>
                <button className="btn-primary" style={{ padding: '7px 16px', fontSize: '13px' }}>
                  View progress
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      {classes.length > 0 && (
        <div style={{
          marginTop: '40px', padding: '20px',
          background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>How to share</div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Copy your class code using the button above',
              `Tell students to go to ${typeof window !== 'undefined' ? window.location.origin : 'finly.app'}/join`,
              'Students enter the code and their progress will appear in your dashboard',
            ].map((step, i) => (
              <li key={i} style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.5' }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
