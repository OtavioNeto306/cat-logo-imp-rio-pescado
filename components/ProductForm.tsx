
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';

interface ProductFormProps {
  product: Product | null;
  categories: Category[]; // Now includes all categories (active/inactive)
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Product>({
    code: '',
    name: '',
    description: '',
    category: categories[0]?.slug || '',
    images: [],
    isActive: true, // Default to active for new products
  });
  
  const [imageText, setImageText] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImageText(product.images.join('\n'));
    } else {
        // Reset form data for new product creation if product prop is null
        setFormData({
            code: '',
            name: '',
            description: '',
            category: categories[0]?.slug || '',
            images: [],
            isActive: true,
        });
        setImageText('');
    }
  }, [product, categories]);

  // Fix: Safely access 'checked' property by checking element type
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const type = e.target.type;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setImageText(e.target.value);
      const imageUrls = e.target.value.split('\n').map(url => url.trim()).filter(url => url);
      setFormData(prev => ({ ...prev, images: imageUrls }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.category) {
        alert('Código, Nome e Categoria são campos obrigatórios.');
        return;
    }
    onSubmit(formData);
  };
  
  const isEditing = !!product;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold font-display text-primary mb-6">{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Código do Produto (SKU)
                    </label>
                    <input
                        type="text"
                        name="code"
                        id="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        disabled={isEditing}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Ex: SOC-005"
                    />
                     {isEditing && <p className="text-xs text-gray-500 mt-1">O código não pode ser alterado na edição.</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome do Produto
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                        placeholder="Ex: Camisa Polo Premium"
                    />
                </div>
                
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Categoria
                    </label>
                    <select
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
                    >
                        {categories.map(cat => (
                            <option key={cat.slug} value={cat.slug}>{cat.name} {cat.isActive ? '' : '(Inativa)'}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                        placeholder="Descreva os detalhes do produto..."
                    />
                </div>
                
                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                        Links das Imagens
                    </label>
                     <textarea
                        name="images"
                        id="images"
                        rows={4}
                        value={imageText}
                        onChange={handleImageChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm font-mono"
                        placeholder="Cole um link por linha. Links do Google Drive são aceitos."
                    />
                    <p className="text-xs text-gray-500 mt-1">Cole um link de imagem por linha. A primeira imagem será a principal.</p>
                </div>

                <div className="flex items-center">
                    <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Produto Ativo (Visível no Catálogo)
                    </label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                     <button
                        type="submit"
                        className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Salvar Produto
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ProductForm;
