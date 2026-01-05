import { useState } from 'react';
import { Calendar } from 'lucide-react';

const MementoMori = ({ fechaNacimiento, onSetFechaNacimiento, mementoData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputDate, setInputDate] = useState(fechaNacimiento || '');
    const [showFuture, setShowFuture] = useState(false);

    // Default: show years 0-30, Expanded: show 0-70
    const renderLimit = showFuture ? 70 : 31;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputDate) {
            onSetFechaNacimiento(inputDate);
            setIsEditing(false);
        }
    };

    const renderGrid = () => {
        if (!mementoData) return null;

        const { currentWeekIndex, totalYears } = mementoData;

        return (
            <div className="flex flex-col">
                {Array.from({ length: totalYears }).map((_, yearIndex) => {
                    // Hide years beyond the render limit
                    if (yearIndex >= renderLimit) return null;

                    const yearNum = yearIndex + 1;
                    const isDecade = yearNum % 10 === 0 && yearNum !== 70;
                    const rowClass = `flex flex-row items-center justify-center gap-[2px] ${isDecade ? 'mb-4' : 'mb-[1px]'}`;

                    return (
                        <div key={yearIndex} className={rowClass}>
                            {/* 52 WEEKS */}
                            {Array.from({ length: 52 }).map((_, weekIndex) => {
                                const iterationWeekIndex = yearIndex * 52 + weekIndex;

                                // 3-state logic
                                let squareClass = '';
                                if (iterationWeekIndex < currentWeekIndex) {
                                    // PAST (Vivido)
                                    squareClass = 'bg-zinc-700';
                                } else if (iterationWeekIndex === currentWeekIndex) {
                                    // PRESENT (Hoy)
                                    squareClass = 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]';
                                } else {
                                    // FUTURE (Por vivir)
                                    squareClass = 'border border-zinc-600 bg-transparent';
                                }

                                return (
                                    <div
                                        key={weekIndex}
                                        className={`w-2.5 h-2.5 rounded-[1px] ${squareClass}`}
                                    />
                                );
                            })}

                            {/* LABEL CONTAINER - exists in EVERY row for consistent height */}
                            <div className="w-6 ml-2 text-[10px] leading-none text-zinc-500 flex items-center h-2.5">
                                {yearNum % 5 === 0 ? yearNum : ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-zinc-100 tracking-[0.3em] uppercase">
                    MEMENTO&nbsp;&nbsp;MORI
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
                            Has vivido el <span className="text-zinc-300 font-medium">{mementoData.porcentajeVivido}%</span> de tu vida (asumiendo 70 años)
                        </p>
                    )}

                    {/* Grid */}
                    <div className="mb-4 overflow-x-auto">
                        {renderGrid()}
                    </div>

                    {/* Toggle button at bottom */}
                    <button
                        onClick={() => setShowFuture(!showFuture)}
                        className="mb-6 text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline decoration-dotted"
                    >
                        {showFuture ? '▲ Ocultar futuro lejano' : '▼ Ver vida completa (70 años)'}
                    </button>

                    {/* Legend */}
                    <div className="flex items-center gap-6 text-xs text-zinc-500 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-zinc-700 rounded-[1px]" />
                            <span>Vivido</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white rounded-[1px] shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                            <span>Hoy</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-zinc-600 rounded-[1px]" />
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
