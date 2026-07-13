import { useState } from 'react';

interface OrderFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
}

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSubmit(newTitle, newDesc).then(() => {
      setNewTitle('');
      setNewDesc('');
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Title</label>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="e.g. New Shipment"
          required
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 2 }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Description</label>
        <input
          type="text"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="e.g. Dell Monitors"
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
        />
      </div>
      <button
        type="submit"
        style={{ padding: '9px 20px', backgroundColor: '#689f38', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Save
      </button>
    </form>
  );
}