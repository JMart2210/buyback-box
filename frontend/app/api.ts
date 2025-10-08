import { API_BASE_URL } from './config';

export async function getItems(owner_name: string, status?: string) {
  const url = new URL(`${API_BASE_URL}/get-items`);
  url.searchParams.set('owner_name', owner_name);
  if (status) url.searchParams.set('status', status);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ items: any[] }>;
}

export async function deleteItem(item_id: string) {
  const url = new URL(`${API_BASE_URL}/delete-item`);
  url.searchParams.set('item_id', item_id);
  const res = await fetch(url.toString(), { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function redeemItem(item_id: string, redeemed_by: string) {
  const res = await fetch(`${API_BASE_URL}/redeem-item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id, redeemed_by }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
