export const BASE_URL = "https://k8s.mectest.ru/test-app";
const TOKEN = "7aa32044-6380-4547-817a-245842817f5a";

export async function apiFetch(path: string, params?: Record<string, any>) {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) url.searchParams.append(key, params[key]);
    });
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error("Не удалось загрузить публикации");

  return res.json();
}