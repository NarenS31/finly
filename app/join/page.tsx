'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FinlyLogo } from '@/components/layout/finly-logo';
import { Button } from '@/components/ui/button';

function JoinFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code')?.toUpperCase() ?? '');
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const supabase = createClient();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setState('loading');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Store code in sessionStorage, redirect to signup
      sessionStorage.setItem('pendingClassCode', code);
      router.push(`/auth/signup?redirect=/join&code=${code}`);
      return;
    }

    // Find class by code
    const { data: cls, error: clsError } = await supabase
      .from('classes')
      .select('id, name, age_tier')
      .eq('code', code.toUpperCase())
      .is('archived_at', null)
      .single();

    if (clsError || !cls) {
      setState('error');
      setErrorMsg('Class not found. Check the code and try again.');
      return;
    }

    // Join class
    const { error: joinError } = await supabase
      .from('class_members')
      .insert({ class_id: cls.id, user_id: user.id });

    if (joinError && !joinError.message.includes('duplicate')) {
      setState('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }

    // Redirect to learn
    router.push('/learn?joined=true');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--white)', padding: '24px',
    }}>
      <div style={{ marginBottom: '40px' }}>
        <FinlyLogo />
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
          Join a class
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--gray-500)', margin: '0 0 28px', lineHeight: '1.6' }}>
          Enter the 6-character code your teacher shared with you.
        </p>

        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Class code
            </label>
            <input
              type="text"
              value={code}
              onChange={e => {
                setCode(e.target.value.toUpperCase().slice(0, 6));
                setState('idle');
              }}
              placeholder="e.g. FIN42X"
              maxLength={6}
              style={{
                width: '100%', height: '56px',
                border: `2px solid ${state === 'error' ? '#ef4444' : code.length === 6 ? 'var(--green)' : 'var(--border-strong)'}`,
                borderRadius: '12px', padding: '0 16px',
                fontSize: '22px', fontWeight: 800, fontFamily: 'monospace',
                letterSpacing: '4px', textAlign: 'center',
                color: 'var(--black)', background: 'var(--white)',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
            />
          </div>

          {state === 'error' && (
            <p style={{ fontSize: '13px', color: '#ef4444', margin: 0 }}>{errorMsg}</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={code.length !== 6 || state === 'loading'}
            style={{ height: '48px', width: '100%', opacity: code.length !== 6 ? 0.5 : 1 }}
          >
            {state === 'loading' ? 'Joining...' : 'Join class'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: 'var(--gray-400)', textAlign: 'center', marginTop: '20px', marginBottom: 0 }}>
          <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
            <span style={{ fontSize: '13px', color: 'var(--gray-400)', marginRight: 8 }}>
              Don't have a code?
            </span>
            <Button asChild className="bg-black text-white font-bold px-4 py-2 rounded-lg inline-block" style={{ fontSize: 13, height: 'auto', minHeight: 0, lineHeight: 1.2 }}>
              <a href="/learn" className="!text-white">Browse lessons anyway →</a>
            </Button>
          </div>
        </p>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinFormContent />
    </Suspense>
  );
}
