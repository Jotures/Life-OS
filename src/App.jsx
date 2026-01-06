import { useState, useEffect } from 'react';
import { Plus, Target, ShieldOff } from 'lucide-react';
import { useLifeOS } from './hooks/useLifeOS';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import HabitCard from './components/HabitCard';
import AddictionCard from './components/AddictionCard';
import NewHabitModal from './components/NewHabitModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import MementoMori from './components/MementoMori';
import LevelBanner from './components/LevelBanner';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState(null); // { id, nombre, tipo }
    const [playerProfile, setPlayerProfile] = useState(null);

    const {
        habitosConstruir,
        habitosDejar,
        fechaNacimiento,
        agregarHabito,
        eliminarHabito,
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
                                    onReiniciar={() => reiniciarHabito(habito.id)}
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

                {/* Footer */}
                <footer className="mt-8 text-center text-zinc-600 text-sm">
                    <p>Life OS — Tu sistema de gestión personal</p>
                </footer>

                {/* New Habit Modal */}
                <NewHabitModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={agregarHabito}
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

