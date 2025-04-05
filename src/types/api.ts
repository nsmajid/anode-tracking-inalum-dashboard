export type DefaultApiResponse<T = unknown> = {
  status: boolean
  message: string
  data: T
}
