export const BASE_URL = "https://k8s.mectest.ru/test-app";
const TOKEN = "7aa32044-6380-4547-817a-245842817f5a";

export async function apiFetch(path: string, options?: { method?: string; params?: Record<string, any> }) {
  const url = new URL(`${BASE_URL}${path}`);
  
  if (options?.params) {
    Object.keys(options.params).forEach(key => {
      if (options.params![key] !== undefined) url.searchParams.append(key, options.params![key]);
    });
  }

  const res = await fetch(url.toString(), {
    method: options?.method || 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error("Ошибка запроса");

  return res.json();
}