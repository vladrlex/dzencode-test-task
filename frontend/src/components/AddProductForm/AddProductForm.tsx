import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addProductServer } from '../../store/productsSlice';
import './AddProductForm.css';

interface AddProductFormProps {
  orderId: number;
  onClose: () => void;
}

export default function AddProductForm({ orderId, onClose }: AddProductFormProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    serialNumber: '',
    priceUsd: '',
    priceUah: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      title: formData.title,
      type: formData.type,
      serialNumber: Number(formData.serialNumber),
      order: orderId,
      price: [
        { value: Number(formData.priceUsd), symbol: 'USD', isDefault: 0 },
        { value: Number(formData.priceUah), symbol: 'UAH', isDefault: 1 }
      ],
      isNew: 1,
      date: new Date().toISOString(),
      photo: 'pathToFile.jpg',
      specification: 'Standard',
      guarantee: { start: new Date().toISOString(), end: new Date().toISOString() }
    };

    try {
      await dispatch(addProductServer(newProduct)).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <div className="add-product-form__group">
        <label>Product Title</label>
        <input type="text" placeholder="e.g. Monitor" required onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      </div>
      
      <div className="add-product-form__group">
        <label>Type</label>
        <input type="text" placeholder="e.g. Monitors" required onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
      </div>
      
      <div className="add-product-form__group">
        <label>Serial Number</label>
        <input type="number" placeholder="e.g. 12345" required onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} />
      </div>
      
      <div className="add-product-form__group">
        <label>Price USD</label>
        <input type="number" placeholder="e.g. 100" required onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })} />
      </div>
      
      <div className="add-product-form__group">
        <label>Price UAH</label>
        <input type="number" placeholder="e.g. 2600" required onChange={(e) => setFormData({ ...formData, priceUah: e.target.value })} />
      </div>

      <button type="submit" className="add-product-form__submit">Save Product</button>
    </form>
  );
}