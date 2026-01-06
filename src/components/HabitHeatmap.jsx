import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const HabitHeatmap = ({ habitId, streak }) => {
    const [history, setHistory] = useState(new Set());
    const [last14Days, setLast14Days] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);

                // 1. Calculate date range (Last 14 days)
                const today = new Date();
                const dates = [];
                for (let i = 13; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    dates.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
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

    return (
        <div className="flex gap-1 mt-3">
            {last14Days.map((dateString) => {
                const isCompleted = history.has(dateString);

                return (
                    <div
                        key={dateString}
                        title={formatDateDisplay(dateString)}
                        className={`w-3 h-3 rounded-sm transition-colors duration-200 ${isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-zinc-800'
                            }`}
                    />
                );
            })}
        </div>
    );
};

export default HabitHeatmap;
