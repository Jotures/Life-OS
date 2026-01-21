import { Pencil } from 'lucide-react';

const VitalCard = ({ data, onEdit, linkedHabitsCount = 0, calculatedValue = null }) => {
    const isAutomatic = linkedHabitsCount > 0;
    const value = isAutomatic ? (calculatedValue ?? 0) : (data.current_value ?? 0);

    // Determine color based on health
    const getBarColor = (val) => {
        if (val < 30) return 'bg-rose-500';
        if (val < 70) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getTextColor = (val) => {
        if (val < 30) return 'text-rose-500';
        if (val < 70) return 'text-amber-500';
        return 'text-emerald-400';
    };

    return (
        <div
            className="relative bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 group"
            style={{ borderLeftColor: data.color || '#3B82F6', borderLeftWidth: '3px' }}
        >
            {/* Edit button */}
            <button
                onClick={onEdit}
                className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
            >
                <Pencil className="w-3.5 h-3.5" />
            </button>

            {/* Goal name */}
            <h3 className="text-zinc-100 font-medium text-sm mb-3 pr-6">
                {data.nombre}
            </h3>

            {/* Health Score Label */}
            <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-zinc-500">Salud Global</span>
                <span className={`font-bold ${getTextColor(value)}`}>{value}%</span>
            </div>

            {/* Health Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(value)}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
};

export default VitalCard;
