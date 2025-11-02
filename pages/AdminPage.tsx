import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
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
    addCategory: (category: Category) => Promise<boolean>;
    updateCategory: (code: string, category: Category) => Promise<boolean>;
    deleteCategory: (code: string) => Promise<boolean>;
    toggleCategoryActive: (code: string) => Promise<boolean>;
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

    const handleSubmit = async (data: { name: string; imageUrl: string }) => {
        let success = false;
        if (editingCategory) {
            success = await updateCategory(editingCategory.code, {
                ...editingCategory,
                name: data.name,
                imageUrl: data.imageUrl
            });
        } else {
            const newCategory: Category = {
                code: data.name.toLowerCase().replace(/\s+/g, '-'),
                name: data.name,
                imageUrl: data.imageUrl,
                isActive: true
            };
            success = await addCategory(newCategory);
        }
        
        if (success) {
            handleCancel();
        } else {
            alert('❌ Erro ao salvar categoria. Tente novamente.');
        }
    };

    const handleToggleActive = async (category: Category) => {
        if (window.confirm(`Tem certeza que deseja ${category.isActive ? 'INATIVAR' : 'ATIVAR'} a categoria "${category.name}" e todos os produtos associados?`)) {
            const success = await toggleCategoryActive(category.code);
            if (!success) {
                alert('❌ Erro ao alterar status da categoria. Tente novamente.');
            }
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
                            <tr key={cat.code} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm">
                                    <div className="flex items-center">
                                        <img src={cat.imageUrl || `https://via.placeholder.com/100x100.png/F9FAFB/111827?text=${encodeURIComponent(cat.name.charAt(0))}`} alt={cat.name} className="w-10 h-10 rounded-md object-cover mr-4 bg-gray-100" />
                                        <div>
                                            <p className="font-medium text-gray-900">{cat.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{cat.code}</p>
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
                                        <button onClick={() => deleteCategory(cat.code)} className="text-red-600 hover:text-red-900 font-medium text-sm"
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
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verificar se há dados no localStorage na inicialização
  useEffect(() => {
    setHasLocalData(DataManager.hasLocalStorageData());
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await DataManager.downloadData();
    } catch (error) {
      alert('❌ Erro ao exportar dados. Verifique sua conexão com o banco de dados.');
    } finally {
      setIsExporting(false);
    }
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

  const handleMigrateFromLocalStorage = async () => {
    if (!window.confirm('🔄 Migrar dados do localStorage para o Supabase? Isso irá substituir todos os dados atuais no banco.')) {
      return;
    }

    setIsMigrating(true);
    try {
      const success = await DataManager.migrateFromLocalStorage();
      if (success) {
        alert('✅ Migração concluída com sucesso! A página será recarregada.');
        setHasLocalData(false);
        window.location.reload();
      } else {
        alert('❌ Erro na migração. Verifique se há dados no localStorage.');
      }
    } catch (error) {
      alert('❌ Erro durante a migração. Verifique sua conexão com o banco de dados.');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os dados do banco de dados. Esta ação não pode ser desfeita. Tem certeza?')) {
      return;
    }

    setIsClearing(true);
    try {
      const success = await DataManager.clearAllData();
      if (success) {
        alert('✅ Dados limpos com sucesso! A página será recarregada.');
        window.location.reload();
      } else {
        alert('❌ Erro ao limpar dados.');
      }
    } catch (error) {
      alert('❌ Erro ao limpar dados. Verifique sua conexão com o banco de dados.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
      <h3 className="font-semibold text-lg text-blue-800 mb-3">🔄 Gerenciamento de Dados</h3>
      
      {/* Botões principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
        >
          {isExporting ? '⏳ Exportando...' : '📥 Exportar Dados'}
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
          disabled={isClearing}
          className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
        >
          {isClearing ? '⏳ Limpando...' : '🗑️ Limpar Tudo'}
        </button>
      </div>

      {/* Botão de migração (só aparece se há dados no localStorage) */}
      {hasLocalData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">📦 Dados encontrados no localStorage</p>
              <p className="text-xs text-yellow-600">Migre seus dados antigos para o Supabase</p>
            </div>
            <button
              onClick={handleMigrateFromLocalStorage}
              disabled={isMigrating}
              className="bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50"
            >
              {isMigrating ? '⏳ Migrando...' : '🔄 Migrar Dados'}
            </button>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="text-xs text-blue-600">
        <p><strong>💡 Dica:</strong> Use "Exportar" para fazer backup dos seus dados antes de fazer alterações importantes.</p>
        <p><strong>🗄️ Banco:</strong> Agora seus dados são salvos no Supabase, permitindo acesso de qualquer dispositivo.</p>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  // Usar hook useProducts para dados reais do Supabase
  const {
    loading,
    error,
    allProducts,
    allCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    refreshData
  } = useProducts();

  // Hook de autenticação para logout
  const { logout } = useAuth();
  
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

  const handleDelete = async (code: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto? A ação não pode ser desfeita.')) {
      const success = await deleteProduct(code);
      if (!success) {
        alert('❌ Erro ao excluir produto. Tente novamente.');
      }
    }
  };

  const handleToggleActive = async (product: Product) => {
    // Check if the product's category is active before allowing individual product toggle
    const productCategory = allCategories.find(cat => cat.code === product.category);
    if (productCategory && !productCategory.isActive && !product.isActive) {
        alert(`Não é possível ativar este produto porque a categoria "${productCategory.name}" está inativa.`);
        return;
    }

    if (window.confirm(`Tem certeza que deseja ${product.isActive ? 'INATIVAR' : 'ATIVAR'} o produto "${product.name}"?`)) {
        const success = await updateProduct(product.code, { ...product, isActive: !product.isActive });
        if (!success) {
          alert('❌ Erro ao alterar status do produto. Tente novamente.');
        }
    }
  };

  const handleFormSubmit = async (productData: Omit<Product, 'code'>) => {
    try {
      let success = false;
      
      if (editingProduct) {
        // Editando produto existente
        success = await updateProduct(editingProduct.code, {
          ...productData,
          code: editingProduct.code
        });
      } else {
        // Criando novo produto
        success = await addProduct(productData);
      }

      if (success) {
        setIsFormOpen(false);
        setEditingProduct(null);
      } else {
        alert('❌ Erro ao salvar produto. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no formulário:', error);
      alert('❌ Erro inesperado. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  }

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair do painel administrativo?')) {
      logout();
      window.location.href = '/'; // Redirecionar para home
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <ProductForm 
        product={editingProduct} 
        categories={allCategories} // Pass all categories to the form
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600 mt-1">Gerencie produtos, categorias e dados do catálogo</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                🚪 Sair
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <DataManagement />
            
            <CategoryManager 
              categories={allCategories}
              addCategory={addCategory}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
              toggleCategoryActive={toggleCategoryActive}
            />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
                <button
                  onClick={handleAddNew}
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
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
                <th className="px-5 py-3">Status</th>
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
                    <p className="text-gray-600">{allCategories.find(c => c.code === product.category)?.name || product.category}</p>
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
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                        Nenhum produto cadastrado.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;