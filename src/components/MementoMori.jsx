import { useState } from 'react';
import { Calendar } from 'lucide-react';

const MementoMori = ({ fechaNacimiento, onSetFechaNacimiento, mementoData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputDate, setInputDate] = useState(fechaNacimiento || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputDate) {
            onSetFechaNacimiento(inputDate);
            setIsEditing(false);
        }
    };

    const renderGrid = () => {
        if (!mementoData) return null;

        const { semanasVividas, totalSemanas } = mementoData;
        const squares = [];

        // Create 80 rows (years) x 52 columns (weeks)
        for (let i = 0; i < totalSemanas; i++) {
            const isPast = i < semanasVividas;
            const isPresent = i === semanasVividas;

            squares.push(
                <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-[1px] ${isPresent
                            ? 'bg-zinc-100 animate-pulse-glow'
                            : isPast
                                ? 'bg-zinc-600'
                                : 'border border-zinc-700'
                        }`}
                />
            );
        }

        return squares;
    };

    return (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-100">
                    Memento Mori
                </h2>
                {fechaNacimiento && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                    </button>
                )}
            </div>

            {!fechaNacimiento || isEditing ? (
                /* Birth date input */
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-zinc-400 text-sm">
                        Ingresa tu fecha de nacimiento para visualizar tu vida.
                    </p>
                    <div className="flex gap-3">
                        <input
                            type="date"
                            value={inputDate}
                            onChange={(e) => setInputDate(e.target.value)}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!inputDate}
                            className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            Guardar
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                /* Grid visualization */
                <div>
                    {mementoData && (
                        <p className="text-zinc-500 text-sm mb-4">
                            Has vivido el <span className="text-zinc-300 font-medium">{mementoData.porcentajeVivido}%</span> de tu vida (asumiendo 80 años)
                        </p>
                    )}

                    {/* The grid */}
                    <div
                        className="grid gap-[2px] mb-6 overflow-hidden"
                        style={{
                            gridTemplateColumns: 'repeat(52, minmax(0, 1fr))',
                            maxHeight: '320px'
                        }}
                    >
                        {renderGrid()}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-zinc-600 rounded-[1px]" />
                            <span>Vivido</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-zinc-100 rounded-[1px]" />
                            <span>Hoy</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 border border-zinc-700 rounded-[1px]" />
                            <span>Por vivir</span>
                        </div>
                    </div>

                    {/* Seneca quote */}
                    <blockquote className="border-l-2 border-zinc-700 pl-4 italic text-zinc-500 text-sm">
                        "No tenemos poco tiempo, sino que perdemos mucho."
                        <footer className="text-zinc-600 mt-1 not-italic">— Séneca</footer>
                    </blockquote>
                </div>
            )}
        </div>
    );
};

export default MementoMori;
