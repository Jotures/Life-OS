import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60;  // 5 minutes in seconds

const PomodoroTimer = ({ onClose }) => {
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' | 'break'
    const intervalRef = useRef(null);

    // Play notification sound
    const playSound = useCallback(() => {
        try {
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.volume = 0.5;
            audio.play().catch(console.error);
        } catch (err) {
            console.error('Audio playback failed:', err);
        }
    }, []);

    // Timer countdown logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer finished
            playSound();

            if (mode === 'focus') {
                // Switch to break mode
                setMode('break');
                setTimeLeft(BREAK_TIME);
                // Auto-start break
            } else {
                // Break finished, switch back to focus and pause
                setMode('focus');
                setTimeLeft(FOCUS_TIME);
                setIsActive(false);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeLeft, mode, playSound]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle play/pause
    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    // Reset timer
    const resetTimer = () => {
        setIsActive(false);
        setMode('focus');
        setTimeLeft(FOCUS_TIME);
    };

    // Calculate progress percentage for visual ring
    const totalTime = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    // Theme colors based on mode
    const themeColors = mode === 'focus'
        ? {
            bg: 'bg-emerald-950/50',
            border: 'border-emerald-800/50',
            text: 'text-emerald-400',
            progress: 'bg-emerald-500',
            button: 'bg-emerald-600 hover:bg-emerald-500',
            label: 'Enfoque'
        }
        : {
            bg: 'bg-indigo-950/50',
            border: 'border-indigo-800/50',
            text: 'text-indigo-400',
            progress: 'bg-indigo-500',
            button: 'bg-indigo-600 hover:bg-indigo-500',
            label: 'Descanso'
        };

    return (
        <div className={`mt-3 p-4 rounded-xl ${themeColors.bg} border ${themeColors.border} transition-all duration-300`}>
            <div className="flex items-center justify-between">
                {/* Mode Label */}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${themeColors.progress} ${isActive ? 'animate-pulse' : ''}`} />
                    <span className={`text-xs font-medium uppercase tracking-wider ${themeColors.text}`}>
                        {themeColors.label}
                    </span>
                </div>

                {/* Timer Display */}
                <div className={`font-mono text-2xl font-bold ${themeColors.text}`}>
                    {formatTime(timeLeft)}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                        onClick={toggleTimer}
                        className={`p-2 rounded-lg ${themeColors.button} text-white transition-all duration-200`}
                    >
                        {isActive ? (
                            <Pause className="w-4 h-4" />
                        ) : (
                            <Play className="w-4 h-4" />
                        )}
                    </button>

                    {/* Reset */}
                    <button
                        onClick={resetTimer}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all duration-200"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${themeColors.progress}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default PomodoroTimer;
