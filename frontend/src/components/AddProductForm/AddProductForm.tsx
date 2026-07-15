import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addProductServer, updateProductServer, type Product } from '../../store/productsSlice';
import './AddProductForm.css';

interface AddProductFormProps {
  orderId: number;
  onClose: () => void;
  productToEdit?: Product | null;
}

export default function AddProductForm({ orderId, onClose, productToEdit }: AddProductFormProps) {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    title: productToEdit?.title || '',
    type: productToEdit?.type || '',
    serialNumber: productToEdit?.serialNumber || '',
    priceUsd: productToEdit?.price.find(p => p.symbol === 'USD')?.value || '',
    priceUah: productToEdit?.price.find(p => p.symbol === 'UAH')?.value || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title: formData.title,
      type: formData.type,
      serialNumber: Number(formData.serialNumber),
      order: orderId,
      price: [
        { value: Number(formData.priceUsd), symbol: 'USD', isDefault: 0 },
        { value: Number(formData.priceUah), symbol: 'UAH', isDefault: 1 }
      ],
      isNew: productToEdit ? productToEdit.isNew : 1,
      date: productToEdit ? productToEdit.date : new Date().toISOString(),
      photo: productToEdit ? productToEdit.photo : 'pathToFile.jpg',
      specification: productToEdit ? productToEdit.specification : 'Standard',
      guarantee: productToEdit ? productToEdit.guarantee : { start: new Date().toISOString(), end: new Date().toISOString() }
    };

    try {
      if (productToEdit) {
        await dispatch(updateProductServer({ ...productData, id: productToEdit.id } as Product)).unwrap();
      } else {
        await dispatch(addProductServer(productData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
        {productToEdit ? 'Edit Product' : 'Add New Product'}
      </h2>

     <div className="add-product-form__group">
        <label>Product Title</label>
        <input type="text" minLength={3} value={formData.title} placeholder="e.g. Monitor" required onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      </div>
      
      <div className="add-product-form__group">
        <label>Type</label>
        <input type="text" value={formData.type} placeholder="e.g. Monitors" required onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
      </div>
      
      <div className="add-product-form__group">
        <label>Serial Number</label>
        <input type="number" min="1" value={formData.serialNumber} placeholder="e.g. 12345" required onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} />
      </div>
      
      <div className="add-product-form__group">
        <label>Price USD</label>
        <input type="number" min="0" step="0.01" value={formData.priceUsd} placeholder="e.g. 100" required onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })} />
      </div>
      
      <div className="add-product-form__group">
        <label>Price UAH</label>
        <input type="number" min="0" step="0.01" value={formData.priceUah} placeholder="e.g. 2600" required onChange={(e) => setFormData({ ...formData, priceUah: e.target.value })} />
      </div>

      <button type="submit" className="add-product-form__submit">
        {productToEdit ? 'Update Product' : 'Save Product'}
      </button>
    </form>
  );
}