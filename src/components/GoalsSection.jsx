import { useMemo } from 'react';
import { Activity, Target, Plus } from 'lucide-react';
import VitalCard from './VitalCard';
import QuestCard from './QuestCard';

const GoalsSection = ({
    metas = [],
    habitos = [],
    habitHistory = new Map(),
    onAddMeta,
    onEditMeta,
    onUpdateMeta,
    onCompleteMeta
}) => {

    // Separate metas by type
    const vitals = useMemo(() =>
        metas.filter(m => m.type === 'vital' || !m.type),
        [metas]
    );

    const quests = useMemo(() =>
        metas.filter(m => m.type === 'quest'),
        [metas]
    );

    // Calculate health for each vital based on linked habits
    const getVitalHealth = (metaId) => {
        const linkedHabits = habitos.filter(h => h.meta_id === metaId);
        if (linkedHabits.length === 0) return 0;

        const today = new Date();
        const last14Days = [];
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            last14Days.push(d.toISOString().split('T')[0]);
        }

        let totalConsistency = 0;
        linkedHabits.forEach(habit => {
            const history = habitHistory?.get(habit.id) || new Set();
            const completed = last14Days.filter(d => history.has(d)).length;
            totalConsistency += (completed / 14) * 100;
        });

        return Math.round(totalConsistency / linkedHabits.length);
    };

    // Get linked habits count for a vital
    const getLinkedHabitsCount = (metaId) => {
        return habitos.filter(h => h.meta_id === metaId).length;
    };

    // Handle quest progress update
    const handleQuestProgress = (questId, updates) => {
        if (onUpdateMeta) {
            onUpdateMeta(questId, updates);
        }
    };

    // Handle quest completion
    const handleQuestComplete = (quest) => {
        if (onCompleteMeta) {
            onCompleteMeta(quest);
        }
    };

    return (
        <div className="space-y-6">
            {/* SECTION: Signos Vitales */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-lg font-semibold text-zinc-100">
                            Signos Vitales
                        </h2>
                    </div>
                    <span className="text-zinc-500 text-sm">
                        {vitals.length} área{vitals.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {vitals.length === 0 ? (
                    <p className="text-zinc-500 text-sm py-4 text-center">
                        No tienes signos vitales. Crea uno para vincular hábitos.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {vitals.map(vital => (
                            <VitalCard
                                key={vital.id}
                                data={vital}
                                linkedHabitsCount={getLinkedHabitsCount(vital.id)}
                                calculatedValue={getVitalHealth(vital.id)}
                                onEdit={() => onEditMeta(vital)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* SECTION: Misiones Activas */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-lg font-semibold text-zinc-100">
                            Misiones Activas
                        </h2>
                    </div>
                    <span className="text-zinc-500 text-sm">
                        {quests.length} misión{quests.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                {quests.length === 0 ? (
                    <p className="text-zinc-500 text-sm py-4 text-center">
                        No tienes misiones activas. Las misiones tienen objetivos finitos con recompensas XP.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {quests.map(quest => (
                            <QuestCard
                                key={quest.id}
                                data={quest}
                                onProgress={handleQuestProgress}
                                onComplete={handleQuestComplete}
                                onEdit={() => onEditMeta(quest)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Add New Goal Button */}
            <button
                onClick={onAddMeta}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all duration-200"
            >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Nueva Meta</span>
            </button>
        </div>
    );
};

export default GoalsSection;
