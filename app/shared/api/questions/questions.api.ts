import type {
  ApiQuestionCreatePayload,
  ApiQuestionCreateResponse,
  ApiQuestionDetail,
  ApiQuestionListItem,
  ApiQuestionRespondPayload,
  ApiQuestionRespondResponse,
  ApiQuestionResultsResponse,
  ApiQuestionSearchPayload,
  ApiQuestionSearchResponse,
} from '@/shared/api/types'

export const questionsApi = {
  list: () => {
    const requestFetch = useRequestFetch()

    return requestFetch<ApiQuestionListItem[]>('/api/questions')
  },

  search: (payload: ApiQuestionSearchPayload) => {
    const requestFetch = useRequestFetch()

    return requestFetch<ApiQuestionSearchResponse>('/api/questions/search', {
      method: 'POST',
      body: payload,
    })
  },

  my: () => {
    const requestFetch = useRequestFetch()

    return requestFetch<ApiQuestionListItem[]>('/api/questions/my')
  },

  getById: (id: number) => {
    const requestFetch = useRequestFetch()

    return requestFetch<ApiQuestionDetail>(`/api/questions/${id}`)
  },

  create: (payload: ApiQuestionCreatePayload) => {
    const requestFetch = useRequestFetch()

    return requestFetch<ApiQuestionCreateResponse>('/api/questions', {
      method: 'POST',
      body: payload,
    })
  },

  respond: (id: number, payload: ApiQuestionRespondPayload) => {
    const requestFetch = useRequestFetch()

    return requestFetch<ApiQuestionRespondResponse>(`/api/questions/${id}/respond`, {
      method: 'POST',
      body: payload,
    })
  },

  results: (id: number) => {
    const requestFetch = useRequestFetch()

    return requestFetch<ApiQuestionResultsResponse>(`/api/questions/${id}/results`)
  },
}
