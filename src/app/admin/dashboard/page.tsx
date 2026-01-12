'use client';

import { useEffect, useState } from 'react';
import { statsService, DashboardStats } from '@/services/stats';
import {
    Users,
    ShoppingBag,
    Tag,
    TrendingUp,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    trend: string;
    color: string;
}) => (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group">
        <div className="flex items-start justify-between">
            <div className={cn("p-3 rounded-xl", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {trend}
            </div>
        </div>
        <div className="mt-4">
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <div className="flex items-end gap-2 mt-1">
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Updated just now</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    </div>
);

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-400 animate-pulse">Cargando estadísticas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Bienvenido, Admin</h1>
                <p className="text-slate-400 mt-2">Aquí tienes un resumen de lo que está pasando hoy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Usuarios Totales"
                    value={stats?.users || 0}
                    icon={Users}
                    trend="+12%"
                    color="bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                />
                <StatCard
                    title="Productos"
                    value={stats?.products || 0}
                    icon={ShoppingBag}
                    trend="+5%"
                    color="bg-emerald-600 shadow-[0_0_20px_rgba(5,150,105,0.4)]"
                />
                <StatCard
                    title="Categorías"
                    value={stats?.categories || 0}
                    icon={Tag}
                    trend="+2%"
                    color="bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                    <h3 className="text-xl font-semibold text-white mb-6">Actividad Reciente</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 text-sm">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <p className="text-slate-300">Nuevo usuario registrado: <span className="text-white font-medium">Juan Perez</span></p>
                                <span className="ml-auto text-slate-500">Hace 5 min</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Consejo de Seguridad</h3>
                            <p className="text-blue-100 text-sm max-w-xs opacity-90 leading-relaxed">
                                Recuerda que las contraseñas de administrador deben cambiarse cada 30 días para mantener la seguridad del panel.
                            </p>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-6 py-2.5 rounded-xl transition-all self-start font-medium text-sm">
                            Saber más
                        </button>
                    </div>
                    <ShoppingBag className="absolute -right-12 -bottom-12 w-64 h-64 text-white/10 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                </div>
            </div>
        </div>
    );
}
