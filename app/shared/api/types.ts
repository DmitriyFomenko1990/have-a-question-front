import type { components, operations, paths } from './generated/schema'

export type ApiPaths = paths
export type ApiUser = components['schemas']['User']
export type ApiRegisterPayload = Pick<components['schemas']['Register'], 'email' | 'username' | 'password' | 'password_confirm'>
export type ApiRegisterResponse =
  operations['auth_register_create']['responses'][201]['content']['application/json']
export type ApiLoginPayload = Pick<components['schemas']['TokenObtainPair'], 'email' | 'password'>
export type ApiTokenPair = Pick<components['schemas']['TokenObtainPair'], 'access' | 'refresh'>
export type ApiTokenRefreshPayload = Pick<components['schemas']['TokenRefresh'], 'refresh'>
export type ApiTokenRefresh = Pick<components['schemas']['TokenRefresh'], 'access'>
export type ApiQuestionChoiceType = components['schemas']['ChoiceTypeEnum']
export type ApiQuestionOption = components['schemas']['QuestionOption']
export type ApiQuestionCreateOptionPayload = Pick<ApiQuestionOption, 'text'>
export type ApiQuestionListItem = components['schemas']['QuestionList']
export type ApiQuestionDetail = components['schemas']['QuestionDetail']
export type ApiQuestionCreatePayload = Omit<components['schemas']['QuestionCreate'], 'id' | 'options'> & {
  options: ApiQuestionCreateOptionPayload[]
}
export type ApiQuestionCreateResponse =
  operations['questions_create']['responses'][201]['content']['application/json']
export type ApiQuestionRespondPayload =
  NonNullable<operations['questions_respond_create']['requestBody']>['content']['application/json']
export type ApiQuestionRespondResponse =
  operations['questions_respond_create']['responses'][201]['content']['application/json']
export type ApiQuestionResultsResponse = unknown
export type ApiQuestionSearchPayload =
  NonNullable<operations['questions_search_create']['requestBody']>['content']['application/json']
export type ApiQuestionSearchResponse =
  operations['questions_search_create']['responses'][200]['content']['application/json']
export type ApiQuestionAnsweredFilter = components['schemas']['AnsweredEnum']
export type ApiQuestionSort = components['schemas']['SortEnum']
export type ApiQuestionSortType = components['schemas']['SortTypeEnum']
