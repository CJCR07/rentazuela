// Minimal type exports for compatibility - use any for database
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = any;
