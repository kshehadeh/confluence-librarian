
export interface ResolverResponse<T = any> {
    success: boolean
    data?: T
    error?: string
}

export function error(msg: string) {
    return {
        success: false,
        error: msg
    } as ResolverResponse<undefined>
}

export function success<T>(data: T) {
    return {
        success: true,
        data
    } as ResolverResponse<T>
}