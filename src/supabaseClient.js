import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ragsjozfxgsfztnemnef.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZ3Nqb3pmeGdzZnp0bmVtbmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTc3ODUsImV4cCI6MjA5NzMzMzc4NX0.gxb3WXvGcTpOmvh-FJ6E_ALibxSDyCVbdAEnA_mwhlU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
