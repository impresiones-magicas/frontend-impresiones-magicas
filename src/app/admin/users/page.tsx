'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { User } from '@/types';
import {
    Search,
    Edit2,
    Trash2,
    UserPlus,
    Shield,
    Loader2,
    Save,
    X,
    User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminModal } from '@/components/admin/AdminModal';
import { toast } from 'sonner';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<User[]>('/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = (user: User | null = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                name: user.name || '',
                email: user.email,
                password: '', // Don't show password
                role: user.role
            });
        } else {
            setSelectedUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (selectedUser) {
                // Update
                const updateData: any = { ...formData };
                if (!updateData.password) delete updateData.password;
                await api.patch(`/users/${selectedUser.id}`, updateData);
                toast.success('Usuario actualizado con éxito');
            } else {
                // Create
                if (!formData.password) {
                    toast.error('La contraseña es obligatoria para nuevos usuarios');
                    setIsSaving(false);
                    return;
                }
                await api.post('/users', formData);
                toast.success('Usuario creado con éxito');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar usuario');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar a ${name}?`)) return;

        try {
            await api.delete(`/users/${id}`);
            toast.success('Usuario eliminado');
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar usuario');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-muted-foreground">Cargando usuarios...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
                    <p className="text-muted-foreground mt-1 uppercase text-[10px] tracking-widest font-black">User Management</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-border bg-accent/5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span>{filteredUsers.length} usuarios encontrados</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-accent/10 text-muted-foreground text-[10px] font-black uppercase tracking-widest border-b border-border/50">
                                <th className="px-6 py-5">Usuario</th>
                                <th className="px-6 py-5 hidden md:table-cell">Rol</th>
                                <th className="px-6 py-5 hidden lg:table-cell">Registro</th>
                                <th className="px-6 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-accent/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/50 to-accent flex items-center justify-center border border-border shadow-inner overflow-hidden shrink-0">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon className="w-6 h-6 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-foreground truncate">{user.name || 'Sin nombre'}</span>
                                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-tight",
                                            user.role === 'admin'
                                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_4px_12px_-4px_rgba(168,85,247,0.3)]"
                                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)]"
                                        )}>
                                            {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-black text-muted-foreground hidden lg:table-cell uppercase tracking-tight">
                                        {new Date(user.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openModal(user)}
                                                className="p-2.5 bg-accent/40 hover:bg-emerald-500/10 rounded-xl text-muted-foreground hover:text-emerald-500 border border-border hover:border-emerald-500/30 transition-all shadow-sm"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id, user.name || user.email)}
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
                </div>
            </div>

            {/* User Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-background border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-background border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="usuario@ejemplo.com"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">
                                {selectedUser ? 'Cambiar Contraseña (opcional)' : 'Contraseña'}
                            </label>
                            <input
                                type="password"
                                required={!selectedUser}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-background border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Rol / Permisos</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'user' })}
                                    className={cn(
                                        "flex items-center justify-center gap-2 py-3 rounded-2xl border font-black tracking-tight transition-all text-xs",
                                        formData.role === 'user'
                                            ? "bg-emerald-600/10 border-emerald-600 text-emerald-500 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)]"
                                            : "bg-background border-border text-muted-foreground hover:border-muted-foreground/30"
                                    )}
                                >
                                    USER
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                                    className={cn(
                                        "flex items-center justify-center gap-2 py-3 rounded-2xl border font-black tracking-tight transition-all text-xs",
                                        formData.role === 'admin'
                                            ? "bg-purple-600/10 border-purple-600 text-purple-400 shadow-[0_4px_12px_-4px_rgba(168,85,247,0.3)]"
                                            : "bg-background border-border text-muted-foreground hover:border-muted-foreground/30"
                                    )}
                                >
                                    <Shield className="w-4 h-4" />
                                    ADMIN
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
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
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {selectedUser ? 'Actualizar' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}
