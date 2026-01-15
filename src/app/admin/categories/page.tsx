'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api';
import { Category } from '@/types';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Tag,
    Loader2,
    FolderTree,
    Save,
    Image as ImageIcon,
    Upload,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminModal } from '@/components/admin/AdminModal';
import { toast } from 'sonner';
import { getMediaUrl } from '@/services/media';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isFeatured: false,
        slug: ''
    });

    // Image states
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<Category[]>('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openModal = (category: Category | null = null) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                isFeatured: !!category.isFeatured,
                slug: (category as any).slug || ''
            });
            setImagePreview(category.imageUrl || null);
        } else {
            setSelectedCategory(null);
            setFormData({
                name: '',
                description: '',
                isFeatured: false,
                slug: ''
            });
            setImagePreview(null);
        }
        setSelectedImage(null);
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let categoryId: string;

            // Clean payload for DTO validation
            const payload = {
                name: formData.name,
                description: formData.description,
                isFeatured: Boolean(formData.isFeatured)
            };

            if (selectedCategory) {
                // Update
                await api.patch(`/categories/${selectedCategory.id}`, payload);
                categoryId = selectedCategory.id;
                toast.success('Categoría actualizada');
            } else {
                // Create
                const { data } = await api.post<Category>('/categories', payload);
                categoryId = data.id;
                toast.success('Categoría creada');
            }

            // Handle Image Upload if selected
            if (selectedImage) {
                const imgData = new FormData();
                imgData.append('file', selectedImage);
                await api.post(`/categories/${categoryId}/image`, imgData);
                toast.success('Imagen subida correctamente');
            }

            setIsModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar categoría');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${name}"?`)) return;

        try {
            await api.delete(`/categories/${id}`);
            toast.success('Categoría eliminada');
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar categoría');
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Cargando categorías...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Categorías</h1>
                    <p className="text-muted-foreground mt-1 uppercase text-[10px] tracking-widest font-black">Classification System</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Categoría
                </button>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-border bg-accent/10 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-accent/10 text-muted-foreground text-[10px] font-black uppercase tracking-widest border-b border-border/50">
                                <th className="px-6 py-5">Categoría</th>
                                <th className="px-6 py-5 hidden md:table-cell">Descripción</th>
                                <th className="px-6 py-5">Estado</th>
                                <th className="px-6 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-accent/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/50 to-accent flex items-center justify-center border border-border shadow-inner overflow-hidden shrink-0">
                                                {category.imageUrl ? (
                                                    <img src={getMediaUrl(category.imageUrl)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Tag className="w-6 h-6 text-emerald-500 shadow-lg shadow-emerald-500/20" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-foreground truncate">{category.name}</span>
                                                <span className="text-[10px] font-black text-muted-foreground tracking-widest truncate uppercase opacity-60">/{(category as any).slug || 'sin-slug'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <p className="text-xs text-muted-foreground max-w-[250px] line-clamp-2 leading-relaxed">{category.description || 'Sin descripción'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-xl text-[10px] font-black border uppercase tracking-tight",
                                                category.isFeatured
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)]"
                                                    : "bg-accent/40 text-muted-foreground border-border"
                                            )}>
                                                {category.isFeatured ? (
                                                    <><CheckCircle2 className="w-3 h-3" /> DESTACADA</>
                                                ) : (
                                                    'ESTÁNDAR'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openModal(category)}
                                                className="p-2.5 bg-accent/40 hover:bg-emerald-500/10 rounded-xl text-muted-foreground hover:text-emerald-500 border border-border hover:border-emerald-500/30 transition-all shadow-sm"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="p-2.5 bg-accent/40 hover:bg-red-500/10 rounded-xl text-muted-foreground hover:text-red-500 border border-border hover:border-red-500/30 transition-all shadow-sm"
                                                title="Borrar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCategories.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
                            <FolderTree className="w-16 h-16 opacity-10" />
                            <p className="font-medium">No se encontraron categorías.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                className="max-w-2xl"
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Image Column */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block text-center">Imagen de Portada</label>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group relative",
                                    imagePreview ? "border-emerald-500/30" : "border-border hover:border-emerald-500/50 hover:bg-accent/50"
                                )}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview.startsWith('data:') ? imagePreview : getMediaUrl(imagePreview)} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" />
                                        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                            <div className="bg-emerald-500/20 p-3 rounded-full border border-emerald-500/50 backdrop-blur-md">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-accent p-4 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-2xl">
                                            <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-emerald-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Subir Imagen</p>
                                        <p className="text-[9px] font-bold text-muted-foreground/50 mt-1">Formato JPG, PNG o WEBP</p>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Details Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-background border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                                    placeholder="Ej: Camisetas Personalizadas"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Slug (URL)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-background border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-xs font-mono"
                                    placeholder="ej-camisetas-personalizadas"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Descripción</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-background border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none text-sm"
                                    placeholder="Describe brevemente esta categoría..."
                                />
                            </div>

                            <div
                                onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all",
                                    formData.isFeatured ? "bg-emerald-600/10 border-emerald-600/50" : "bg-slate-950 border-slate-800"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className={cn("w-5 h-5 transition-colors", formData.isFeatured ? "text-emerald-400" : "text-slate-600")} />
                                    <div>
                                        <p className={cn("text-xs font-bold uppercase tracking-widest transition-colors", formData.isFeatured ? "text-emerald-400" : "text-slate-500")}>Categoría Destacada</p>
                                        <p className="text-[10px] text-slate-600 mt-0.5">Aparecerá en la página principal</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-10 h-5 rounded-full relative transition-colors",
                                    formData.isFeatured ? "bg-emerald-500" : "bg-slate-700"
                                )}>
                                    <div className={cn(
                                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                        formData.isFeatured ? "left-6" : "left-1"
                                    )} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-6 py-4 rounded-2xl border border-border text-muted-foreground font-black hover:bg-accent transition-all uppercase text-[10px] tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-[2] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/20 uppercase text-[10px] tracking-widest disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {selectedCategory ? 'Actualizar' : 'Crear Categoría'}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}
