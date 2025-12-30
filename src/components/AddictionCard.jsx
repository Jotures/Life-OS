import { RotateCcw, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';

const AddictionCard = ({ habito, onReiniciar, onEliminar }) => {
    const [showDelete, setShowDelete] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);

    const handleReiniciar = () => {
        if (confirmReset) {
            onReiniciar();
            setConfirmReset(false);
        } else {
            setConfirmReset(true);
            // Auto-hide confirmation after 3 seconds
            setTimeout(() => setConfirmReset(false), 3000);
        }
    };

    const getDaysText = (dias) => {
        if (dias === 0) return 'Hoy empiezas';
        if (dias === 1) return '1 día libre';
        return `${dias} días libre`;
    };

    return (
        <div
            className="group relative bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200"
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Shield icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${habito.racha > 7 ? 'bg-emerald-500/20' : 'bg-zinc-800'
                        }`}>
                        <Shield className={`w-5 h-5 ${habito.racha > 7 ? 'text-emerald-400' : 'text-zinc-400'
                            }`} />
                    </div>

                    <div>
                        {/* Habit name */}
                        <span className="text-zinc-100 font-medium block">
                            {habito.nombre}
                        </span>
                        {/* Days counter */}
                        <span className={`text-sm ${habito.racha > 0 ? 'text-emerald-400' : 'text-zinc-500'
                            }`}>
                            {getDaysText(habito.racha)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Reset button */}
                    <button
                        onClick={handleReiniciar}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${confirmReset
                                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                            }`}
                    >
                        <span className="flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5" />
                            {confirmReset ? '¿Confirmar?' : 'Recaí'}
                        </span>
                    </button>

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
        </div>
    );
};

export default AddictionCard;
