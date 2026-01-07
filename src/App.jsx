import { useState, useEffect } from 'react';
import { Plus, Target, ShieldOff, Zap, Flag, Clock, BarChart3, LayoutGrid } from 'lucide-react';
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
import AnalyticsDashboard from './components/AnalyticsDashboard';

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

                {/* Icon Dock Navigation */}
                <nav className="flex justify-center gap-1 mb-6 p-2 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800">
                    {[
                        { id: 'tracker', icon: LayoutGrid, label: 'Mi Día' },
                        { id: 'planning', icon: Target, label: 'Metas' },
                        { id: 'focus', icon: Clock, label: 'Enfoque' },
                        { id: 'analytics', icon: BarChart3, label: 'Progreso' }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'text-zinc-100'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                title={tab.label}
                            >
                                <Icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : ''}`} />
                                <span className={`text-[10px] font-medium transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                    {tab.label}
                                </span>
                                {/* Active indicator dot */}
                                {isActive && (
                                    <span className="absolute -bottom-0.5 w-1 h-1 bg-emerald-400 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

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

                {/* ANALYTICS TAB: Progress Dashboard */}
                {activeTab === 'analytics' && (
                    <AnalyticsDashboard
                        habitos={habitosConstruir}
                        vicios={habitosDejar}
                        metas={metas}
                        profile={playerProfile}
                    />
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
