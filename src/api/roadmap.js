const API_BASE = '/api'; 
// ⚠️ 注意：用相对路径，走 nginx，不要写域名

export async function fetchRoadmapProgress({ roadmapId, userId }) {
  const res = await fetch(
    `${API_BASE}/roadmaps/${roadmapId}/progress?user_id=${userId}`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new Error('fetch progress failed');
  return res.json();
}

export async function markItemDone({ roadmapId, nodeId, itemId, userId }) {
  const res = await fetch(
    `${API_BASE}/roadmaps/${roadmapId}/nodes/${nodeId}/items/${itemId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    }
  );
  if (!res.ok) throw new Error('mark done failed');
  return res.json();
}

export async function unmarkItemDone({ roadmapId, nodeId, itemId, userId }) {
  const res = await fetch(
    `${API_BASE}/roadmaps/${roadmapId}/nodes/${nodeId}/items/${itemId}?user_id=${userId}`,
    { method: 'DELETE' }
  );
  if (!res.ok) throw new Error('unmark done failed');
  return res.json();
}