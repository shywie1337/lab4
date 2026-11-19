import axios from 'axios'
import { useSessionsStore } from '../stores/sessions.store'
import { useToastsStore } from '../stores/toasts.store'
import type { ApiError } from '../types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const sessions = useSessionsStore()
  if (sessions.activeSessionId) config.headers['X-Session-ID'] = sessions.activeSessionId
  return config
})

api.interceptors.response.use(
  (response) => {
    if (typeof response.data?.message === 'string') {
      useToastsStore().show(response.data.message, response.data.success === false ? 'warning' : 'success')
    }
    return response
  },
  (error: unknown) => {
    let message = 'Не вдалося виконати запит.'
    let warning = false

    if (axios.isAxiosError<ApiError>(error)) {
      const status = error.response?.status
      const detail = error.response?.data?.detail
      warning = status === 400 || status === 404 || status === 409 || status === 422 || status === 429

      if (!error.response) {
        message = error.code === 'ECONNABORTED'
          ? 'Сервер не відповів вчасно. Оновіть стан перед наступною дією.'
          : 'Немає зв’язку із сервером. Перевірте підключення.'
      } else if (typeof detail === 'string') {
        message = detail
      } else if (Array.isArray(detail)) {
        message = detail.map((item) => item.msg).join('; ')
      } else if (error.response.data?.message) {
        message = error.response.data.message
      } else if (status === 409) {
        message = 'Автомат заклинило. Використайте бомбу або скиньте спробу.'
      } else if (status === 429) {
        message = 'Занадто часті натискання. Зачекайте перед наступною дією.'
      } else if (status && status >= 500) {
        message = 'Помилка сервера. Спробуйте оновити стан пізніше.'
      }
    }

    useToastsStore().show(message, warning ? 'warning' : 'error')
    return Promise.reject(error)
  },
)
