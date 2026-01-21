import { useState, useEffect } from 'react';
import { X, Trash2, Activity, Scroll, Target, Sparkles } from 'lucide-react';

const EditGoalModal = ({ isOpen, meta, onSave, onDelete, onClose }) => {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('#3B82F6');
    const [targetValue, setTargetValue] = useState('');
    const [xpReward, setXpReward] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const isQuest = meta?.type === 'quest';

    // Reset form when modal opens with new goal
    useEffect(() => {
        if (meta) {
            setNombre(meta.nombre || '');
            setColor(meta.color || '#3B82F6');
            setTargetValue(meta.target_value?.toString() || '');
            setXpReward(meta.xp_reward?.toString() || '');
            setShowDeleteConfirm(false);
        }
    }, [meta]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombre.trim() && meta) {
            const updates = {
                nombre: nombre.trim(),
                color
            };

            // Add quest-specific fields if it's a quest
            if (isQuest) {
                updates.target_value = parseInt(targetValue, 10);
                updates.xp_reward = parseInt(xpReward, 10);
            }

            onSave(meta.id, updates);
            onClose();
        }
    };

    const handleDelete = () => {
        if (meta) {
            onDelete(meta.id);
            onClose();
        }
    };

    if (!isOpen || !meta) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md p-6 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header with type indicator */}
                <div className="flex items-center gap-2 mb-2">
                    {isQuest ? (
                        <Scroll className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Activity className="w-5 h-5 text-emerald-400" />
                    )}
                    <h2 className="text-xl font-semibold text-zinc-100">
                        Editar {isQuest ? 'Misión' : 'Signo Vital'}
                    </h2>
                </div>
                <p className="text-zinc-400 text-sm mb-6">
                    {isQuest
                        ? 'Modifica los detalles de tu misión'
                        : 'Modifica el nombre o el color'
                    }
                </p>

                {!showDeleteConfirm ? (
                    <form onSubmit={handleSubmit}>
                        {/* Name input */}
                        <div className="mb-4">
                            <label className="block text-zinc-400 text-sm mb-2">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre de la meta"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                                autoFocus
                            />
                        </div>

                        {/* Color picker */}
                        <div className="mb-4">
                            <label className="block text-zinc-400 text-sm mb-2">
                                Color
                            </label>
                            <div className="flex gap-2">
                                {colorOptions.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full transition-all ${color === c
                                                ? 'ring-2 ring-offset-2 ring-offset-zinc-900'
                                                : 'hover:scale-110'
                                            }`}
                                        style={{ backgroundColor: c, ringColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Quest-specific fields */}
                        {isQuest && (
                            <>
                                {/* Target Value */}
                                <div className="mb-4">
                                    <label className="block text-zinc-400 text-sm mb-2">
                                        <Target className="w-3.5 h-3.5 inline mr-1" />
                                        Objetivo
                                    </label>
                                    <input
                                        type="number"
                                        value={targetValue}
                                        onChange={(e) => setTargetValue(e.target.value)}
                                        placeholder="Ej: 1000"
                                        min="1"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                                    />
                                </div>

                                {/* XP Reward */}
                                <div className="mb-6">
                                    <label className="block text-zinc-400 text-sm mb-2">
                                        <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                                        Recompensa XP
                                    </label>
                                    <input
                                        type="number"
                                        value={xpReward}
                                        onChange={(e) => setXpReward(e.target.value)}
                                        placeholder="Ej: 500"
                                        min="1"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                                    />
                                </div>
                            </>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-red-900/50 border border-zinc-700 hover:border-red-800 rounded-xl text-zinc-400 hover:text-red-400 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                type="submit"
                                disabled={!nombre.trim() || (isQuest && (!targetValue || !xpReward))}
                                className="flex-1 bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Delete Confirmation */
                    <div>
                        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 mb-6">
                            <p className="text-red-400 text-sm">
                                ¿Estás seguro de eliminar <strong>"{meta.nombre}"</strong>?
                            </p>
                            <p className="text-zinc-500 text-xs mt-2">
                                {isQuest
                                    ? 'Se perderá el progreso de esta misión.'
                                    : 'Los hábitos vinculados perderán su relación con esta meta.'
                                }
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-xl transition-colors"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditGoalModal;
