import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("leads")
    .select("id, return_count, returned_at");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const total = data.length;

  const returnedUsers = data.filter((l) => l.returned_at !== null).length;

  const totalReturns = data.reduce(
    (sum, l) => sum + (l.return_count || 0),
    0
  );

  return Response.json({
    total_users: total,
    users_returned: returnedUsers,
    total_returns: totalReturns,
    avg_return_per_user:
      total > 0 ? (totalReturns / total).toFixed(2) : 0,
  });
}