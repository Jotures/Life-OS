import { useState } from 'react';
import { X, Activity, Target, Scroll, Sparkles } from 'lucide-react';

const NewGoalModal = ({ isOpen, onClose, onSubmit }) => {
    const [step, setStep] = useState('select'); // 'select' | 'form'
    const [type, setType] = useState(null);
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('#3B82F6');
    const [targetValue, setTargetValue] = useState('');
    const [xpReward, setXpReward] = useState('500');

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

    const handleSelectType = (selectedType) => {
        setType(selectedType);
        setStep('form');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        await onSubmit({
            nombre: nombre.trim(),
            descripcion: '',
            color,
            type,
            target_value: type === 'quest' ? parseInt(targetValue, 10) : null,
            xp_reward: type === 'quest' ? parseInt(xpReward, 10) : null
        });

        handleClose();
    };

    const handleClose = () => {
        setStep('select');
        setType(null);
        setNombre('');
        setColor('#3B82F6');
        setTargetValue('');
        setXpReward('500');
        onClose();
    };

    const handleBack = () => {
        setStep('select');
        setType(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md p-6 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {step === 'select' ? (
                    /* Step 1: Select Type */
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-100 mb-2">
                            Nueva Meta
                        </h2>
                        <p className="text-zinc-400 text-sm mb-6">
                            ¿Qué tipo de meta quieres crear?
                        </p>

                        <div className="space-y-3">
                            {/* Vital Option */}
                            <button
                                onClick={() => handleSelectType('vital')}
                                className="w-full flex items-center gap-4 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-700/50 rounded-xl transition-all duration-200 text-left group"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                                    <Activity className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <span className="text-zinc-100 font-medium block">
                                        Signo Vital
                                    </span>
                                    <span className="text-zinc-500 text-sm">
                                        Mantenimiento continuo con hábitos diarios
                                    </span>
                                </div>
                            </button>

                            {/* Quest Option */}
                            <button
                                onClick={() => handleSelectType('quest')}
                                className="w-full flex items-center gap-4 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-yellow-700/50 rounded-xl transition-all duration-200 text-left group"
                            >
                                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                                    <Scroll className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <span className="text-zinc-100 font-medium block">
                                        Misión
                                    </span>
                                    <span className="text-zinc-500 text-sm">
                                        Objetivo finito con recompensa de XP
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Step 2: Form */
                    <form onSubmit={handleSubmit}>
                        <button
                            type="button"
                            onClick={handleBack}
                            className="text-zinc-500 hover:text-zinc-300 text-sm mb-4 transition-colors"
                        >
                            ← Volver
                        </button>

                        <div className="flex items-center gap-2 mb-2">
                            {type === 'vital' ? (
                                <Activity className="w-5 h-5 text-emerald-400" />
                            ) : (
                                <Scroll className="w-5 h-5 text-yellow-400" />
                            )}
                            <h2 className="text-xl font-semibold text-zinc-100">
                                {type === 'vital' ? 'Nuevo Signo Vital' : 'Nueva Misión'}
                            </h2>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6">
                            {type === 'vital'
                                ? 'Define un área de tu vida para mantener saludable'
                                : 'Define un objetivo concreto con recompensa'}
                        </p>

                        {/* Name Input */}
                        <div className="mb-4">
                            <label className="block text-zinc-400 text-sm mb-2">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder={type === 'vital' ? 'Ej: Salud Física' : 'Ej: Ahorrar $1000'}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                                autoFocus
                            />
                        </div>

                        {/* Color Picker */}
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
                        {type === 'quest' && (
                            <>
                                {/* Target Value */}
                                <div className="mb-4">
                                    <label className="block text-zinc-400 text-sm mb-2">
                                        <Target className="w-3.5 h-3.5 inline mr-1" />
                                        Objetivo (valor numérico)
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!nombre.trim() || (type === 'quest' && (!targetValue || !xpReward))}
                            className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Crear {type === 'vital' ? 'Signo Vital' : 'Misión'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default NewGoalModal;
