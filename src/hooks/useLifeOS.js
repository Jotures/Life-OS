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

    // SMART HYBRID TOGGLE - Unified function for marking/unmarking habits
    const toggleHabito = useCallback(async (id, onProfileUpdate) => {
        const habito = habitos.find(h => h.id === id);
        if (!habito || habito.tipo !== 'construir') return;

        // 1. OBTENER FECHAS
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Parsear fecha existente
        let lastDate = null;
        if (habito.ultima_fecha) {
            const dateStr = habito.ultima_fecha.split('T')[0];
            lastDate = new Date(dateStr + "T00:00:00");
            lastDate.setHours(0, 0, 0, 0);
        }

        // 2. CALCULAR DIFERENCIA EN DÍAS
        let diffInDays = null;
        if (lastDate) {
            const diffTime = today.getTime() - lastDate.getTime();
            diffInDays = Math.round(diffTime / (1000 * 3600 * 24));
        }

        // 3. DETERMINAR LA NUEVA RACHA
        const currentVal = Number(habito.racha || 0);
        let nuevaRacha;
        let nuevaFecha;

        const todayString = today.toISOString().split('T')[0];

        // CALCULAR AYER (Para no perder la memoria al desmarcar)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        // Determine if this is marking or unmarking
        const isUnmarking = diffInDays === 0;

        if (isUnmarking) {
            // --- CASO: DESMARCAR (UNDO) ---
            nuevaRacha = Math.max(0, currentVal - 1);
            // TRUCO MAESTRO: Si la racha sigue viva (>0), la fecha es AYER.
            // Si la racha muere (0), la fecha es null.
            nuevaFecha = nuevaRacha > 0 ? yesterdayString : null;

        } else if (diffInDays === 1) {
            // --- CASO: RACHA PERFECTA ---
            nuevaRacha = currentVal + 1;
            nuevaFecha = todayString;

        } else {
            // --- CASO: RACHA ROTA O PRIMERA VEZ ---
            nuevaRacha = 1;
            nuevaFecha = todayString;
        }

        console.log(`Debug: RachaBD=${currentVal}, Diff=${diffInDays}, Nueva=${nuevaRacha}, Fecha=${nuevaFecha}`);

        // 4. ACTUALIZAR ESTADO LOCAL (Optimista)
        setHabitos(prev => prev.map(h =>
            h.id === id
                ? { ...h, racha: nuevaRacha, ultima_fecha: nuevaFecha }
                : h
        ));

        // 5. ACTUALIZAR SUPABASE
        try {
            const { error } = await supabase
                .from('habitos')
                .update({ racha: nuevaRacha, ultima_fecha: nuevaFecha })
                .eq('id', id);

            if (error) {
                console.error('Error al guardar:', error);
                setError(error.message);
            }

            // 6. SYNC HISTORIAL_HABITOS for heatmap
            if (isUnmarking) {
                // UNMARKING: Delete today's record from history
                await supabase
                    .from('historial_habitos')
                    .delete()
                    .eq('habito_id', id)
                    .eq('fecha', todayString);
            } else {
                // MARKING: Insert today's record into history (upsert to avoid duplicates)
                await supabase
                    .from('historial_habitos')
                    .upsert({ habito_id: id, fecha: todayString }, { onConflict: 'habito_id,fecha' });
            }

            // 7. RPG GAMIFICATION: Update XP and Level
            const xpChange = isUnmarking ? -10 : 10;

            // Fetch current profile
            const { data: profile, error: profileError } = await supabase
                .from('perfil_jugador')
                .select('*')
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
            } else if (profile) {
                // Calculate new XP (minimum 0)
                const newXP = Math.max(0, profile.xp + xpChange);
                // Level formula: Floor(XP / 100) + 1
                const newLevel = Math.floor(newXP / 100) + 1;

                // Update profile in DB
                const { error: updateError } = await supabase
                    .from('perfil_jugador')
                    .update({ xp: newXP, nivel: newLevel })
                    .eq('id', profile.id);

                if (updateError) {
                    console.error('Error updating profile:', updateError);
                } else if (onProfileUpdate) {
                    // Trigger UI refresh
                    onProfileUpdate({ ...profile, xp: newXP, nivel: newLevel });
                }
            }
        } catch (err) {
            console.error('Error toggling habito:', err);
            setError(err.message);
        }
    }, [habitos]);

    // Keep marcarHabito/desmarcarHabito as aliases for backwards compatibility
    const marcarHabito = toggleHabito;
    const desmarcarHabito = toggleHabito;

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

        const birth = parseISO(fechaNacimiento);
        const now = new Date();
        const totalYears = 70;
        const totalSemanas = totalYears * 52;

        // 1. Calculate Age (completed years)
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
            age--;
        }

        // 2. Get last birthday date
        const lastBirthday = new Date(birth);
        lastBirthday.setFullYear(birth.getFullYear() + age);

        // 3. Calculate weeks passed since last birthday
        const msPerWeek = 1000 * 60 * 60 * 24 * 7;
        const weeksSinceBirthday = Math.floor((now - lastBirthday) / msPerWeek);

        // 4. Total index for the grid (clamp weeks to 0-51)
        const validWeeks = Math.min(Math.max(weeksSinceBirthday, 0), 51);
        const currentWeekIndex = Math.min((age * 52) + validWeeks, totalSemanas);

        // Calculate percentage based on actual grid position
        const porcentajeVivido = ((currentWeekIndex / totalSemanas) * 100).toFixed(1);

        return {
            currentWeekIndex,
            totalSemanas,
            totalYears,
            porcentajeVivido
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
