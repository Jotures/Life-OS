import { createClient } from '@supabase/supabase-js'

// REEMPLAZA ESTO CON TUS DATOS DE SUPABASE.COM
const supabaseUrl = 'https://fmkyfaxlwseaskkxwokq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZta3lmYXhsd3NlYXNra3h3b2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTE4NDUsImV4cCI6MjA4MjY4Nzg0NX0.dmU0bE3ldHeEhDaO3SztdrckkDuh_H7aGhAQG2nqRQs'

export const supabase = createClient(supabaseUrl, supabaseKey)