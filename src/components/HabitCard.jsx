import { Check, Flame, Pencil, Trash2, Timer, StickyNote, FileText, X } from 'lucide-react';
import { useState } from 'react';
import HabitHeatmap from './HabitHeatmap';
import PomodoroTimer from './PomodoroTimer';
import MarkdownRenderer, { toggleMarkdownCheckbox } from './MarkdownRenderer';

const HabitCard = ({ habito, onMarcar, onEliminar, onEdit, onUpdate, completadoHoy }) => {
    const [showDelete, setShowDelete] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesText, setNotesText] = useState(habito.notas || '');

    const handleToggleNotes = () => {
        // Skill clean-code: js-early-exit (cláusulas de guardia)
        if (showNotes) {
            setShowNotes(false);
            setIsEditingNotes(false);
            return;
        }
        setShowNotes(true);
        setNotesText(habito.notas || '');
    };

    const handleSaveNotes = () => {
        if (onUpdate) {
            onUpdate(habito.id, { notas: notesText });
        }
        setIsEditingNotes(false);
    };

    const handleCancelNotes = () => {
        setNotesText(habito.notas || '');
        setIsEditingNotes(false);
    };

    const handleToggleCheckbox = (targetIdx) => {
        const updatedNotes = toggleMarkdownCheckbox(habito.notas || '', targetIdx);
        setNotesText(updatedNotes);
        if (onUpdate) {
            onUpdate(habito.id, { notas: updatedNotes });
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
            className="group relative bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200"
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Left side: Checkbox + Name/Tag column */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                        onClick={onMarcar}
                        className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${completadoHoy
                            ? 'bg-zinc-100 border-zinc-100'
                            : 'border-zinc-600 hover:border-zinc-400'
                            }`}
                    >
                        {completadoHoy && (
                            <Check className="w-4 h-4 text-zinc-900" strokeWidth={3} />
                        )}
                    </button>

                    {/* Name and Goal Tag (stacked vertically) */}
                    <div className="flex flex-col gap-1 min-w-0">
                        {/* Habit name */}
                        <span className={`text-zinc-100 font-medium truncate ${completadoHoy ? 'line-through text-zinc-500' : ''}`}>
                            {habito.nombre}
                        </span>

                        {/* Goal Badge - below name for mobile friendliness */}
                        {habito.meta && (
                            <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit"
                                style={{
                                    backgroundColor: habito.meta.color + '25',
                                    color: habito.meta.color
                                }}
                            >
                                🎯 {habito.meta.nombre}
                            </span>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Streak + Actions (stacked) */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {/* Streak counter */}
                    <div className="flex items-center gap-1.5">
                        <Flame className={`w-4 h-4 ${habito.racha > 0 ? 'text-orange-500' : 'text-zinc-600'}`} />
                        <span className={`text-sm font-bold ${habito.racha > 0 ? 'text-orange-500' : 'text-zinc-500'}`}>
                            {habito.racha}
                        </span>
                    </div>

                    {/* Action buttons row */}
                    <div className="flex items-center gap-1">
                        {/* Pomodoro Timer button */}
                        <button
                            onClick={() => setShowTimer(!showTimer)}
                            className={`p-1 rounded-lg transition-all duration-200 ${showTimer
                                ? 'bg-emerald-600 text-white'
                                : 'text-zinc-600 hover:text-emerald-400 hover:bg-zinc-800'
                                } ${showDelete || showTimer ? 'opacity-100' : 'opacity-0'} cursor-pointer`}
                            title="Pomodoro Timer"
                        >
                            <Timer className="w-3.5 h-3.5" />
                        </button>

                        {/* Notes button - Skill ui-ux-pro-max: cursor-pointer & hover effects */}
                        <button
                            onClick={handleToggleNotes}
                            className={`p-1 rounded-lg transition-all duration-200 ${showNotes
                                ? 'bg-zinc-800 text-zinc-100'
                                : habito.notas && habito.notas.trim()
                                    ? 'text-yellow-500/80 hover:text-yellow-400 hover:bg-zinc-800/60'
                                    : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800'
                                } ${showDelete || showNotes ? 'opacity-100' : 'opacity-0'} cursor-pointer`}
                            title="Notas de Hábito"
                        >
                            <StickyNote className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit button */}
                        <button
                            onClick={onEdit}
                            className={`p-1 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-zinc-800 transition-all duration-200 ${showDelete ? 'opacity-100' : 'opacity-0'} cursor-pointer`}
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button */}
                        <button
                            onClick={onEliminar}
                            className={`p-1 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-all duration-200 ${showDelete ? 'opacity-100' : 'opacity-0'} cursor-pointer`}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Pomodoro Timer (Collapsible) */}
            {showTimer && (
                <PomodoroTimer onClose={() => setShowTimer(false)} />
            )}

            {/* Heatmap - Last 14 days */}
            <HabitHeatmap habitId={habito.id} streak={habito.racha} />

            {/* Notes Section - Skill react-best-practices: rendering-conditional-render (operador ternario, no &&) */}
            {showNotes ? (
                <div className="mt-4 pt-3 border-t border-zinc-800/60 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 select-none">
                            <FileText className="w-3.5 h-3.5" />
                            Notas del Hábito
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
                            {habito.notas && habito.notas.trim() ? (
                                <MarkdownRenderer text={habito.notas} onToggleCheckbox={handleToggleCheckbox} />
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

export default HabitCard;
