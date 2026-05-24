import axios from 'axios'

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível ligar ao servidor. Verifique a sua ligação.'
    }

    const status = error.response.status
    const data = error.response.data as { message?: string | string[] } | undefined

    if (status === 409) {
      return 'Este registo já existe.'
    }

    if (status === 400) {
      if (Array.isArray(data?.message)) {
        return data.message.join('\n')
      }
      if (typeof data?.message === 'string') {
        return data.message
      }
      return 'Dados inválidos. Verifique os campos.'
    }

    if (status === 401) {
      return 'Credenciais inválidas.'
    }

    if (status === 403) {
      return 'Sem permissão para esta acção.'
    }

    if (status === 404) {
      return 'Registo não encontrado.'
    }

    return 'Ocorreu um erro. Tente novamente.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocorreu um erro inesperado.'
}
