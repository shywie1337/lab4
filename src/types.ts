export interface Character {
  id: string
  name: string
  avatar_url: string
  starting_coins: number
  starting_bombs: number
  luck: number
  jam_rate: number
  surprise_chance: number
  description: string
}

export interface GreedState {
  session_id: string
  name: string
  character: Character
  wallet: number
  coins_in_machine: number
  jam_chance: number
  is_jammed: boolean
  is_exploded: boolean
  bombs: number
  total_donations: number
}

export interface Payload {
  id: string
  name: string
  type: string
  code: string
}

export interface DonateResponse {
  success: boolean
  message: string
  wallet: number
  coins_in_machine: number
  jam_chance: number
  is_jammed: boolean
  payload?: Payload | null
}

export interface BombResponse {
  success: boolean
  message: string
  coins_in_machine: number
  wallet: number
  bombs: number
  is_jammed: boolean
  is_exploded: boolean
}

export interface SessionCheck {
  valid: boolean
  session_id: string
  name: string
  character_id: string
  character_name: string
  coins_in_machine: number
  is_jammed: boolean
  created_at: number
}

export interface SavedSession {
  id: string
  name: string
  lastCharacter: string
}

export type ToastKind = 'success' | 'warning' | 'error' | 'info'

export interface Toast {
  id: number
  text: string
  kind: ToastKind
}

export interface ApiError {
  detail?: string | { msg: string }[]
  message?: string
}
