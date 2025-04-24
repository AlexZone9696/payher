import { useState } from 'react';

export default function Wallet() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('TON');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError('');

    const res = await fetch('/api/get-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    });

    const data = await res.json();
    if (res.ok) setResult(data);
    else setError(data.error);
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Пополнение кошелька</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="TON">TON</option>
          <option value="USDT">USDT</option>
          <option value="BTC">BTC</option>
        </select>
        <button type="submit">Получить адрес</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <p>Переведите <strong>{result.amount} {result.currency}</strong> на:</p>
          <p><strong>{result.address}</strong></p>
          <p>Комментарий: <strong>{result.comment}</strong></p>
        </div>
      )}
    </div>
  );
}
