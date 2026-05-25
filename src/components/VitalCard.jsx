import { Pencil, StickyNote, FileText, X, Check } from 'lucide-react';
import { useState } from 'react';
import MarkdownRenderer, { toggleMarkdownCheckbox } from './MarkdownRenderer';

const VitalCard = ({ data, onEdit, onUpdate, linkedHabitsCount = 0, calculatedValue = null }) => {
    const [showNotes, setShowNotes] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesText, setNotesText] = useState(data.notas || '');

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
            style={{ borderLeftColor: data.color || '#3B82F6', borderLeftWidth: '3px' }}
        >
            {/* Action buttons in top right */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Notes button - Skill ui-ux-pro-max: cursor-pointer & hover effects */}
                <button
                    onClick={handleToggleNotes}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${showNotes
                        ? 'bg-zinc-800 text-zinc-100'
                        : data.notas && data.notas.trim()
                            ? 'text-yellow-500/80 hover:text-yellow-400 hover:bg-zinc-800'
                            : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800'
                        } cursor-pointer`}
                    title="Notas de Meta"
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

            {/* Notes Section - Skill react-best-practices: rendering-conditional-render (operador ternario, no &&) */}
            {showNotes ? (
                <div className="mt-4 pt-3 border-t border-zinc-800/60 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 select-none">
                            <FileText className="w-3.5 h-3.5" />
                            Notas de Meta
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

export default VitalCard;
