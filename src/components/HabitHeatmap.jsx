import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Helper: fecha local YYYY-MM-DD sin conversión a UTC
const getLocalDateString = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const HabitHeatmap = ({ habitId, streak }) => {
    const [history, setHistory] = useState(new Set());
    const [last14Days, setLast14Days] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);

                // 1. Calculate date range (Last 14 days) - timezone-safe
                const today = new Date();
                const dates = [];
                for (let i = 13; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    dates.push(getLocalDateString(d));
                }
                setLast14Days(dates);

                // 2. Fetch DATA from Supabase using SPANISH column names
                const { data, error } = await supabase
                    .from('historial_habitos')
                    .select('fecha')
                    .eq('habito_id', habitId)
                    .gte('fecha', dates[0]); // Optimization: only fetch relevant days

                if (error) {
                    console.error('Error loading heatmap:', error);
                } else {
                    // 3. Extract dates into a Set for easy lookup
                    const completedSet = new Set(data.map(item => item.fecha));
                    setHistory(completedSet);
                }
            } catch (err) {
                console.error('Error fetching habit history:', err);
            } finally {
                setLoading(false);
            }
        };

        if (habitId) {
            // ADD DELAY: Wait 500ms for DB to finish writing
            const timer = setTimeout(() => {
                fetchHistory();
            }, 500);

            // Cleanup to prevent memory leaks
            return () => clearTimeout(timer);
        }
    }, [habitId, streak]); // Re-fetch if streak changes

    // Format date for tooltip display
    const formatDateDisplay = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex gap-1 mt-3">
                {[...Array(14)].map((_, i) => (
                    <div
                        key={i}
                        className="w-3 h-3 rounded-sm bg-zinc-800 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    // Calculate Efficiency
    const completedCount = last14Days.filter(date => history.has(date)).length;
    const efficiency = Math.round((completedCount / last14Days.length) * 100);

    let effColor = "text-zinc-500";
    if (efficiency >= 80) effColor = "text-emerald-400";
    else if (efficiency >= 50) effColor = "text-amber-400";

    return (
        <div className="flex flex-col gap-1 mt-2">
            {/* Header with Efficiency */}
            <div className="flex justify-between items-end">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Últimos 14 días</span>
                <span className={`text-xs font-bold font-mono ${effColor}`}>{efficiency}%</span>
            </div>

            {/* The Grid */}
            <div className="flex gap-1">
                {last14Days.map((dateString) => {
                    const isCompleted = history.has(dateString);

                    return (
                        <div
                            key={dateString}
                            title={formatDateDisplay(dateString)}
                            className={`w-3 h-3 rounded-sm transition-all duration-300 ${isCompleted
                                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                : 'bg-zinc-800'
                                }`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default HabitHeatmap;
