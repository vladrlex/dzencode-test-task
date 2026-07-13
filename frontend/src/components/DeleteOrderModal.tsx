interface DeleteOrderModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteOrderModal({ onClose, onConfirm }: DeleteOrderModalProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '30px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#999' }}
        >
          ✕
        </button>
        <h4 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px' }}>Are you sure you want to delete this order?</h4>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 25px 0' }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 15px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: '8px 15px', borderRadius: '4px', border: 'none', backgroundColor: '#ef5350', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}