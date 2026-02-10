import { useState, useEffect } from 'react';
import { Activity, Flame, Target, TrendingUp, Zap, Shield, AlertTriangle, TrendingDown } from 'lucide-react';
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';
import { supabase } from '../supabaseClient';

const AnalyticsDashboard = ({ habitos = [], vicios = [], metas = [], profile }) => {
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relapseByDay, setRelapseByDay] = useState([]);
    const [streakEvolution, setStreakEvolution] = useState([]);
    const [relapseLoading, setRelapseLoading] = useState(true);

    // Day names in Spanish for chart
    const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Fetch relapse data for visualizations
    useEffect(() => {
        const fetchRelapseData = async () => {
            if (vicios.length === 0) {
                setRelapseLoading(false);
                return;
            }

            try {
                setRelapseLoading(true);

                // Get all relapse records
                const { data: relapses, error } = await supabase
                    .from('historial_recaidas')
                    .select('*')
                    .order('fecha', { ascending: true });

                if (error) throw error;

                if (!relapses || relapses.length === 0) {
                    setRelapseByDay([]);
                    setStreakEvolution([]);
                    setRelapseLoading(false);
                    return;
                }

                // 1. Group by day of week for "Días de Peligro" chart
                const dayCount = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
                relapses.forEach(r => {
                    const date = new Date(r.fecha);
                    dayCount[date.getDay()]++;
                });

                const dayData = DIAS_SEMANA.map((name, idx) => ({
                    dia: name,
                    recaidas: dayCount[idx]
                }));
                setRelapseByDay(dayData);

                // 2. Streak evolution for "Evolución de Disciplina" chart
                const evolutionData = relapses.map(r => {
                    const date = new Date(r.fecha);
                    return {
                        fecha: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
                        racha: r.racha_perdida || 0,
                        fullDate: r.fecha
                    };
                });
                setStreakEvolution(evolutionData);

            } catch (err) {
                console.error('Error fetching relapse data:', err);
            } finally {
                setRelapseLoading(false);
            }
        };

        fetchRelapseData();
    }, [vicios.length]);

    // Fetch activity data for the last 14 days
    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                setLoading(true);

                // Generate last 14 days (strictly YYYY-MM-DD format)
                const dates = [];
                for (let i = 13; i >= 0; i--) {
                    const d = new Date();
                    d.setHours(0, 0, 0, 0); // Reset time to avoid timezone issues
                    d.setDate(d.getDate() - i);
                    // Format as YYYY-MM-DD manually to avoid timezone shifts
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    dates.push(`${year}-${month}-${day}`);
                }

                console.log('Fetching history from', dates[0], 'to', dates[dates.length - 1]);

                // Fetch completions from Supabase
                const { data, error } = await supabase
                    .from('historial_habitos')
                    .select('fecha')
                    .gte('fecha', dates[0])
                    .lte('fecha', dates[dates.length - 1]);

                if (error) throw error;

                console.log('Fetched records:', data?.length || 0, data);

                // Count completions per day (normalize dates to YYYY-MM-DD)
                const countByDate = {};
                data?.forEach(item => {
                    // Strictly slice to first 10 chars to get YYYY-MM-DD
                    const recordDate = String(item.fecha).slice(0, 10);
                    countByDate[recordDate] = (countByDate[recordDate] || 0) + 1;
                });

                console.log('Counts by date:', countByDate);

                // Format for chart (sorted ascending)
                const chartData = dates.map(dateStr => {
                    // Parse date for display label
                    const [year, month, day] = dateStr.split('-').map(Number);
                    const displayDate = new Date(year, month - 1, day);

                    return {
                        date: displayDate.toLocaleDateString('es-ES', {
                            weekday: 'short',
                            day: 'numeric'
                        }),
                        fullDate: dateStr,
                        completados: countByDate[dateStr] || 0
                    };
                });

                setActivityData(chartData);
            } catch (err) {
                console.error('Error fetching activity:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivityData();
    }, [habitos.length]); // Re-fetch when habit count changes

    // Calculate radar data by goal
    const getRadarData = () => {
        if (metas.length === 0) {
            return [{ subject: 'Sin Metas', A: 0, fullMark: 100 }];
        }

        return metas.map(meta => {
            const linkedHabits = habitos.filter(h => h.meta_id === meta.id);
            if (linkedHabits.length === 0) {
                return { subject: meta.nombre, A: 0, fullMark: 100 };
            }

            // Average streak as a percentage (max streak considered 30 days)
            const avgStreak = linkedHabits.reduce((sum, h) => sum + (h.racha || 0), 0) / linkedHabits.length;
            const score = Math.min(Math.round((avgStreak / 30) * 100), 100);

            return { subject: meta.nombre, A: score, fullMark: 100 };
        });
    };

    // Calculate stats - handle both possible property names
    const totalHabits = habitos.length + vicios.length;
    const totalXP = profile?.xp_total || profile?.xp || 0;
    const currentLevel = profile?.nivel || profile?.level || 1;
    const maxStreak = [...habitos, ...vicios].reduce((max, h) => Math.max(max, h.racha || 0), 0);

    const radarData = getRadarData();
    const needsMoreGoals = metas.length > 0 && metas.length < 3;

    // Calculate vice metrics (Days Clean)
    const calculateDaysClean = (fechaInicio) => {
        if (!fechaInicio) return 0;
        const start = new Date(fechaInicio);
        const today = new Date();
        return Math.floor((today - start) / (1000 * 60 * 60 * 24));
    };

    const totalDaysClean = vicios.reduce((sum, v) => sum + (v.racha || calculateDaysClean(v.fecha_inicio)), 0);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Nivel Actual</span>
                    </div>
                    <div className="text-3xl font-bold text-zinc-100">{currentLevel}</div>
                </div>

                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                        <Activity className="w-3.5 h-3.5" />
                        <span>XP Total</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">{totalXP.toLocaleString()}</div>
                </div>

                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Mejor Racha</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-400">{maxStreak} <span className="text-sm font-normal text-zinc-500">días</span></div>
                </div>

                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                        <Target className="w-3.5 h-3.5" />
                        <span>Hábitos Activos</span>
                    </div>
                    <div className="text-3xl font-bold text-zinc-100">{totalHabits}</div>
                </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-zinc-100 font-medium">Actividad (14 días)</h3>
                </div>

                {loading ? (
                    <div className="h-48 flex items-center justify-center text-zinc-500">
                        Cargando...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={activityData} barCategoryGap="20%">
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#71717a', fontSize: 10 }}
                                axisLine={{ stroke: '#3f3f46' }}
                                tickLine={false}
                                interval={1}
                            />
                            <YAxis
                                tick={{ fill: '#71717a', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                width={20}
                                allowDecimals={false}
                                domain={[0, 'dataMax + 1']}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                                contentStyle={{
                                    backgroundColor: '#18181b',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '8px',
                                    color: '#fafafa'
                                }}
                                labelStyle={{ color: '#a1a1aa' }}
                                formatter={(value) => [value, 'Completados']}
                            />
                            <Bar
                                dataKey="completados"
                                fill="url(#barGradient)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={28}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Radar Chart - Balance by Goals */}
            {metas.length > 0 && (
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-zinc-100 font-medium">Equilibrio de Metas</h3>
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#3f3f46" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{ fill: '#71717a', fontSize: 9 }}
                            />
                            <Radar
                                name="Progreso"
                                dataKey="A"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>

                    <p className="text-center text-zinc-500 text-xs mt-2">
                        {needsMoreGoals
                            ? 'Crea más metas para ver tu polígono de equilibrio'
                            : 'Basado en rachas promedio de hábitos por meta'
                        }
                    </p>
                </div>
            )}

            {/* Streak Breakdown */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <h3 className="text-zinc-100 font-medium mb-3">Rachas por Hábito</h3>
                <div className="space-y-2">
                    {habitos.slice(0, 5).map(habito => (
                        <div key={habito.id} className="flex items-center justify-between">
                            <span className="text-zinc-400 text-sm truncate flex-1">{habito.nombre}</span>
                            <div className="flex items-center gap-1.5">
                                <Flame className={`w-3.5 h-3.5 ${habito.racha > 0 ? 'text-orange-500' : 'text-zinc-600'}`} />
                                <span className={`text-sm font-medium ${habito.racha > 0 ? 'text-zinc-100' : 'text-zinc-500'}`}>
                                    {habito.racha}
                                </span>
                            </div>
                        </div>
                    ))}
                    {habitos.length === 0 && (
                        <p className="text-zinc-500 text-sm text-center py-2">
                            No tienes hábitos activos
                        </p>
                    )}
                </div>
            </div>

            {/* Vices Section - Purity & Discipline */}
            {vicios.length > 0 && (
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-violet-400" />
                            <h3 className="text-zinc-100 font-medium">Pureza y Disciplina</h3>
                        </div>
                        <div className="flex items-center gap-1.5 bg-violet-500/20 px-2.5 py-1 rounded-full">
                            <span className="text-xs text-violet-400 font-medium">{totalDaysClean} días totales</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {vicios.map(vicio => {
                            const daysClean = vicio.racha || calculateDaysClean(vicio.fecha_inicio);
                            return (
                                <div
                                    key={vicio.id}
                                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-800"
                                >
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-violet-400" />
                                        <span className="text-zinc-200 text-sm font-medium">{vicio.nombre}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${daysClean > 0 ? 'text-violet-400' : 'text-zinc-500'}`}>
                                            {daysClean}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 uppercase">días limpio</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ANÁLISIS DE VICIOS - New Section */}
            {vicios.length > 0 && (
                <>
                    {/* Section Header */}
                    <div className="flex items-center gap-2 pt-4">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <h2 className="text-lg font-semibold text-zinc-100">Análisis de Vicios</h2>
                    </div>

                    {/* Días de Peligro - Bar Chart */}
                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <h3 className="text-zinc-100 font-medium">Días de Peligro</h3>
                        </div>
                        <p className="text-zinc-500 text-xs mb-3">¿Qué días de la semana recaes más?</p>

                        {relapseLoading ? (
                            <div className="h-48 flex items-center justify-center text-zinc-500">
                                Cargando...
                            </div>
                        ) : relapseByDay.length > 0 && relapseByDay.some(d => d.recaidas > 0) ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={relapseByDay}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                                    <XAxis
                                        dataKey="dia"
                                        tick={{ fill: '#71717a', fontSize: 11 }}
                                        axisLine={{ stroke: '#3f3f46' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#71717a', fontSize: 10 }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={25}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#18181b',
                                            border: '1px solid #3f3f46',
                                            borderRadius: '8px',
                                            color: '#fafafa'
                                        }}
                                        formatter={(value) => [value, 'Recaídas']}
                                    />
                                    <Bar
                                        dataKey="recaidas"
                                        fill="#ef4444"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-32 flex flex-col items-center justify-center text-zinc-500 bg-zinc-800/30 rounded-lg">
                                <Shield className="w-8 h-8 mb-2 text-emerald-500/50" />
                                <p className="text-sm">Sin recaídas registradas</p>
                                <p className="text-xs text-zinc-600">¡Mantén tu racha!</p>
                            </div>
                        )}
                    </div>

                    {/* Evolución de Disciplina - Line Chart */}
                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-zinc-100 font-medium">Evolución de Disciplina</h3>
                        </div>
                        <p className="text-zinc-500 text-xs mb-3">¿Tus rachas son cada vez más largas?</p>

                        {relapseLoading ? (
                            <div className="h-48 flex items-center justify-center text-zinc-500">
                                Cargando...
                            </div>
                        ) : streakEvolution.length >= 2 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={streakEvolution} barCategoryGap="15%">
                                    <defs>
                                        <linearGradient id="streakBarGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis
                                        dataKey="fecha"
                                        tick={{ fill: '#71717a', fontSize: 10 }}
                                        axisLine={{ stroke: '#3f3f46' }}
                                        tickLine={false}
                                        interval={0}
                                        angle={-35}
                                        textAnchor="end"
                                        height={45}
                                    />
                                    <YAxis
                                        tick={{ fill: '#71717a', fontSize: 10 }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={25}
                                        allowDecimals={false}
                                        domain={[0, 'dataMax + 1']}
                                        label={{
                                            value: 'Días',
                                            angle: -90,
                                            position: 'insideLeft',
                                            fill: '#52525b',
                                            fontSize: 10
                                        }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }}
                                        contentStyle={{
                                            backgroundColor: '#18181b',
                                            border: '1px solid #3f3f46',
                                            borderRadius: '8px',
                                            color: '#fafafa'
                                        }}
                                        formatter={(value) => [`${value} días de racha`, 'Antes de recaer']}
                                    />
                                    <Bar
                                        dataKey="racha"
                                        fill="url(#streakBarGradient)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={32}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-32 flex flex-col items-center justify-center text-zinc-500 bg-zinc-800/30 rounded-lg">
                                <TrendingUp className="w-8 h-8 mb-2 text-zinc-600" />
                                <p className="text-sm">Datos insuficientes</p>
                                <p className="text-xs text-zinc-600">Se necesitan al menos 2 recaídas para mostrar tendencia</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
