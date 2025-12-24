const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  get: (url: string) =>
    fetch(`${API_URL}${url}`).then(r => r.json()),

  post: (url: string, body: any) =>
    fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json()),
};
