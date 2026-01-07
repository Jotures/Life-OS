import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Zap } from 'lucide-react';

const FocusStudio = () => {
    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [mode, setMode] = useState('focus'); // 'focus' | 'break'
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false); // NEW: Timer completed, waiting for user
    const [intent, setIntent] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [customWork, setCustomWork] = useState(25);
    const [customBreak, setCustomBreak] = useState(5);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    // Create audio element on mount for reliable playback
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.volume = 0.8;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    // Play alarm sound - robust implementation
    const playAlarm = useCallback(() => {
        try {
            // Reset and play
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(console.error);
            }
            // Fallback: also try a second sound
            const fallback = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
            fallback.volume = 0.7;
            fallback.play().catch(() => { });
        } catch (err) {
            console.error('Audio playback failed:', err);
        }
    }, []);

    // Timer countdown logic - MANUAL TRANSITIONS
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished! Stop and wait for user action
            setIsActive(false);
            setIsFinished(true);
            playAlarm();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeLeft, playAlarm]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Start the next phase (Break or Focus)
    const startNextPhase = () => {
        if (mode === 'focus') {
            // Switching to Break
            setMode('break');
            setTimeLeft(breakTime * 60);
        } else {
            // Switching back to Focus
            setMode('focus');
            setTimeLeft(workTime * 60);
        }
        setIsFinished(false);
        setIsActive(true);
    };

    // Apply preset
    const applyPreset = (work, breakMin) => {
        setIsActive(false);
        setIsFinished(false);
        setWorkTime(work);
        setBreakTime(breakMin);
        setMode('focus');
        setTimeLeft(work * 60);
        setCustomWork(work);
        setCustomBreak(breakMin);
    };

    // Apply custom settings
    const applyCustom = () => {
        applyPreset(customWork, customBreak);
        setShowSettings(false);
    };

    // Toggle play/pause
    const toggleTimer = () => {
        if (isFinished) {
            // If finished, clicking play starts the timer fresh
            setIsFinished(false);
        }
        setIsActive(!isActive);
    };

    // Reset timer
    const resetTimer = () => {
        setIsActive(false);
        setIsFinished(false);
        setMode('focus');
        setTimeLeft(workTime * 60);
    };

    // Calculate progress
    const totalTime = mode === 'focus' ? workTime * 60 : breakTime * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    // Theme colors based on mode
    const theme = mode === 'focus'
        ? {
            text: 'text-emerald-400',
            bg: 'bg-emerald-600',
            bgHover: 'hover:bg-emerald-500',
            progress: 'bg-emerald-500',
            ring: 'ring-emerald-500/30',
            label: 'ENFOQUE',
            nextLabel: '☕ Iniciar Descanso',
            nextBg: 'bg-indigo-600 hover:bg-indigo-500'
        }
        : {
            text: 'text-indigo-400',
            bg: 'bg-indigo-600',
            bgHover: 'hover:bg-indigo-500',
            progress: 'bg-indigo-500',
            ring: 'ring-indigo-500/30',
            label: 'DESCANSO',
            nextLabel: '⚡ Iniciar Enfoque',
            nextBg: 'bg-emerald-600 hover:bg-emerald-500'
        };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            {/* Main Timer Card */}
            <div className={`w-full max-w-lg p-8 bg-zinc-900 rounded-2xl border border-zinc-800 ring-4 ${theme.ring} transition-all duration-500`}>

                {/* Intent Input */}
                <input
                    type="text"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="¿Cuál es tu misión ahora?"
                    className="w-full bg-transparent text-center text-lg text-zinc-100 mb-8 border-b-2 border-zinc-700 focus:border-emerald-500 outline-none pb-3 placeholder-zinc-600 transition-colors"
                />

                {/* Mode Label */}
                <div className="flex justify-center mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${theme.text} bg-zinc-800 ${isFinished ? 'animate-pulse' : ''}`}>
                        {isFinished ? '¡TIEMPO!' : theme.label}
                    </span>
                </div>

                {/* THE BIG TIMER */}
                <div className={`text-8xl font-mono font-bold text-center mb-8 transition-colors duration-500 ${isFinished ? 'animate-pulse text-amber-400' : theme.text}`}>
                    {formatTime(timeLeft)}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-8">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${isFinished ? 'bg-amber-500' : theme.progress}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Controls - Show different buttons based on state */}
                {isFinished ? (
                    /* TRANSITION BUTTON - Shown when timer ends */
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={startNextPhase}
                            className={`w-full py-4 px-6 rounded-2xl ${theme.nextBg} text-white font-medium text-lg transition-all duration-200 shadow-lg animate-pulse`}
                        >
                            {mode === 'focus' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Coffee className="w-5 h-5" />
                                    Iniciar Descanso ({breakTime} min)
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Iniciar Enfoque ({workTime} min)
                                </span>
                            )}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                        >
                            Reiniciar todo
                        </button>
                    </div>
                ) : (
                    /* NORMAL CONTROLS */
                    <div className="flex items-center justify-center gap-4">
                        {/* Play/Pause */}
                        <button
                            onClick={toggleTimer}
                            className={`p-4 rounded-2xl ${theme.bg} ${theme.bgHover} text-white transition-all duration-200 shadow-lg`}
                        >
                            {isActive ? (
                                <Pause className="w-8 h-8" />
                            ) : (
                                <Play className="w-8 h-8" />
                            )}
                        </button>

                        {/* Reset */}
                        <button
                            onClick={resetTimer}
                            className="p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all duration-200"
                        >
                            <RotateCcw className="w-8 h-8" />
                        </button>

                        {/* Settings */}
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-4 rounded-2xl transition-all duration-200 ${showSettings
                                ? 'bg-zinc-700 text-zinc-200'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                                }`}
                        >
                            <Clock className="w-8 h-8" />
                        </button>
                    </div>
                )}
            </div>

            {/* Presets */}
            <div className="flex gap-3 mt-8">
                <button
                    onClick={() => applyPreset(25, 5)}
                    className={`px-5 py-3 rounded-xl transition-all duration-200 ${workTime === 25 && breakTime === 5
                        ? 'bg-zinc-700 text-zinc-100'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                        }`}
                >
                    🍅 Clásico (25/5)
                </button>
                <button
                    onClick={() => applyPreset(50, 10)}
                    className={`px-5 py-3 rounded-xl transition-all duration-200 ${workTime === 50 && breakTime === 10
                        ? 'bg-zinc-700 text-zinc-100'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                        }`}
                >
                    🧠 Profundo (50/10)
                </button>
                <button
                    onClick={() => applyPreset(15, 3)}
                    className={`px-5 py-3 rounded-xl transition-all duration-200 ${workTime === 15 && breakTime === 3
                        ? 'bg-zinc-700 text-zinc-100'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                        }`}
                >
                    ⚡ Sprint (15/3)
                </button>
            </div>

            {/* Custom Settings Panel */}
            {showSettings && (
                <div className="w-full max-w-lg mt-6 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <h3 className="text-zinc-100 font-medium mb-4 text-center">Personalizar Tiempos</h3>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Work Time */}
                        <div>
                            <label className="block text-zinc-500 text-sm mb-2 text-center">
                                Enfoque (min)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="120"
                                value={customWork}
                                onChange={(e) => setCustomWork(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 text-center text-2xl font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        {/* Break Time */}
                        <div>
                            <label className="block text-zinc-500 text-sm mb-2 text-center">
                                Descanso (min)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={customBreak}
                                onChange={(e) => setCustomBreak(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 text-center text-2xl font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={applyCustom}
                        className="w-full mt-6 bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 rounded-xl transition-colors"
                    >
                        Aplicar
                    </button>
                </div>
            )}
        </div>
    );
};

export default FocusStudio;
