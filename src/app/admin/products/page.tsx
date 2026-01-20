'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api';
import { Product, Category } from '@/types';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    Loader2,
    Image as ImageIcon,
    Save,
    Upload,
    ChevronRight,
    Tag,
    AlertCircle,
    X,
    Eye,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminModal } from '@/components/admin/AdminModal';
import { toast } from 'sonner';
import { getMediaUrl } from '@/services/media';
import { formatPrice } from '@/lib/utils';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        slug: '',
        isFeatured: false,
        categoryId: ''
    });

    // Image states
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodsRes, catsRes] = await Promise.all([
                api.get<Product[]>('/products'),
                api.get<Category[]>('/categories')
            ]);
            setProducts(prodsRes.data);
            setCategories(catsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (product: Product | null = null) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: Number(product.price),
                stock: Number(product.stock),
                slug: product.slug || '',
                isFeatured: !!product.isFeatured,
                categoryId: product.category?.id || ''
            });
            setPreviews(product.images?.map(img => img.url) || []);
        } else {
            setSelectedProduct(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                stock: 0,
                slug: '',
                isFeatured: false,
                categoryId: categories[0]?.id || ''
            });
            setPreviews([]);
        }
        setSelectedFiles([]);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePreview = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        // Also remove from selectedFiles if it was newly added
        // This is simplified, in a real app we'd track which preview belongs to which file
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Clean payload for backend DTO
            const payload: any = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                isFeatured: Boolean(formData.isFeatured)
            };

            if (formData.categoryId) payload.categoryId = formData.categoryId;

            let productId: string;

            if (selectedProduct) {
                await api.patch(`/products/${selectedProduct.id}`, payload);
                productId = selectedProduct.id;
                toast.success('Producto actualizado');
            } else {
                const { data } = await api.post<Product>('/products', payload);
                productId = data.id;
                toast.success('Producto creado');
            }

            // Upload new images if any
            if (selectedFiles.length > 0) {
                const imgFormData = new FormData();
                selectedFiles.forEach(file => {
                    imgFormData.append('files', file);
                });
                await api.post(`/products/${productId}/images`, imgFormData);
                toast.success('Imágenes subidas');
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar producto');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Borrar "${name}" del catálogo?`)) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Producto eliminado');
            fetchData();
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-400 font-medium tracking-wide">Analizando inventario...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Inventario</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-1">Products & Catalog</span>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{products.length} Items</span>
                    </div>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Registrar Producto
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-300">
                <div className="p-6 border-b border-border bg-accent/5 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar en el catálogo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-accent/20 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-b border-border/50">
                                <th className="px-8 py-6">Producto</th>
                                <th className="px-8 py-6 hidden md:table-cell">Categoría</th>
                                <th className="px-8 py-6">Precio & Stock</th>
                                <th className="px-8 py-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-accent/10 transition-colors group border-b border-border/50 last:border-0">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-2xl relative group/img">
                                                {product.images?.[0] ? (
                                                    <img src={getMediaUrl(product.images[0].url)} alt="" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <Package className="w-6 h-6 text-muted-foreground/30" />
                                                )}
                                                {product.images && product.images.length > 1 && (
                                                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/10 text-[8px] font-black text-white">
                                                        +{product.images.length - 1}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-foreground truncate group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{product.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-black truncate uppercase tracking-widest opacity-60">SKU: {product.id.split('-')[0]}</span>
                                                {/* Mobile Info */}
                                                <div className="md:hidden flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-emerald-500">{formatPrice(product.price)}</span>
                                                    <span className="text-[10px] font-black text-muted-foreground/30">|</span>
                                                    <span className="text-[10px] font-black text-muted-foreground">{product.stock}U</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{product.category?.name || 'SIN CAT'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm font-black text-foreground">{formatPrice(product.price)}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 w-20 h-1 bg-accent rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-700",
                                                            product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: `${Math.min(product.stock * 4, 100)}%` }}
                                                    />
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-tighter",
                                                    product.stock > 10 ? "text-muted-foreground" : product.stock > 0 ? "text-amber-500" : "text-red-500"
                                                )}>{product.stock} Un.</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <button
                                                onClick={() => openModal(product)}
                                                className="p-3 bg-accent/40 hover:bg-emerald-500/10 rounded-2xl text-muted-foreground hover:text-emerald-500 border border-border hover:border-emerald-500/30 transition-all shadow-xl"
                                                title="Configurar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-3 bg-accent/40 hover:bg-red-500/10 rounded-2xl text-muted-foreground hover:text-red-500 border border-border hover:border-red-500/30 transition-all shadow-xl"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center text-slate-600 gap-6">
                            <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-slate-800 shadow-inner">
                                <Package className="w-16 h-16 opacity-10" />
                            </div>
                            <div className="text-center">
                                <p className="font-black uppercase tracking-[0.2em] text-sm">Catálogo Vacío</p>
                                <p className="text-xs font-medium text-slate-700 mt-2">No se encontraron productos que coincidan.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedProduct ? 'Configurar Producto' : 'Nuevo Artista Visual'}
                className="max-w-4xl"
            >
                <div className="p-6 border-b border-border/50 bg-accent/5">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Editor de Catálogo</p>
                </div>
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid lg:grid-cols-[1.2fr_1.8fr] gap-10">
                        {/* Gallery Section */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 block">Galería de Imágenes</label>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {previews.map((prev, idx) => (
                                        <div key={idx} className="aspect-square rounded-3xl bg-accent/20 border border-border relative group/p overflow-hidden">
                                            <img src={prev.startsWith('data:') ? prev : getMediaUrl(prev)} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePreview(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-xl opacity-0 group-hover/p:opacity-100 transition-opacity border border-white/20"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-3xl border-2 border-dashed border-border hover:border-emerald-500/50 hover:bg-accent/50 transition-all flex flex-col items-center justify-center group/add"
                                    >
                                        <div className="p-3 bg-accent rounded-2xl mb-2 group-hover/add:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-muted-foreground group-hover/add:text-emerald-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-muted-foreground group-hover/add:text-foreground tracking-widest uppercase">Añadir</span>
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />

                                {previews.length === 0 && (
                                    <div className="p-6 bg-accent/20 border border-border rounded-3xl flex items-center gap-4">
                                        <AlertCircle className="w-5 h-5 text-amber-500/50 shrink-0" />
                                        <p className="text-[10px] text-muted-foreground leading-relaxed font-black uppercase tracking-tight">Recomendamos subir al menos 3 imágenes en alta resolución <br />(1:1 o 4:3) para una visualización premium.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Nombre del Producto</label>
                                    <input
                                        type="text" required
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                                        placeholder="Ej: Camiseta Oversize 'Mágica'"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Categoría</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                        <select
                                            value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-5 text-foreground focus:outline-none appearance-none font-black text-[10px] tracking-widest uppercase"
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id} className="bg-background text-foreground">{c.name.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">URL Slug</label>
                                    <input
                                        type="text" required
                                        value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-muted-foreground focus:outline-none text-[10px] font-mono tracking-widest uppercase"
                                        placeholder="ej-camiseta-oversize"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Precio Base</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 font-black">{formatPrice(0).replace(/[0-9,\s.]/g, '')}</span>
                                        <input
                                            type="number" step="0.01" required
                                            value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            className="w-full bg-background border border-border rounded-2xl py-4 pl-10 pr-5 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Stock Actual</label>
                                    <input
                                        type="number" required
                                        value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-lg"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <div
                                        onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all",
                                            formData.isFeatured ? "bg-emerald-600/10 border-emerald-600/50" : "bg-background border-border"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Shield className={cn("w-5 h-5 transition-colors", formData.isFeatured ? "text-emerald-400" : "text-muted-foreground/40")} />
                                            <div>
                                                <p className={cn("text-xs font-black uppercase tracking-widest transition-colors", formData.isFeatured ? "text-emerald-400" : "text-muted-foreground")}>Producto Destacado</p>
                                                <p className="text-[10px] text-muted-foreground/50 mt-0.5">Aparecerá en secciones preferentes de la tienda</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-10 h-5 rounded-full relative transition-colors",
                                            formData.isFeatured ? "bg-emerald-500" : "bg-accent"
                                        )}>
                                            <div className={cn(
                                                "absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm",
                                                formData.isFeatured ? "left-6" : "left-1"
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Descripción Detallada</label>
                                <textarea
                                    rows={4}
                                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-background border border-border rounded-2xl py-4 px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none text-sm leading-relaxed"
                                    placeholder="Detalla las características únicas de este producto..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-border/50">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="w-full sm:flex-1 px-8 py-5 rounded-3xl border border-border text-muted-foreground font-black hover:bg-accent transition-all uppercase text-[10px] tracking-widest"
                        >
                            Ignorar Cambios
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full sm:flex-[2] bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-5 rounded-3xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-500/20 uppercase text-[10px] tracking-widest disabled:opacity-50 active:scale-[0.98]"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5 shadow-inner" />
                            )}
                            {selectedProduct ? 'Confirmar Actualización' : 'Publicar Producto'}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}
