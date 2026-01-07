import { Check, Flame, Pencil, Trash2, Timer } from 'lucide-react';
import { useState } from 'react';
import HabitHeatmap from './HabitHeatmap';
import PomodoroTimer from './PomodoroTimer';

const HabitCard = ({ habito, onMarcar, onEliminar, onEdit, completadoHoy }) => {
    const [showDelete, setShowDelete] = useState(false);
    const [showTimer, setShowTimer] = useState(false);

    return (
        <div
            className="group relative bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200"
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Left side: Checkbox + Name/Tag column */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                        onClick={onMarcar}
                        className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${completadoHoy
                            ? 'bg-zinc-100 border-zinc-100'
                            : 'border-zinc-600 hover:border-zinc-400'
                            }`}
                    >
                        {completadoHoy && (
                            <Check className="w-4 h-4 text-zinc-900" strokeWidth={3} />
                        )}
                    </button>

                    {/* Name and Goal Tag (stacked vertically) */}
                    <div className="flex flex-col gap-1 min-w-0">
                        {/* Habit name */}
                        <span className={`text-zinc-100 font-medium truncate ${completadoHoy ? 'line-through text-zinc-500' : ''}`}>
                            {habito.nombre}
                        </span>

                        {/* Goal Badge - below name for mobile friendliness */}
                        {habito.meta && (
                            <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit"
                                style={{
                                    backgroundColor: habito.meta.color + '25',
                                    color: habito.meta.color
                                }}
                            >
                                🎯 {habito.meta.nombre}
                            </span>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Streak + Actions (stacked) */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {/* Streak counter */}
                    <div className="flex items-center gap-1.5">
                        <Flame className={`w-4 h-4 ${habito.racha > 0 ? 'text-orange-500' : 'text-zinc-600'}`} />
                        <span className={`text-sm font-bold ${habito.racha > 0 ? 'text-orange-500' : 'text-zinc-500'}`}>
                            {habito.racha}
                        </span>
                    </div>

                    {/* Action buttons row */}
                    <div className="flex items-center gap-1">
                        {/* Pomodoro Timer button */}
                        <button
                            onClick={() => setShowTimer(!showTimer)}
                            className={`p-1 rounded-lg transition-all duration-200 ${showTimer
                                ? 'bg-emerald-600 text-white'
                                : 'text-zinc-600 hover:text-emerald-400 hover:bg-zinc-800'
                                } ${showDelete || showTimer ? 'opacity-100' : 'opacity-0'}`}
                            title="Pomodoro Timer"
                        >
                            <Timer className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit button */}
                        <button
                            onClick={onEdit}
                            className={`p-1 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-zinc-800 transition-all duration-200 ${showDelete ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button */}
                        <button
                            onClick={onEliminar}
                            className={`p-1 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-all duration-200 ${showDelete ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Pomodoro Timer (Collapsible) */}
            {showTimer && (
                <PomodoroTimer onClose={() => setShowTimer(false)} />
            )}

            {/* Heatmap - Last 14 days */}
            <HabitHeatmap habitId={habito.id} streak={habito.racha} />
        </div>
    );
};

export default HabitCard;
