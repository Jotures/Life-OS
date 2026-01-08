import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';

export function LevelUpModal({ newLevel, onClose }) {
    useEffect(() => {
        // Fire Confetti from center
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#ffffff']
        });

        // Optional: Play victory sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play failed", e));
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-900 border-2 border-yellow-500 p-8 rounded-3xl shadow-2xl shadow-yellow-500/20 text-center max-w-sm mx-4 transform animate-in zoom-in-95 duration-300 relative overflow-hidden">

                {/* Glowing Background Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="mx-auto bg-yellow-500/20 w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Trophy className="w-12 h-12 text-yellow-400" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                        ¡NIVEL <span className="text-yellow-400">{newLevel}</span>!
                    </h2>

                    <p className="text-zinc-400 mb-8">
                        Has superado tus límites. La disciplina es el camino.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/25"
                    >
                        ¡CONTINUAR! ⚔️
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LevelUpModal;
