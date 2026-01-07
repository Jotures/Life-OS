import { useState, useEffect } from 'react';
import { Plus, Target, ShieldOff, Zap, Flag, Clock } from 'lucide-react';
import { useLifeOS } from './hooks/useLifeOS';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import HabitCard from './components/HabitCard';
import AddictionCard from './components/AddictionCard';
import NewHabitModal from './components/NewHabitModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import EditHabitModal from './components/EditHabitModal';
import EditGoalModal from './components/EditGoalModal';
import MementoMori from './components/MementoMori';
import LevelBanner from './components/LevelBanner';
import GoalsSection from './components/GoalsSection';
import FocusStudio from './components/FocusStudio';

function App() {
    const [activeTab, setActiveTab] = useState('tracker');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState(null);
    const [habitToEdit, setHabitToEdit] = useState(null);
    const [metaToEdit, setMetaToEdit] = useState(null);
    const [playerProfile, setPlayerProfile] = useState(null);
    const [habitHistory, setHabitHistory] = useState(new Map());

    const {
        habitosConstruir,
        habitosDejar,
        metas,
        fechaNacimiento,
        agregarHabito,
        agregarMeta,
        actualizarHabito,
        actualizarMeta,
        eliminarHabito,
        eliminarMeta,
        marcarHabito,
        desmarcarHabito,
        reiniciarHabito,
        setFechaNacimiento,
        getMementoMoriData,
        estaCompletadoHoy
    } = useLifeOS();

    // Fetch player profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('perfil_jugador')
                .select('*')
                .single();

            if (error) {
                console.error('Error fetching player profile:', error);
            } else {
                setPlayerProfile(data);
            }
        };

        fetchProfile();
    }, []);

    // Fetch habit history for goal progress calculation
    useEffect(() => {
        const fetchAllHistory = async () => {
            const today = new Date();
            const startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 14);

            const { data } = await supabase
                .from('historial_habitos')
                .select('habito_id, fecha')
                .gte('fecha', startDate.toISOString().split('T')[0]);

            const historyMap = new Map();
            data?.forEach(item => {
                if (!historyMap.has(item.habito_id)) {
                    historyMap.set(item.habito_id, new Set());
                }
                historyMap.get(item.habito_id).add(item.fecha);
            });
            setHabitHistory(historyMap);
        };
        fetchAllHistory();
    }, [habitosConstruir]);

    const mementoData = getMementoMoriData();

    const handleMarcarHabito = (id) => {
        if (estaCompletadoHoy(id)) {
            desmarcarHabito(id, setPlayerProfile);
        } else {
            marcarHabito(id, setPlayerProfile);
        }
    };

    const handleConfirmDelete = () => {
        if (habitToDelete) {
            eliminarHabito(habitToDelete.id);
            setHabitToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Header />

                {/* RPG Level Banner */}
                <LevelBanner profile={playerProfile} />

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('tracker')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'tracker'
                            ? 'bg-zinc-100 text-zinc-900'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-300 border border-zinc-800'
                            }`}
                    >
                        <Zap className="w-4 h-4" />
                        Mi Día
                    </button>
                    <button
                        onClick={() => setActiveTab('planning')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'planning'
                            ? 'bg-zinc-100 text-zinc-900'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-300 border border-zinc-800'
                            }`}
                    >
                        <Flag className="w-4 h-4" />
                        Metas
                    </button>
                    <button
                        onClick={() => setActiveTab('focus')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'focus'
                            ? 'bg-zinc-100 text-zinc-900'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-300 border border-zinc-800'
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        Enfoque
                    </button>
                </div>

                {/* TRACKER TAB: Daily habits and vices */}
                {activeTab === 'tracker' && (
                    <>
                        {/* Habits Section */}
                        <section className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-lg font-semibold text-zinc-100">
                                        Hábitos a Construir
                                    </h2>
                                </div>
                                <span className="text-zinc-500 text-sm">
                                    {habitosConstruir.filter(h => estaCompletadoHoy(h.id)).length}/{habitosConstruir.length} hoy
                                </span>
                            </div>

                            {habitosConstruir.length === 0 ? (
                                <p className="text-zinc-500 text-sm py-4 text-center">
                                    No tienes hábitos todavía. ¡Crea uno!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {habitosConstruir.map(habito => (
                                        <HabitCard
                                            key={habito.id}
                                            habito={habito}
                                            completadoHoy={estaCompletadoHoy(habito.id)}
                                            onMarcar={() => handleMarcarHabito(habito.id)}
                                            onEdit={() => setHabitToEdit(habito)}
                                            onEliminar={() => setHabitToDelete({ id: habito.id, nombre: habito.nombre, tipo: habito.tipo })}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Addictions Section */}
                        <section className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldOff className="w-5 h-5 text-red-400" />
                                <h2 className="text-lg font-semibold text-zinc-100">
                                    Vicios a Dejar
                                </h2>
                            </div>

                            {habitosDejar.length === 0 ? (
                                <p className="text-zinc-500 text-sm py-4 text-center">
                                    No tienes vicios registrados. ¡Bien por ti!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {habitosDejar.map(habito => (
                                        <AddictionCard
                                            key={habito.id}
                                            habito={habito}
                                            onReiniciar={() => reiniciarHabito(habito.id, setPlayerProfile)}
                                            onEliminar={() => setHabitToDelete({ id: habito.id, nombre: habito.nombre, tipo: habito.tipo })}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Add button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all duration-200 mb-8"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Nuevo Hábito</span>
                        </button>

                        {/* Memento Mori */}
                        <MementoMori
                            fechaNacimiento={fechaNacimiento}
                            onSetFechaNacimiento={setFechaNacimiento}
                            mementoData={mementoData}
                        />
                    </>
                )}

                {/* PLANNING TAB: Goals management */}
                {activeTab === 'planning' && (
                    <GoalsSection
                        metas={metas}
                        habitos={habitosConstruir}
                        habitHistory={habitHistory}
                        onAddMeta={agregarMeta}
                        onEditMeta={setMetaToEdit}
                    />
                )}

                {/* FOCUS TAB: Standalone Pomodoro Timer */}
                {activeTab === 'focus' && (
                    <FocusStudio />
                )}

                {/* Footer */}
                <footer className="mt-8 text-center text-zinc-600 text-sm">
                    <p>Life OS — Tu sistema de gestión personal</p>
                </footer>

                {/* New Habit Modal */}
                <NewHabitModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={agregarHabito}
                    metas={metas}
                />

                {/* Edit Habit Modal */}
                <EditHabitModal
                    isOpen={!!habitToEdit}
                    habito={habitToEdit}
                    metas={metas}
                    onSave={actualizarHabito}
                    onClose={() => setHabitToEdit(null)}
                />

                {/* Edit Goal Modal */}
                <EditGoalModal
                    isOpen={!!metaToEdit}
                    meta={metaToEdit}
                    onSave={actualizarMeta}
                    onDelete={eliminarMeta}
                    onClose={() => setMetaToEdit(null)}
                />

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    isOpen={!!habitToDelete}
                    habitName={habitToDelete?.nombre}
                    habitType={habitToDelete?.tipo}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setHabitToDelete(null)}
                />
            </div>
        </div>
    );
}

export default App;
