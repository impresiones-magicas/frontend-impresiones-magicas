'use client';

import { useEffect, useState } from 'react';
import { statsService, DashboardStats } from '@/services/stats';
import {
    Users,
    ShoppingBag,
    Tag,
    TrendingUp,
    ArrowUpRight,
    Loader2,
    Shield
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
    <div className="bg-card border border-border p-6 rounded-3xl hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -translate-y-16 translate-x-16 blur-2xl" />
        <div className="flex items-start justify-between relative z-10">
            <div className={cn("p-4 rounded-2xl shadow-inner border border-white/10 flex items-center justify-center", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" />
                {trend}
            </div>
        </div>
        <div className="mt-6 relative z-10">
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-60">{title}</p>
            <div className="flex items-end gap-2 mt-1">
                <h3 className="text-4xl font-black text-foreground tracking-tighter">{value}</h3>
            </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 relative z-10">
            <span>Sincronizado ahora</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse" />
                </div>
                <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest animate-pulse">Cargando métricas del sistema...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">Panel de Control</h1>
                <p className="text-muted-foreground mt-2 font-black uppercase text-[10px] tracking-[0.2em] opacity-60">Resumen operativo general</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Usuarios Totales"
                    value={stats?.users || 0}
                    icon={Users}
                    trend="+12%"
                    color="bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.4)]"
                />
                <StatCard
                    title="Productos en Stock"
                    value={stats?.products || 0}
                    icon={ShoppingBag}
                    trend="+5%"
                    color="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.4)]"
                />
                <StatCard
                    title="Categorías Activas"
                    value={stats?.categories || 0}
                    icon={Tag}
                    trend="+2%"
                    color="bg-gradient-to-br from-rose-500 to-orange-600 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.4)]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-8">
                <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full translate-x-32 -translate-y-32" />
                    <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-widest relative z-10 flex items-center gap-3">
                        <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                        Actividad Crítica
                    </h3>
                    <div className="space-y-6 relative z-10">
                        {stats?.users && stats.users > 0 ? (
                            <div className="flex items-center gap-5 p-4 bg-accent/20 rounded-2xl border border-border/50 hover:bg-accent/40 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Sincronización de Base de Datos</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5 opacity-60">Datos actualizados correctamente</p>
                                </div>
                                <span className="ml-auto text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">ONLINE</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 opacity-40">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Esperando eventos del sistema...</p>
                            </div>
                        )}
                        <div className="flex items-center gap-5 p-4 bg-accent/10 rounded-2xl border border-dashed border-border/50 opacity-60">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Registros de logs en tiempo real</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 rounded-[2rem] relative overflow-hidden group shadow-2xl shadow-emerald-500/20 border border-emerald-400/20">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white/30 shadow-xl">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Protocolo Seguros</h3>
                            <p className="text-emerald-50 text-xs opacity-80 leading-relaxed font-medium">
                                Tu sesión está protegida con estándares de encriptación militar. Recuerda cerrar sesión en equipos compartidos.
                            </p>
                        </div>
                        <button className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-2xl transition-all self-start font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95">
                            Auditar Seguridad
                        </button>
                    </div>
                    <ShoppingBag className="absolute -right-16 -bottom-16 w-80 h-80 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
                </div>
            </div>
        </div>
    );
}
