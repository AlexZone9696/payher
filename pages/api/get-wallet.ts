import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { amount, currency } = req.body;

  const merchant_id = process.env.NEXT_PUBLIC_MERCHANT_ID!;
  const secret_key = process.env.HELEKET_SECRET_KEY!;
  const order_id = 'order_' + Date.now();
  const comment = 'user_' + Math.floor(Math.random() * 10000);

  const data: Record<string, string> = {
    merchant_id,
    order_id,
    amount,
    currency,
    comment,
  };

  const sortedData = Object.fromEntries(Object.entries(data).sort());
  const signatureString = new URLSearchParams(sortedData).toString();
  const signature = crypto.createHmac('sha256', secret_key).update(signatureString).digest('hex');
  data['sign'] = signature;

  const formData = new URLSearchParams(data);

  const response = await fetch('https://api.heleket.com/payments/static-address', {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();

  if (json.data?.address) {
    res.status(200).json(json.data);
  } else {
    res.status(400).json({ error: json.message || 'Ошибка получения адреса' });
  }
}
