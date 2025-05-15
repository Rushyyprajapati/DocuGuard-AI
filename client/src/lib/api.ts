const BASE_URL = 'http://127.0.0.1:8000';

export const summarize = async (text: string) => {
  const res = await fetch(`${BASE_URL}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

export const classify = async (text: string) => {
  const res = await fetch(`${BASE_URL}/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

export const ner = async (text: string) => {
  const res = await fetch(`${BASE_URL}/ner`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

export const ask = async (text: string, question: string) => {
  const res = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, question }),
  });
  return res.json();
};
