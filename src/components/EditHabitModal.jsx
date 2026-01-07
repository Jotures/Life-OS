import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditHabitModal = ({ isOpen, habito, metas = [], onSave, onClose }) => {
    const [nombre, setNombre] = useState('');
    const [metaId, setMetaId] = useState('');

    // Reset form when modal opens with new habit
    useEffect(() => {
        if (habito) {
            setNombre(habito.nombre || '');
            setMetaId(habito.meta_id || '');
        }
    }, [habito]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombre.trim() && habito) {
            onSave(habito.id, {
                nombre: nombre.trim(),
                meta_id: metaId || null
            });
            onClose();
        }
    };

    if (!isOpen || !habito) return null;

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

                <h2 className="text-xl font-semibold text-zinc-100 mb-2">
                    Editar Hábito
                </h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Modifica el nombre o vincula a una meta
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Name input */}
                    <div className="mb-4">
                        <label className="block text-zinc-400 text-sm mb-2">
                            Nombre del hábito
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre del hábito"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* Goal Selector */}
                    <div className="mb-6">
                        <label className="block text-zinc-400 text-sm mb-2">
                            Vincular a Meta
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

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={!nombre.trim()}
                        className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditHabitModal;
