import { Minus, Plus, Trophy, Pencil, Sparkles, StickyNote, FileText, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import MarkdownRenderer, { toggleMarkdownCheckbox } from './MarkdownRenderer';

const QuestCard = ({ data, onProgress, onComplete, onEdit, onUpdate }) => {
    const [showNotes, setShowNotes] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesText, setNotesText] = useState(data.notas || '');

    const current = Number(data.current_value) || 0;
    const target = Number(data.target_value) || 100;
    const progress = Math.round((current / target) * 100);
    const isCompleted = current >= target;

    // Number of segments to display
    const TOTAL_SEGMENTS = 10;
    const filledSegments = Math.round((current / target) * TOTAL_SEGMENTS);

    // Determine status label
    const getStatus = (pct) => {
        if (pct >= 100) return { label: 'COMPLETO', color: 'text-yellow-400' };
        if (pct >= 70) return { label: 'AVANZADO', color: 'text-emerald-400' };
        if (pct >= 30) return { label: 'EN PROGRESO', color: 'text-amber-400' };
        return { label: 'CRÍTICO', color: 'text-rose-400' };
    };

    const status = getStatus(progress);

    const handleDecrement = () => {
        const step = Math.ceil(target / TOTAL_SEGMENTS);
        const newVal = Math.max(0, current - step);
        onProgress(data.id, { current_value: newVal });
    };

    const handleIncrement = () => {
        const step = Math.ceil(target / TOTAL_SEGMENTS);
        const newVal = Math.min(target, current + step);
        onProgress(data.id, { current_value: newVal });
    };

    const handleToggleNotes = () => {
        // Skill clean-code: js-early-exit (cláusulas de guardia)
        if (showNotes) {
            setShowNotes(false);
            setIsEditingNotes(false);
            return;
        }
        setShowNotes(true);
        setNotesText(data.notas || '');
    };

    const handleSaveNotes = () => {
        if (onUpdate) {
            onUpdate(data.id, { notas: notesText });
        }
        setIsEditingNotes(false);
    };

    const handleCancelNotes = () => {
        setNotesText(data.notas || '');
        setIsEditingNotes(false);
    };

    const handleToggleCheckbox = (targetIdx) => {
        const updatedNotes = toggleMarkdownCheckbox(data.notas || '', targetIdx);
        setNotesText(updatedNotes);
        if (onUpdate) {
            onUpdate(data.id, { notas: updatedNotes });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            setNotesText(newValue);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 2;
            }, 0);
        }
    };

    return (
        <div
            className="relative bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 group"
            style={{ borderLeftColor: data.color || '#EAB308', borderLeftWidth: '3px' }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-zinc-100 font-medium text-sm truncate">
                            {data.nombre}
                        </h4>
                        {/* XP Badge */}
                        <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-500 flex-shrink-0">
                            <Sparkles className="w-2.5 h-2.5" />
                            +{data.xp_reward || 500}
                        </span>
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider ${status.color}`}>
                        {status.label}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold font-mono ${isCompleted ? 'text-yellow-400' : 'text-zinc-100'}`}>
                        {progress}%
                    </span>
                    
                    {/* Action buttons container */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Notes button - Skill ui-ux-pro-max: cursor-pointer & hover effects */}
                        <button
                            onClick={handleToggleNotes}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${showNotes
                                ? 'bg-zinc-800 text-zinc-100'
                                : data.notas && data.notas.trim()
                                    ? 'text-yellow-500/80 hover:text-yellow-400 hover:bg-zinc-800'
                                    : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800'
                                } cursor-pointer`}
                            title="Notas de Misión"
                        >
                            <StickyNote className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit button */}
                        <button
                            onClick={onEdit}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Control */}
            {isCompleted ? (
                <button
                    onClick={handleComplete}
                    className="w-full py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    <Trophy className="w-4 h-4" />
                    Reclamar Recompensa
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    {/* Decrement button */}
                    <button
                        onClick={handleDecrement}
                        disabled={current <= 0}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Minus className="w-4 h-4" />
                    </button>

                    {/* Segmented Progress Grid */}
                    <div className="flex-1 flex gap-1">
                        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-3 flex-1 rounded-sm transition-all duration-300 ${i < filledSegments
                                        ? ''
                                        : 'bg-zinc-800'
                                    }`}
                                style={i < filledSegments ? { backgroundColor: data.color || '#EAB308' } : {}}
                            />
                        ))}
                    </div>

                    {/* Increment button */}
                    <button
                        onClick={handleIncrement}
                        disabled={current >= target}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Progress text */}
            <div className="flex justify-center mt-2">
                <span className="text-[10px] text-zinc-500 font-mono">
                    {current} / {target}
                </span>
            </div>

            {/* Notes Section - Skill react-best-practices: rendering-conditional-render (operador ternario, no &&) */}
            {showNotes ? (
                <div className="mt-4 pt-3 border-t border-zinc-800/60 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 select-none">
                            <FileText className="w-3.5 h-3.5" />
                            Notas de Misión
                        </span>
                        
                        {!isEditingNotes ? (
                            <button
                                onClick={() => setIsEditingNotes(true)}
                                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <Pencil className="w-3 h-3" />
                                Editar
                            </button>
                        ) : null}
                    </div>

                    {!isEditingNotes ? (
                        /* LECTURA: MarkdownRenderer */
                        <div className="bg-zinc-950/30 border border-zinc-800/40 rounded-lg p-3 min-h-[50px]">
                            {data.notas && data.notas.trim() ? (
                                <MarkdownRenderer text={data.notas} onToggleCheckbox={handleToggleCheckbox} />
                            ) : (
                                <p className="text-zinc-600 text-xs italic select-none">
                                    No hay notas registradas. Haz clic en "Editar" para añadir anotaciones en formato Markdown.
                                </p>
                            )}
                        </div>
                    ) : (
                        /* EDICIÓN: Textarea + Guardar/Cancelar buttons */
                        <div className="space-y-2">
                            <textarea
                                value={notesText}
                                onChange={(e) => setNotesText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe tus notas aquí... Puedes usar formato Markdown:
# Título
- [ ] Tarea pendiente
- [x] Tarea completada
**texto en negrita**
*texto en cursiva*
`código` o [enlaces](url)"
                                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors font-sans min-h-[140px]"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleCancelNotes}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveNotes}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/30 text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Guardar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default QuestCard;
