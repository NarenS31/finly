import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";

interface LeaderEntry {
  id: string;
  display_name: string;
  xp: number;
  level: string;
  streak_current: number;
}

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: top } = await supabase
    .from("profiles")
    .select("id, display_name, xp, level, streak_current")
    .order("xp", { ascending: false })
    .limit(50);

  const leaders: LeaderEntry[] = top ?? [];
  const myId = auth.user?.id;

  const medalEmoji = ["🥇", "🥈", "🥉"];

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--green)]">Hall of Fame</p>
        <h1 className="mt-2 text-4xl font-extrabold text-[var(--black)]">Leaderboard</h1>
        <p className="mt-2 text-[var(--gray-500)]">Top learners ranked by total XP — keep grinding!</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--white)] shadow-[var(--shadow-md)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--gray-50)]">
              <th className="px-4 py-3 text-left font-semibold text-[var(--gray-500)]">#</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--gray-500)]">Student</th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--gray-500)]">XP</th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--gray-500)]">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {leaders.map((leader, i) => {
              const isMe = leader.id === myId;
              return (
                <tr
                  key={leader.id}
                  className={`transition-colors ${isMe ? "bg-[var(--green-bg)]" : "hover:bg-[var(--gray-50)]"}`}
                >
                  <td className="px-4 py-3 font-bold text-[var(--gray-700)]">
                    {i < 3 ? <span>{medalEmoji[i]}</span> : <span className="text-[var(--gray-400)]">{i + 1}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={leader.display_name} size="sm" />
                      <div>
                        <p className={`font-semibold ${isMe ? "text-[var(--green-deeper)]" : "text-[var(--black)]"}`}>
                          {leader.display_name}
                          {isMe && <span className="ml-2 text-xs font-normal text-[var(--green)]">(you)</span>}
                        </p>
                        <p className="text-xs text-[var(--gray-500)]">{leader.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--black)]">
                    {leader.xp.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {leader.streak_current > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                        🔥 {leader.streak_current}
                      </span>
                    ) : (
                      <span className="text-[var(--gray-400)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!myId && (
          <div className="border-t border-[var(--border)] bg-[var(--gray-50)] px-4 py-3 text-center text-sm text-[var(--gray-500)]">
            <a href="/auth/signup" className="font-semibold text-[var(--green)] underline-offset-2 hover:underline">
              Create a free account
            </a>{" "}
            to appear on the leaderboard
          </div>
        )}
      </div>
    </div>
  );
}
