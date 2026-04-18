'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icons';

interface Member {
  user_id: string;
  display_name: string;
  xp: number;
  level: string;
  streak: number;
  lessons_completed: number;
  last_active: string | null;
}

interface TopicStat {
  topic: string;
  avg_completion: number;
}

interface Props {
  data: {
    class: { id: string; code: string; name: string; age_tier: string };
    member_count: number;
    members: Member[];
    topic_stats: TopicStat[];
  };
}

export function ClassDetailClient({ data }: Props) {
  const [sortBy, setSortBy] = useState<'xp' | 'lessons' | 'streak' | 'name'>('xp');
  const { class: cls, members, topic_stats, member_count } = data;

  const sorted = [...members].sort((a, b) => {
    if (sortBy === 'xp') return b.xp - a.xp;
    if (sortBy === 'lessons') return b.lessons_completed - a.lessons_completed;
    if (sortBy === 'streak') return b.streak - a.streak;
    return a.display_name.localeCompare(b.display_name);
  });

  const avgXp = members.length
    ? Math.round(members.reduce((s, m) => s + m.xp, 0) / members.length)
    : 0;
  const avgLessons = members.length
    ? Math.round(members.reduce((s, m) => s + m.lessons_completed, 0) / members.length)
    : 0;
  const activeToday = members.filter(m =>
    m.last_active === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Back */}
      <Link href="/classes" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--gray-500)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '24px' }}>
        <Icon.Arrow style={{ width: '14px', height: '14px', transform: 'rotate(180deg)' }} />
        All classes
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.6px', margin: 0 }}>
            {cls.name}
          </h1>
          <div style={{
            background: 'var(--black)', color: '#fff',
            fontFamily: 'monospace', fontSize: '14px', fontWeight: 700,
            letterSpacing: '1.5px', padding: '4px 10px', borderRadius: '6px',
          }}>
            {cls.code}
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--gray-400)', margin: 0 }}>
          Ages {cls.age_tier} · {member_count} student{member_count !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Students', value: member_count },
          { label: 'Avg XP', value: avgXp },
          { label: 'Avg lessons', value: avgLessons },
          { label: 'Active today', value: activeToday },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--green)', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gray-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Full student table */}
      {members.length > 0 ? (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>All students</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['xp', 'lessons', 'streak', 'name'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                    border: '1px solid',
                    borderColor: sortBy === s ? 'var(--green)' : 'var(--border)',
                    background: sortBy === s ? 'var(--green-bg)' : 'transparent',
                    color: sortBy === s ? 'var(--green-deeper)' : 'var(--gray-500)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {s === 'xp' ? 'XP' : s === 'lessons' ? 'Lessons' : s === 'streak' ? 'Streak' : 'Name'}
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                {['Student', 'Level', 'Lessons', 'XP', 'Streak', 'Last active'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((member, i) => (
                <tr key={member.user_id} style={{ borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--black)' }}>
                    {member.display_name}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '11px', padding: '2px 8px',
                      background: 'var(--level-bg)', color: 'var(--level-text)',
                      borderRadius: '4px', fontWeight: 600,
                      border: '1px solid var(--level-border)',
                    }}>
                      {member.level}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--gray-700)' }}>{member.lessons_completed}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '12px', padding: '2px 10px',
                      background: 'var(--xp-bg)', color: 'var(--xp-text)',
                      borderRadius: '4px', fontWeight: 700,
                      border: '1px solid var(--xp-border)',
                    }}>
                      {member.xp} XP
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--gray-700)' }}>
                    {member.streak > 0 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon.Flame style={{ width: '14px', height: '14px' }} />
                        {member.streak}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--gray-400)', fontSize: '13px' }}>
                    {member.last_active
                      ? new Date(member.last_active).toLocaleDateString()
                      : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 40px' }}>
          <Icon.Globe style={{ width: '48px', height: '48px', color: 'var(--gray-300)', marginBottom: '16px' }} />
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--black)', marginBottom: '6px' }}>No students yet</div>
          <div style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '16px' }}>
            Share your class code <strong>{cls.code}</strong> to get started
          </div>
          <button
            className="btn-outline"
            style={{ fontSize: '13px' }}
            onClick={() => navigator.clipboard.writeText(`Join my Finly class with code: ${cls.code} at ${typeof window !== 'undefined' ? window.location.origin : 'finly.app'}/join`)}
          >
            Copy join link
          </button>
        </div>
      )}
    </div>
  );
}
