import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Coins, Plus, Trash2, ShoppingCart, Sparkles, X } from 'lucide-react';

// Hardcoded player ID for single-user mode (no auth required)
const PLAYER_ID = '00000000-0000-0000-0000-000000000000';

const EMOJI_OPTIONS = ['🎮', '📺', '🍕', '☕', '🎬', '🛍️', '🎧', '🍦', '🎂', '💤', '🎁', '✨'];

export default function RewardsShop({ currentXP = 0, onPurchase }) {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newReward, setNewReward] = useState({ nombre: '', costo: '', emoji: '🎁' });
    const [purchasing, setPurchasing] = useState(null);
    const [notification, setNotification] = useState(null);

    // Fetch rewards on mount
    useEffect(() => {
        fetchRewards();
    }, []);

    async function fetchRewards() {
        console.log('Fetching rewards...');
        setLoading(true);

        // Simple fetch - no auth check needed
        const { data, error } = await supabase
            .from('recompensas')
            .select('*')
            .order('costo', { ascending: true });

        if (error) {
            console.error('Error fetching rewards:', error);
        } else {
            console.log('Rewards loaded:', data);
            setRewards(data || []);
        }
        setLoading(false);
    }

    async function addReward(e) {
        e.preventDefault();
        console.log('addReward called!', newReward);

        // Validate fields
        if (!newReward.nombre.trim() || !newReward.costo) {
            alert('Por favor escribe un nombre y un costo');
            return;
        }

        try {
            // Prepare payload with hardcoded player ID
            const payload = {
                user_id: PLAYER_ID,
                nombre: newReward.nombre.trim(),
                costo: parseInt(newReward.costo, 10),
                emoji: newReward.emoji || '🎁'
            };
            console.log('Inserting reward:', payload);

            // Direct insert - no auth check
            const { error } = await supabase
                .from('recompensas')
                .insert([payload]);

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Reward added successfully!');
            setNewReward({ nombre: '', costo: '', emoji: '🎁' });
            setIsFormOpen(false);
            fetchRewards();

        } catch (error) {
            console.error('Error adding reward:', error);
            alert('Error al agregar: ' + error.message);
        }
    }

    async function buyReward(item) {
        if (currentXP < item.costo) {
            setNotification(`❌ No tienes suficiente XP. Necesitas ${item.costo - currentXP} más.`);
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        setPurchasing(item.id);

        const { error } = await supabase
            .from('perfil_jugador')
            .update({ xp: currentXP - item.costo })
            .eq('id', 1);

        if (error) {
            console.error('Error purchasing:', error);
            setNotification('❌ Error al comprar');
            setTimeout(() => setNotification(null), 3000);
        } else {
            if (onPurchase) onPurchase();
            setNotification(`� ¡Canjeado: ${item.nombre}! -${item.costo} XP`);
            setTimeout(() => setNotification(null), 3000);
        }

        setPurchasing(null);
    }

    async function deleteReward(id) {
        const { error } = await supabase
            .from('recompensas')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting:', error);
        } else {
            fetchRewards();
        }
    }

    return (
        <section className="mb-8">
            {/* Header with XP Display */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Coins className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-100">Tienda de Loot</h2>
                        <p className="text-xs text-zinc-500">Gasta tu XP en recompensas</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-lg">{currentXP}</span>
                    <span className="text-yellow-500/60 text-sm">XP</span>
                </div>
            </div>

            {/* Add Reward Button / Form */}
            {!isFormOpen ? (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 mb-4 bg-zinc-900/50 hover:bg-zinc-900 border border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl text-zinc-400 hover:text-amber-400 transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Agregar Recompensa</span>
                </button>
            ) : (
                <form onSubmit={addReward} className="mb-4 p-4 bg-zinc-900 border border-zinc-700 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-zinc-300 text-sm font-medium">Nueva Recompensa</span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsFormOpen(false);
                                setNewReward({ nombre: '', costo: '', emoji: '🎁' });
                            }}
                            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex gap-2 mb-3">
                        {/* Emoji selector */}
                        <div className="flex flex-wrap gap-1 p-2 bg-zinc-800 rounded-lg max-w-[140px]">
                            {EMOJI_OPTIONS.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setNewReward({ ...newReward, emoji })}
                                    className={`w-7 h-7 text-lg rounded transition-all ${newReward.emoji === emoji
                                        ? 'bg-amber-500/30 ring-1 ring-amber-500'
                                        : 'hover:bg-zinc-700'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 space-y-2">
                            {/* Name input */}
                            <input
                                type="text"
                                value={newReward.nombre}
                                onChange={(e) => setNewReward({ ...newReward, nombre: e.target.value })}
                                placeholder="Nombre de la recompensa..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                                autoFocus
                            />
                            {/* Cost input */}
                            <input
                                type="number"
                                value={newReward.costo}
                                onChange={(e) => setNewReward({ ...newReward, costo: e.target.value })}
                                placeholder="Costo en XP..."
                                min="1"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!newReward.nombre.trim() || !newReward.costo}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-zinc-900 text-sm font-bold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Agregar
                    </button>
                </form>
            )}

            {/* Rewards Grid */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-500 text-sm mt-2">Cargando loot...</p>
                </div>
            ) : rewards.length === 0 ? (
                <div className="text-center py-8">
                    <Coins className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">No hay recompensas todavía.</p>
                    <p className="text-zinc-600 text-xs">¡Agrega algo para motivarte!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {rewards.map((item) => {
                        const canAfford = currentXP >= item.costo;
                        const isPurchasing = purchasing === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`relative bg-zinc-900 rounded-xl p-4 border transition-all duration-200 group ${canAfford
                                    ? 'border-zinc-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5'
                                    : 'border-zinc-800/50 opacity-60'
                                    }`}
                            >
                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={() => deleteReward(item.id)}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Emoji */}
                                <div className="text-3xl mb-2">{item.emoji}</div>

                                {/* Name */}
                                <h3 className="text-zinc-100 font-medium text-sm mb-2 pr-6">{item.nombre}</h3>

                                {/* Cost */}
                                <div className="flex items-center gap-1 mb-3">
                                    <Coins className="w-3.5 h-3.5 text-yellow-500" />
                                    <span className="text-yellow-400 font-bold text-sm">{item.costo}</span>
                                    <span className="text-yellow-500/50 text-xs">XP</span>
                                </div>

                                {/* Buy button */}
                                <button
                                    type="button"
                                    onClick={() => buyReward(item)}
                                    disabled={!canAfford || isPurchasing}
                                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${canAfford
                                        ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-amber-400 hover:from-yellow-500/30 hover:to-amber-500/30'
                                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                        }`}
                                >
                                    {isPurchasing ? (
                                        <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4" />
                                            {canAfford ? 'Comprar' : 'Sin fondos'}
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Toast Notification */}
            {notification && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-zinc-900/95 border border-yellow-500/30 shadow-2xl shadow-black/50 text-zinc-100 px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 backdrop-blur-sm transition-all duration-300">
                    {notification}
                </div>
            )}
        </section>
    );
}
