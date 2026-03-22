/**
 * Example: Buy Phantom Wallet Trending via PandaBoost API
 *
 * Duration options: 6h | 12h | 24h
 * Chain:           solana
 * Pricing:         $1,200 / 6h · $2,000 / 12h · $3,600 / 24h
 *
 * Docs: https://docs.pandaboost.app
 */

const BASE_URL = "https://web.pandaboost.app/api/v1";
const API_KEY = "pb_your_api_key_here"; // Get yours: t.me/pandaboosthelp

const headers = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
};

async function pandaboost(path, body = null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.success) throw new Error(`API error: ${data.error}`);
  return data.data;
}

(async () => {
  // ── 1. Check balance ──────────────────────────────────────────────────────
  const balance = await pandaboost("/balance");
  console.log(`Balance: $${balance.balance} ${balance.currency}`);

  // ── 2. Place a Phantom Wallet Trending order ───────────────────────────────
  const order = await pandaboost("/orders", {
    serviceName: "phantom-wallet-trending",
    orderTypeId: "24h",         // 6h | 12h | 24h
    quantity: 1,
    fields: {
      token_address: "ErKGCuxZeMQoS3VhFJZ77giESQphJhGpYDaUJmhApump",
      chain: "solana",
    },
  });

  const orderId = order.order.publicId;
  console.log(`Order placed: ${orderId} — status: ${order.order.status}`);
  console.log(`Amount charged: $${order.payment.amount}`);
  console.log(`New balance: $${order.newBalance}`);

  // ── 3. Check order status ─────────────────────────────────────────────────
  const status = await pandaboost(`/orders/${orderId}`);
  console.log(`\nOrder ${orderId}:`);
  console.log(`  Status:    ${status.status}`);
  console.log(`  Duration:  ${status.orderTypeName}`);
  console.log(`  Completed: ${status.completed}`);

  // ── 4. List recent orders ─────────────────────────────────────────────────
  const history = await pandaboost("/orders?page=1&limit=5");
  console.log(`\nRecent orders (${history.pagination.total} total):`);
  for (const o of history.orders) {
    console.log(`  [${o.publicId}] ${o.orderTypeName} — ${o.status}`);
  }
})();
