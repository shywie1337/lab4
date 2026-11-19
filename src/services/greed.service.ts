import { api } from '../api/client'
import type { BombResponse, Character, DonateResponse, GreedState, SessionCheck } from '../types'

export async function getCharacters(): Promise<Character[]> {
  const { data } = await api.get<Character[]>('/api/greed/characters')
  return data
}

export async function createSession(characterId: string, name: string): Promise<GreedState> {
  const { data } = await api.post<GreedState>('/api/greed/session/new', {
    character_id: characterId,
    custom_name: name || undefined,
  })
  return data
}

export async function verifySession(id: string): Promise<SessionCheck> {
  const { data } = await api.get<SessionCheck>(`/api/greed/session/${encodeURIComponent(id)}/verify`)
  return data
}

export async function getState(): Promise<GreedState> {
  const { data } = await api.get<GreedState>('/api/greed/state')
  return data
}

export async function selectCharacter(characterId: string): Promise<GreedState> {
  const { data } = await api.post<GreedState>('/api/greed/select-character', null, {
    params: { character_id: characterId },
  })
  return data
}

export async function donate(): Promise<DonateResponse> {
  const { data } = await api.post<DonateResponse>('/api/greed/donate')
  return data
}

export async function bomb(): Promise<BombResponse> {
  const { data } = await api.post<BombResponse>('/api/greed/bomb')
  return data
}

export async function reset(resetMachine: boolean): Promise<GreedState> {
  const { data } = await api.post<GreedState>('/api/greed/reset', { reset_machine: resetMachine })
  return data
}
