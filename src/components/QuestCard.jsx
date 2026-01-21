import { Minus, Plus, Trophy, Pencil, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const QuestCard = ({ data, onProgress, onComplete, onEdit }) => {
    const current = Number(data.current_value) || 0;
    const target = Number(data.target_value) || 100;
    const progress = Math.round((current / target) * 100);
    const isCompleted = current >= target;

    // Number of segments to display
    const TOTAL_SEGMENTS = 10;
    const filledSegments = Math.round((current / target) * TOTAL_SEGMENTS);

    // Determine status label
    const getStatus = (pct) => {
        if (pct >= 100) return { label: 'COMPLETO', color: 'text-yellow-400' };
        if (pct >= 70) return { label: 'AVANZADO', color: 'text-emerald-400' };
        if (pct >= 30) return { label: 'EN PROGRESO', color: 'text-amber-400' };
        return { label: 'CRÍTICO', color: 'text-rose-400' };
    };

    const status = getStatus(progress);

    const handleDecrement = () => {
        const step = Math.ceil(target / TOTAL_SEGMENTS);
        const newVal = Math.max(0, current - step);
        onProgress(data.id, { current_value: newVal });
    };

    const handleIncrement = () => {
        const step = Math.ceil(target / TOTAL_SEGMENTS);
        const newVal = Math.min(target, current + step);
        onProgress(data.id, { current_value: newVal });
    };

    const handleComplete = () => {
        onComplete(data);
    };

    return (
        <div
            className="relative bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 group"
            style={{ borderLeftColor: data.color || '#EAB308', borderLeftWidth: '3px' }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-zinc-100 font-medium text-sm truncate">
                            {data.nombre}
                        </h4>
                        {/* XP Badge */}
                        <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-500 flex-shrink-0">
                            <Sparkles className="w-2.5 h-2.5" />
                            +{data.xp_reward || 500}
                        </span>
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider ${status.color}`}>
                        {status.label}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold font-mono ${isCompleted ? 'text-yellow-400' : 'text-zinc-100'}`}>
                        {progress}%
                    </span>
                    {/* Edit button */}
                    <button
                        onClick={onEdit}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Progress Control */}
            {isCompleted ? (
                <button
                    onClick={handleComplete}
                    className="w-full py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    <Trophy className="w-4 h-4" />
                    Reclamar Recompensa
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    {/* Decrement button */}
                    <button
                        onClick={handleDecrement}
                        disabled={current <= 0}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Minus className="w-4 h-4" />
                    </button>

                    {/* Segmented Progress Grid */}
                    <div className="flex-1 flex gap-1">
                        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-3 flex-1 rounded-sm transition-all duration-300 ${i < filledSegments
                                        ? ''
                                        : 'bg-zinc-800'
                                    }`}
                                style={i < filledSegments ? { backgroundColor: data.color || '#EAB308' } : {}}
                            />
                        ))}
                    </div>

                    {/* Increment button */}
                    <button
                        onClick={handleIncrement}
                        disabled={current >= target}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Progress text */}
            <div className="flex justify-center mt-2">
                <span className="text-[10px] text-zinc-500 font-mono">
                    {current} / {target}
                </span>
            </div>
        </div>
    );
};

export default QuestCard;
