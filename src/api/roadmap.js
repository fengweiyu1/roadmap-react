// src/api/roadmap.js
const API_BASE = '/api'; // 走 nginx，同域相对路径

function enc(v) {
  return encodeURIComponent(String(v ?? ''));
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include', // ✅ 所有请求都带上（为 Ghost 登录态做准备）
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // 统一处理非 2xx
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[${method}] ${path} -> ${res.status} ${text}`);
  }

  // 兼容空响应
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

// ✅ whoami：前端启动先拿 user_id（现在你可以先返回 anon / api_test_user）
export function whoami() {
  return request(`/roadmap/whoami`, { method: 'GET' });
}

// ✅ 获取进度
export function fetchRoadmapProgress({ roadmapId, userId }) {
  return request(
    `/roadmaps/${enc(roadmapId)}/progress?user_id=${enc(userId)}`,
    { method: 'GET' }
  );
}

// ✅ 勾选完成（PUT）
export function markItemDone({ roadmapId, nodeId, itemId, userId }) {
  return request(
    `/roadmaps/${enc(roadmapId)}/nodes/${enc(nodeId)}/items/${enc(itemId)}`,
    {
      method: 'PUT',
      body: { user_id: userId }, // body 里放 user_id
    }
  );
}

// ✅ 取消完成（DELETE）
export function unmarkItemDone({ roadmapId, nodeId, itemId, userId }) {
  return request(
    `/roadmaps/${enc(roadmapId)}/nodes/${enc(nodeId)}/items/${enc(itemId)}?user_id=${enc(userId)}`,
    { method: 'DELETE' }
  );
}