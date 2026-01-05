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
import { supabase } from '../supabaseClient';

const FECHA_NACIMIENTO_KEY = 'life-os-fecha-nacimiento';

const getStoredFechaNacimiento = () => {
    try {
        return localStorage.getItem(FECHA_NACIMIENTO_KEY);
    } catch (error) {
        console.error('Error loading fechaNacimiento from localStorage:', error);
        return null;
    }
};

export const useLifeOS = () => {
    const [habitos, setHabitos] = useState([]);
    const [fechaNacimiento, setFechaNacimientoState] = useState(getStoredFechaNacimiento);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch habits from Supabase on mount
    useEffect(() => {
        const fetchHabitos = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('habitos')
                    .select('*')
                    .order('fecha_inicio', { ascending: true });

                if (error) throw error;
                setHabitos(data || []);
            } catch (err) {
                console.error('Error fetching habitos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHabitos();
    }, []);

    // Persist fechaNacimiento to localStorage
    useEffect(() => {
        try {
            if (fechaNacimiento) {
                localStorage.setItem(FECHA_NACIMIENTO_KEY, fechaNacimiento);
            } else {
                localStorage.removeItem(FECHA_NACIMIENTO_KEY);
            }
        } catch (error) {
            console.error('Error saving fechaNacimiento to localStorage:', error);
        }
    }, [fechaNacimiento]);

    // Process habits on mount and when date changes
    useEffect(() => {
        const processHabits = async () => {
            let updated = false;
            const updatedHabitos = [];

            for (const habito of habitos) {
                if (habito.tipo === 'construir') {
                    // For 'construir' habits: reset streak if yesterday wasn't marked
                    if (habito.ultima_fecha) {
                        const lastDate = parseISO(habito.ultima_fecha);
                        if (!isToday(lastDate) && !isYesterday(lastDate)) {
                            // Missed more than one day - reset streak
                            if (habito.racha > 0) {
                                updated = true;
                                updatedHabitos.push({ ...habito, racha: 0 });
                                continue;
                            }
                        }
                    }
                } else if (habito.tipo === 'dejar') {
                    // For 'dejar' habits: calculate days since start
                    const fechaInicio = parseISO(habito.fecha_inicio);
                    const diasLibre = differenceInDays(new Date(), fechaInicio);
                    if (diasLibre !== habito.racha) {
                        updated = true;
                        updatedHabitos.push({ ...habito, racha: Math.max(0, diasLibre) });
                        continue;
                    }
                }
                updatedHabitos.push(habito);
            }

            if (updated) {
                setHabitos(updatedHabitos);
                // Sync updates to Supabase
                for (const habito of updatedHabitos) {
                    const original = habitos.find(h => h.id === habito.id);
                    if (original && original.racha !== habito.racha) {
                        await supabase
                            .from('habitos')
                            .update({ racha: habito.racha })
                            .eq('id', habito.id);
                    }
                }
            }
        };

        if (habitos.length > 0) {
            processHabits();
        }

        // Check every minute for date changes
        const interval = setInterval(processHabits, 60000);
        return () => clearInterval(interval);
    }, [habitos.length]); // Only run when habitos are loaded

    // Add a new habit
    const agregarHabito = useCallback(async (nombre, tipo) => {
        const nuevoHabito = {
            nombre: nombre.trim(),
            racha: 0,
            ultima_fecha: null,
            fecha_inicio: new Date().toISOString(),
            tipo
        };

        try {
            const { data, error } = await supabase
                .from('habitos')
                .insert([nuevoHabito])
                .select()
                .single();

            if (error) throw error;
            setHabitos(prev => [...prev, data]);
        } catch (err) {
            console.error('Error adding habito:', err);
            alert("ERROR SUPABASE: " + err.message);
            setError(err.message);
        }
    }, []);

    // Delete a habit
    const eliminarHabito = useCallback(async (id) => {
        try {
            const { error } = await supabase
                .from('habitos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setHabitos(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            console.error('Error deleting habito:', err);
            setError(err.message);
        }
    }, []);

    // Mark a 'construir' habit as done for today
    const marcarHabito = useCallback(async (id) => {
        const today = startOfDay(new Date()).toISOString();
        const habito = habitos.find(h => h.id === id);

        if (!habito || habito.tipo !== 'construir') return;

        // Check if already marked today
        if (habito.ultima_fecha && isToday(parseISO(habito.ultima_fecha))) {
            return; // Already marked today
        }

        // Check if marked yesterday (continuing streak)
        const nuevaRacha = habito.ultima_fecha && isYesterday(parseISO(habito.ultima_fecha))
            ? habito.racha + 1
            : 1; // Start new streak if gap

        try {
            const { error } = await supabase
                .from('habitos')
                .update({ racha: nuevaRacha, ultima_fecha: today })
                .eq('id', id);

            if (error) throw error;
            setHabitos(prev => prev.map(h =>
                h.id === id ? { ...h, racha: nuevaRacha, ultima_fecha: today } : h
            ));
        } catch (err) {
            console.error('Error marking habito:', err);
            setError(err.message);
        }
    }, [habitos]);

    // Unmark a 'construir' habit (undo today's mark)
    const desmarcarHabito = useCallback(async (id) => {
        const habito = habitos.find(h => h.id === id);

        if (!habito || habito.tipo !== 'construir') return;

        // Only unmark if it was marked today
        if (!habito.ultima_fecha || !isToday(parseISO(habito.ultima_fecha))) {
            return;
        }

        const nuevaRacha = Math.max(0, habito.racha - 1);

        try {
            const { error } = await supabase
                .from('habitos')
                .update({ racha: nuevaRacha, ultima_fecha: null })
                .eq('id', id);

            if (error) throw error;
            setHabitos(prev => prev.map(h =>
                h.id === id ? { ...h, racha: nuevaRacha, ultima_fecha: null } : h
            ));
        } catch (err) {
            console.error('Error unmarking habito:', err);
            setError(err.message);
        }
    }, [habitos]);

    // Reset a 'dejar' habit (user relapsed)
    const reiniciarHabito = useCallback(async (id) => {
        const habito = habitos.find(h => h.id === id);

        if (!habito || habito.tipo !== 'dejar') return;

        const nuevaFechaInicio = new Date().toISOString();

        try {
            const { error } = await supabase
                .from('habitos')
                .update({ racha: 0, fecha_inicio: nuevaFechaInicio })
                .eq('id', id);

            if (error) throw error;
            setHabitos(prev => prev.map(h =>
                h.id === id ? { ...h, racha: 0, fecha_inicio: nuevaFechaInicio } : h
            ));
        } catch (err) {
            console.error('Error resetting habito:', err);
            setError(err.message);
        }
    }, [habitos]);

    // Set birth date for Memento Mori
    const setFechaNacimiento = useCallback((fecha) => {
        setFechaNacimientoState(fecha);
    }, []);

    // Calculate Memento Mori data
    const getMementoMoriData = useCallback(() => {
        if (!fechaNacimiento) return null;

        const nacimiento = parseISO(fechaNacimiento);
        const ahora = new Date();
        const semanasVividas = differenceInWeeks(ahora, nacimiento);
        const totalYears = 70;
        const totalSemanas = totalYears * 52; // 70 years in weeks

        return {
            currentWeekIndex: Math.min(semanasVividas, totalSemanas),
            totalSemanas,
            totalYears,
            porcentajeVivido: ((semanasVividas / totalSemanas) * 100).toFixed(1)
        };
    }, [fechaNacimiento]);

    // Check if habit is marked today
    const estaCompletadoHoy = useCallback((id) => {
        const habito = habitos.find(h => h.id === id);
        if (!habito || habito.tipo !== 'construir' || !habito.ultima_fecha) return false;
        return isToday(parseISO(habito.ultima_fecha));
    }, [habitos]);

    // Format date in Spanish
    const formatearFecha = useCallback((fecha) => {
        return format(parseISO(fecha), "d 'de' MMMM, yyyy", { locale: es });
    }, []);

    return {
        habitos,
        habitosConstruir: habitos.filter(h => h.tipo === 'construir'),
        habitosDejar: habitos.filter(h => h.tipo === 'dejar'),
        fechaNacimiento,
        loading,
        error,
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
