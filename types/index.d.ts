export type Api<T = {}> = (req: NextRequest, context: { params: T }) => Promise<Response>
