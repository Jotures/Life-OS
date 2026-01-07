import { useState } from 'react';
import { X, Target, ShieldOff } from 'lucide-react';

const NewHabitModal = ({ isOpen, onClose, onSubmit, metas = [] }) => {
    const [step, setStep] = useState('select'); // 'select' | 'name'
    const [tipo, setTipo] = useState(null);
    const [nombre, setNombre] = useState('');
    const [metaId, setMetaId] = useState('');

    const handleSelectType = (selectedTipo) => {
        setTipo(selectedTipo);
        setStep('name');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombre.trim() && tipo) {
            onSubmit(nombre.trim(), tipo, metaId || null);
            handleClose();
        }
    };

    const handleClose = () => {
        setStep('select');
        setTipo(null);
        setNombre('');
        setMetaId('');
        onClose();
    };

    const handleBack = () => {
        setStep('select');
        setTipo(null);
        setNombre('');
        setMetaId('');
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
                    /* Step 1: Select type */
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-100 mb-2">
                            Nuevo Hábito
                        </h2>
                        <p className="text-zinc-400 text-sm mb-6">
                            ¿Qué quieres hacer?
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleSelectType('construir')}
                                className="w-full flex items-center gap-4 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-xl transition-all duration-200 text-left"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <span className="text-zinc-100 font-medium block">
                                        Construir un Hábito
                                    </span>
                                    <span className="text-zinc-500 text-sm">
                                        Algo que quieres hacer todos los días
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleSelectType('dejar')}
                                className="w-full flex items-center gap-4 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-xl transition-all duration-200 text-left"
                            >
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <ShieldOff className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <span className="text-zinc-100 font-medium block">
                                        Dejar un Vicio
                                    </span>
                                    <span className="text-zinc-500 text-sm">
                                        Algo que quieres dejar de hacer
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Step 2: Enter name */
                    <form onSubmit={handleSubmit}>
                        <button
                            type="button"
                            onClick={handleBack}
                            className="text-zinc-500 hover:text-zinc-300 text-sm mb-4 transition-colors"
                        >
                            ← Volver
                        </button>

                        <h2 className="text-xl font-semibold text-zinc-100 mb-2">
                            {tipo === 'construir' ? 'Nuevo Hábito' : 'Dejar un Vicio'}
                        </h2>
                        <p className="text-zinc-400 text-sm mb-6">
                            {tipo === 'construir'
                                ? '¿Qué hábito quieres construir?'
                                : '¿Qué quieres dejar de hacer?'}
                        </p>

                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder={tipo === 'construir' ? 'Ej: Leer 30 minutos' : 'Ej: No fumar'}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors mb-4"
                            autoFocus
                        />

                        {/* Goal Selector */}
                        {metas.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-zinc-400 text-sm mb-2">
                                    Vincular a Meta (opcional)
                                </label>
                                <select
                                    value={metaId}
                                    onChange={(e) => setMetaId(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="">Sin meta</option>
                                    {metas.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!nombre.trim()}
                            className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Crear
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default NewHabitModal;
