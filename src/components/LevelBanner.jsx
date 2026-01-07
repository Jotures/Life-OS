import { Zap, ShoppingBag } from 'lucide-react';

const LevelBanner = ({ profile, onOpenShop }) => {
    if (!profile) {
        return (
            <div className="bg-zinc-900 border-b border-zinc-800 p-4 mb-6 rounded-xl animate-pulse">
                <div className="h-6 bg-zinc-800 rounded w-24 mb-2"></div>
                <div className="h-4 bg-zinc-800 rounded-full"></div>
            </div>
        );
    }

    const { xp, nivel } = profile;

    // Calculate progress to next level
    // Level formula: Floor(XP / 100) + 1
    // XP needed for current level: (nivel - 1) * 100
    // XP needed for next level: nivel * 100
    const xpForCurrentLevel = (nivel - 1) * 100;
    const xpForNextLevel = nivel * 100;
    const xpIntoLevel = xp - xpForCurrentLevel;
    const xpNeededForLevel = 100; // Always 100 XP per level
    const progressPercent = Math.min(100, Math.round((xpIntoLevel / xpNeededForLevel) * 100));

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-4 mb-6 rounded-xl">
            {/* Header Row */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-zinc-100">
                        Nivel {nivel}
                    </span>
                </div>

                {/* Right Side: XP + Shop Button */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-400 font-mono">
                        {xp} XP
                    </span>

                    {/* Shop Button */}
                    {onOpenShop && (
                        <button
                            onClick={onOpenShop}
                            className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 p-2 rounded-xl transition-colors border border-yellow-500/20 flex items-center gap-1.5"
                            title="Abrir Tienda"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="text-xs font-bold hidden sm:inline">Gastar</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-zinc-800 h-4 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Progress Text */}
            <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Progreso al Nivel {nivel + 1}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                    {xpIntoLevel}/{xpNeededForLevel}
                </span>
            </div>
        </div>
    );
};

export default LevelBanner;
