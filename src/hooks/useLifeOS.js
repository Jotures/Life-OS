import { useState, useEffect, useCallback } from 'react';
import {
    format,
    parseISO,
    isToday,
    differenceInDays,
    differenceInWeeks,
    startOfDay,
    isYesterday
} from 'date-fns';
import { es } from 'date-fns/locale';

const STORAGE_KEY = 'life-os-data';

const getInitialData = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
    }
    return {
        habitos: [],
        fechaNacimiento: null
    };
};

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useLifeOS = () => {
    const [data, setData] = useState(getInitialData);

    // Persist to localStorage on every change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [data]);

    // Process habits on mount and when date changes
    useEffect(() => {
        const processHabits = () => {
            const today = startOfDay(new Date()).toISOString();

            setData(prev => {
                let updated = false;
                const newHabitos = prev.habitos.map(habito => {
                    if (habito.tipo === 'construir') {
                        // For 'construir' habits: reset streak if yesterday wasn't marked
                        if (habito.ultima_fecha) {
                            const lastDate = parseISO(habito.ultima_fecha);
                            if (!isToday(lastDate) && !isYesterday(lastDate)) {
                                // Missed more than one day - reset streak
                                if (habito.racha > 0) {
                                    updated = true;
                                    return { ...habito, racha: 0 };
                                }
                            } else if (isYesterday(lastDate)) {
                                // Yesterday was marked, but today isn't yet - streak is still valid
                                // Do nothing, user might mark today
                            }
                        }
                    } else if (habito.tipo === 'dejar') {
                        // For 'dejar' habits: calculate days since start
                        const fechaInicio = parseISO(habito.fecha_inicio);
                        const diasLibre = differenceInDays(new Date(), fechaInicio);
                        if (diasLibre !== habito.racha) {
                            updated = true;
                            return { ...habito, racha: Math.max(0, diasLibre) };
                        }
                    }
                    return habito;
                });

                if (updated) {
                    return { ...prev, habitos: newHabitos };
                }
                return prev;
            });
        };

        processHabits();

        // Check every minute for date changes
        const interval = setInterval(processHabits, 60000);
        return () => clearInterval(interval);
    }, []);

    // Add a new habit
    const agregarHabito = useCallback((nombre, tipo) => {
        const nuevoHabito = {
            id: generateId(),
            nombre: nombre.trim(),
            racha: 0,
            ultima_fecha: null,
            fecha_inicio: new Date().toISOString(),
            tipo
        };

        setData(prev => ({
            ...prev,
            habitos: [...prev.habitos, nuevoHabito]
        }));
    }, []);

    // Delete a habit
    const eliminarHabito = useCallback((id) => {
        setData(prev => ({
            ...prev,
            habitos: prev.habitos.filter(h => h.id !== id)
        }));
    }, []);

    // Mark a 'construir' habit as done for today
    const marcarHabito = useCallback((id) => {
        const today = startOfDay(new Date()).toISOString();

        setData(prev => ({
            ...prev,
            habitos: prev.habitos.map(habito => {
                if (habito.id !== id || habito.tipo !== 'construir') return habito;

                // Check if already marked today
                if (habito.ultima_fecha && isToday(parseISO(habito.ultima_fecha))) {
                    return habito; // Already marked today
                }

                // Check if marked yesterday (continuing streak)
                const nuevaRacha = habito.ultima_fecha && isYesterday(parseISO(habito.ultima_fecha))
                    ? habito.racha + 1
                    : 1; // Start new streak if gap

                return {
                    ...habito,
                    racha: nuevaRacha,
                    ultima_fecha: today
                };
            })
        }));
    }, []);

    // Unmark a 'construir' habit (undo today's mark)
    const desmarcarHabito = useCallback((id) => {
        setData(prev => ({
            ...prev,
            habitos: prev.habitos.map(habito => {
                if (habito.id !== id || habito.tipo !== 'construir') return habito;

                // Only unmark if it was marked today
                if (habito.ultima_fecha && isToday(parseISO(habito.ultima_fecha))) {
                    return {
                        ...habito,
                        racha: Math.max(0, habito.racha - 1),
                        ultima_fecha: null
                    };
                }
                return habito;
            })
        }));
    }, []);

    // Reset a 'dejar' habit (user relapsed)
    const reiniciarHabito = useCallback((id) => {
        setData(prev => ({
            ...prev,
            habitos: prev.habitos.map(habito => {
                if (habito.id !== id || habito.tipo !== 'dejar') return habito;

                return {
                    ...habito,
                    racha: 0,
                    fecha_inicio: new Date().toISOString()
                };
            })
        }));
    }, []);

    // Set birth date for Memento Mori
    const setFechaNacimiento = useCallback((fecha) => {
        setData(prev => ({
            ...prev,
            fechaNacimiento: fecha
        }));
    }, []);

    // Calculate Memento Mori data
    const getMementoMoriData = useCallback(() => {
        if (!data.fechaNacimiento) return null;

        const nacimiento = parseISO(data.fechaNacimiento);
        const ahora = new Date();
        const semanasVividas = differenceInWeeks(ahora, nacimiento);
        const totalSemanas = 80 * 52; // 80 years in weeks

        return {
            semanasVividas: Math.min(semanasVividas, totalSemanas),
            totalSemanas,
            porcentajeVivido: ((semanasVividas / totalSemanas) * 100).toFixed(1)
        };
    }, [data.fechaNacimiento]);

    // Check if habit is marked today
    const estaCompletadoHoy = useCallback((id) => {
        const habito = data.habitos.find(h => h.id === id);
        if (!habito || habito.tipo !== 'construir' || !habito.ultima_fecha) return false;
        return isToday(parseISO(habito.ultima_fecha));
    }, [data.habitos]);

    // Format date in Spanish
    const formatearFecha = useCallback((fecha) => {
        return format(parseISO(fecha), "d 'de' MMMM, yyyy", { locale: es });
    }, []);

    return {
        habitos: data.habitos,
        habitosConstruir: data.habitos.filter(h => h.tipo === 'construir'),
        habitosDejar: data.habitos.filter(h => h.tipo === 'dejar'),
        fechaNacimiento: data.fechaNacimiento,
        agregarHabito,
        eliminarHabito,
        marcarHabito,
        desmarcarHabito,
        reiniciarHabito,
        setFechaNacimiento,
        getMementoMoriData,
        estaCompletadoHoy,
        formatearFecha
    };
};
