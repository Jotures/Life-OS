import { useState } from 'react';
import { Flag, Plus, X, Pencil } from 'lucide-react';

const GoalsSection = ({ metas = [], habitos = [], habitHistory = new Map(), onAddMeta, onEditMeta }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('#3B82F6');

    const colorOptions = [
        '#3B82F6', // Blue
        '#10B981', // Green
        '#F59E0B', // Amber
        '#EF4444', // Red
        '#8B5CF6', // Purple
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#F97316', // Orange
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nombre.trim()) {
            await onAddMeta(nombre.trim(), '', color);
            setNombre('');
            setColor('#3B82F6');
            setIsFormOpen(false);
        }
    };

    // Calculate Health Score for each goal (average consistency of linked habits)
    const getGoalHealth = (metaId) => {
        const linkedHabits = habitos.filter(h => h.meta_id === metaId);
        if (linkedHabits.length === 0) return { health: 0, colorClass: 'bg-rose-500', textClass: 'text-rose-500' };

        // Calculate 14-day consistency for each habit
        const today = new Date();
        const last14Days = [];
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            last14Days.push(d.toISOString().split('T')[0]);
        }

        let totalConsistency = 0;
        linkedHabits.forEach(habit => {
            const history = habitHistory?.get(habit.id) || new Set();
            const completed = last14Days.filter(d => history.has(d)).length;
            totalConsistency += (completed / 14) * 100;
        });

        const health = Math.round(totalConsistency / linkedHabits.length);

        // Determine color based on health score
        let colorClass = 'bg-rose-500';
        let textClass = 'text-rose-500';
        if (health >= 80) {
            colorClass = 'bg-emerald-500';
            textClass = 'text-emerald-400';
        } else if (health >= 50) {
            colorClass = 'bg-amber-500';
            textClass = 'text-amber-400';
        }

        return { health, colorClass, textClass };
    };

    return (
        <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-zinc-100">
                    Mis Metas
                </h2>
            </div>

            {metas.length === 0 && !isFormOpen ? (
                <div className="text-center py-8">
                    <p className="text-zinc-500 text-sm mb-4">
                        No tienes metas todavía. Las metas te ayudan a organizar tus hábitos.
                    </p>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Crear tu primera meta
                    </button>
                </div>
            ) : (
                /* Goal Cards Grid */
                <div className="grid grid-cols-2 gap-3">
                    {metas.map(meta => {
                        const { health, colorClass, textClass } = getGoalHealth(meta.id);
                        return (
                            <div
                                key={meta.id}
                                className="relative bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 group"
                                style={{ borderLeftColor: meta.color, borderLeftWidth: '3px' }}
                            >
                                {/* Edit button */}
                                <button
                                    onClick={() => onEditMeta(meta)}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>

                                {/* Goal name */}
                                <h3 className="text-zinc-100 font-medium text-sm mb-3 pr-6">
                                    {meta.nombre}
                                </h3>

                                {/* Health Score Label */}
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-zinc-500">Salud Global</span>
                                    <span className={`font-bold ${textClass}`}>{health}%</span>
                                </div>

                                {/* Health Progress Bar */}
                                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                                        style={{ width: `${health}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {/* New Goal Card/Button */}
                    {!isFormOpen ? (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-zinc-900/50 rounded-xl p-4 border border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[120px]"
                        >
                            <Plus className="w-6 h-6 text-zinc-500" />
                            <span className="text-zinc-500 text-sm font-medium">Nueva Meta</span>
                        </button>
                    ) : (
                        /* Inline Form */
                        <form
                            onSubmit={handleSubmit}
                            className="bg-zinc-900 rounded-xl p-4 border border-zinc-700"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-zinc-300 text-sm font-medium">Nueva Meta</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsFormOpen(false);
                                        setNombre('');
                                    }}
                                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Name input */}
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors mb-3"
                                autoFocus
                            />

                            {/* Color picker */}
                            <div className="flex gap-1.5 mb-3">
                                {colorOptions.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-5 h-5 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-1 ring-offset-zinc-900' : ''
                                            }`}
                                        style={{ backgroundColor: c, ringColor: c }}
                                    />
                                ))}
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={!nombre.trim()}
                                className="w-full bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Crear
                            </button>
                        </form>
                    )}
                </div>
            )}
        </section>
    );
};

export default GoalsSection;
