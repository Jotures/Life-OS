import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, habitName, habitType, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const title = habitType === 'dejar' ? '¿Eliminar vicio?' : '¿Eliminar hábito?';
    const description = habitType === 'dejar'
        ? 'Esta acción es permanente y perderás tu progreso de días libre.'
        : 'Esta acción es permanente y perderás tu racha actual.';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Icon */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>

                {/* Habit name */}
                {habitName && (
                    <p className="text-zinc-300 font-medium mb-2">"{habitName}"</p>
                )}

                {/* Description */}
                <p className="text-zinc-400 text-sm mb-6">
                    {description}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors"
                    >
                        Sí, eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
