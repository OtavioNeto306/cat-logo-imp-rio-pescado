import React, { useState, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product, Category } from '../types';
import ProductForm from '../components/ProductForm';
import { Link } from 'react-router-dom';
import { DataManager } from '../utils/dataManager';

const CategoryForm: React.FC<{
    category?: Category | null;
    onSubmit: (data: { name: string, imageUrl: string }) => void;
    onCancel: () => void;
}> = ({ category, onSubmit, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    const [imageUrl, setImageUrl] = useState(category?.imageUrl || '');
    const isEditing = !!category;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('O nome da categoria é obrigatório.');
            return;
        }
        onSubmit({ name, imageUrl });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg text-primary">{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Nome da Categoria</label>
                <input
                    id="categoryName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                    placeholder="Ex: Pescados"
                    required
                />
            </div>
            <div>
                <label htmlFor="categoryImageUrl" className="block text-sm font-medium text-gray-700">URL da Imagem de Capa</label>
                <input
                    id="categoryImageUrl"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                    placeholder="https://exemplo.com/imagem.jpg"
                />
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
                <button type="submit" className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Salvar Categoria</button>
            </div>
        </form>
    );
};


const CategoryManager: React.FC<{
    categories: Category[]; // These are all categories, active or not
    addCategory: (category: Omit<Category, 'slug'>) => boolean;
    updateCategory: (slug: string, data: { name: string; imageUrl: string }) => boolean;
    deleteCategory: (slug: string) => void;
    toggleCategoryActive: (slug: string) => void;
}> = ({ categories, addCategory, updateCategory, deleteCategory, toggleCategoryActive }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsFormVisible(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingCategory(null);
    };

    const handleSubmit = (data: { name: string; imageUrl: string }) => {
        let success = false;
        if (editingCategory) {
            success = updateCategory(editingCategory.slug, data);
        } else {
            success = addCategory({ name: data.name, imageUrl: data.imageUrl });
        }
        
        if (success) {
            handleCancel();
        }
    };

    const handleToggleActive = (category: Category) => {
        if (window.confirm(`Tem certeza que deseja ${category.isActive ? 'INATIVAR' : 'ATIVAR'} a categoria "${category.name}" e todos os produtos associados?`)) {
            toggleCategoryActive(category.slug);
        }
    };


    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-display text-primary">Categorias</h2>
                {!isFormVisible && (
                     <button
                        onClick={handleAddNew}
                        className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-sm"
                    >
                        + Adicionar Categoria
                    </button>
                )}
            </div>
            
            {isFormVisible && (
                <CategoryForm
                    category={editingCategory}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}

            <div className="bg-white p-2 rounded-lg shadow-sm overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <th className="px-5 py-3">Categoria</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? categories.map(cat => (
                            <tr key={cat.slug} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm">
                                    <div className="flex items-center">
                                        <img src={cat.imageUrl || `https://via.placeholder.com/100x100.png/F9FAFB/111827?text=${encodeURIComponent(cat.name.charAt(0))}`} alt={cat.name} className="w-10 h-10 rounded-md object-cover mr-4 bg-gray-100" />
                                        <div>
                                            <p className="font-medium text-gray-900">{cat.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{cat.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {cat.isActive ? 'Ativa' : 'Inativa'}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-sm text-right">
                                    <div className="flex items-center justify-end gap-4">
                                        <button onClick={() => handleToggleActive(cat)} 
                                                className={`font-medium text-sm ${cat.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                                                aria-label={`${cat.isActive ? 'Inativar' : 'Ativar'} categoria ${cat.name}`}>
                                            {cat.isActive ? 'Inativar' : 'Ativar'}
                                        </button>
                                        <button onClick={() => handleEdit(cat)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                                                aria-label={`Editar categoria ${cat.name}`}>Editar</button>
                                        <button onClick={() => deleteCategory(cat.slug)} className="text-red-600 hover:text-red-900 font-medium text-sm"
                                                aria-label={`Excluir categoria ${cat.name}`}>Excluir</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-500">
                                    Nenhuma categoria cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const DataManagement: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    DataManager.downloadData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const success = await DataManager.loadFromFile(file);
      if (success) {
        alert('✅ Dados importados com sucesso! A página será recarregada.');
        window.location.reload();
      } else {
        alert('❌ Erro ao importar dados. Verifique se o arquivo está correto.');
      }
    } catch (error) {
      alert('❌ Erro ao processar arquivo. Verifique se é um arquivo JSON válido.');
    } finally {
      setIsImporting(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearData = () => {
    DataManager.clearAllData();
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
      <h3 className="font-semibold text-lg text-blue-800 mb-3">🔄 Gerenciamento de Dados</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          📥 Exportar Dados
        </button>
        
        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
        >
          {isImporting ? '⏳ Importando...' : '📤 Importar Dados'}
        </button>
        
        <button
          onClick={handleClearData}
          className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          🗑️ Limpar Tudo
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="mt-3 text-xs text-blue-600">
        <p><strong>💡 Dica:</strong> Use "Exportar" para fazer backup dos seus dados antes de fazer alterações importantes.</p>
        <p><strong>🚀 Para produção:</strong> Exporte os dados e commit no Git para deploy automático na Vercel.</p>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const { allProducts, allCategories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, toggleCategoryActive } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (code: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto? A ação não pode ser desfeita.')) {
      deleteProduct(code);
    }
  };

  const handleToggleActive = (product: Product) => {
    // Check if the product's category is active before allowing individual product toggle
    const productCategory = allCategories.find(cat => cat.slug === product.category);
    if (productCategory && !productCategory.isActive && !product.isActive) {
        alert(`Não é possível ativar este produto porque a categoria "${productCategory.name}" está inativa.`);
        return;
    }

    if (window.confirm(`Tem certeza que deseja ${product.isActive ? 'INATIVAR' : 'ATIVAR'} o produto "${product.name}"?`)) {
        updateProduct({ ...product, isActive: !product.isActive });
    }
  };


  const handleFormSubmit = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      if (allProducts.some(p => p.code === product.code)) {
        alert('Erro: O código do produto já existe. Por favor, use um código único.');
        return;
      }
      addProduct(product);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  }

  if (isFormOpen) {
    return <ProductForm 
            product={editingProduct} 
            categories={allCategories} // Pass all categories to the form
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
            <h1 className="text-3xl font-bold font-display text-primary">Painel de Administração</h1>
            <p className="text-gray-500 mt-1">Gerencie as categorias e produtos do seu catálogo.</p>
        </div>
        <Link to="/" className="text-sm text-accent hover:underline">← Voltar ao site</Link>
      </div>
      
      <DataManagement />
      
      <CategoryManager 
        categories={allCategories} // Pass all categories to category manager
        addCategory={addCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        toggleCategoryActive={toggleCategoryActive} // Pass new toggle function
      />

      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-display text-primary">Produtos</h2>
          <button
            onClick={handleAddNew}
            className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm"
          >
            + Adicionar Novo Produto
          </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Nome</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Status</th> {/* New column for Status */}
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.length > 0 ? allProducts.map(product => (
                <tr key={product.code} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm">
                    <p className="text-gray-900 font-mono">{product.code}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="text-gray-900">{product.name}</p>
                  </td>
                   <td className="px-5 py-4 text-sm">
                    <p className="text-gray-600">{allCategories.find(c => c.slug === product.category)?.name || product.category}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`font-medium text-sm ${product.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                          aria-label={`${product.isActive ? 'Inativar' : 'Ativar'} ${product.name}`}
                        >
                          {product.isActive ? 'Inativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                          aria-label={`Editar ${product.name}`}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.code)}
                          className="text-red-600 hover:text-red-900 font-medium"
                          aria-label={`Excluir ${product.name}`}
                        >
                          Excluir
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500"> {/* colspan increased */}
                        Nenhum produto cadastrado.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;