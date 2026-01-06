import { Check, Flame, Trash2 } from 'lucide-react';
import { useState } from 'react';
import HabitHeatmap from './HabitHeatmap';

const HabitCard = ({ habito, onMarcar, onEliminar, completadoHoy }) => {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <div
            className="group relative bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200"
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <button
                        onClick={onMarcar}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${completadoHoy
                            ? 'bg-zinc-100 border-zinc-100'
                            : 'border-zinc-600 hover:border-zinc-400'
                            }`}
                    >
                        {completadoHoy && (
                            <Check className="w-4 h-4 text-zinc-900" strokeWidth={3} />
                        )}
                    </button>

                    {/* Habit name */}
                    <span className={`text-zinc-100 font-medium ${completadoHoy ? 'line-through text-zinc-500' : ''}`}>
                        {habito.nombre}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Streak counter */}
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <Flame className={`w-4 h-4 ${habito.racha > 0 ? 'text-orange-500' : ''}`} />
                        <span className="text-sm font-medium">{habito.racha}</span>
                    </div>

                    {/* Delete button */}
                    <button
                        onClick={onEliminar}
                        className={`p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-all duration-200 ${showDelete ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Heatmap - Last 14 days */}
            <HabitHeatmap habitId={habito.id} streak={habito.racha} />
        </div>
    );
};

export default HabitCard;
