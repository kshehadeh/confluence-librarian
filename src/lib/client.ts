import api from "@forge/api"
import { Response, RequestInit } from "node-fetch"

type Route = Parameters<ReturnType<typeof api.asApp>["requestConfluence"]>[0]
type APIResponse = Awaited<ReturnType<ReturnType<typeof api.asApp>["requestConfluence"]>>

export function getErrorInfo(body: any) {
    let errorStrings = []
    if (body.errorMessages) {
        errorStrings = body.errorMessages
    }

    if (body.errors) {
        if (Array.isArray(body.errors)) {
            errorStrings = body.errors.map((error: any) => `${error.status}: ${error.code} - ${error.title}`)
        } else if (typeof body.errors === 'object') {
            errorStrings = Object.entries(body.errors).map(([key, value]) => `${key}: ${value}`)
        }        
    }

    if (body.message) {
        errorStrings.push(body.message)
    }

    return errorStrings.join(", ")
}

/**
 * Log the request to the console
 * @param route 
 * @param options 
 */
function logRequest(route: Route, options?: RequestInit) {
    console.log(`Request: [${options?.method}] [${route.value}]`)
}

/**
 * Log the response to the console
 * @param response 
 * @param req 
 */
async function logResponse(response: APIResponse, req: { route: Route, options?: RequestInit }) {
    let message = ""
    if (response.ok) {
        message = `[Success] ${response.status} ${response.statusText}`
    } else {
        const body = await (response as Response).clone().json()
        if (body) {
            message = `[Failure] ${response.status} ${response.statusText}: ${getErrorInfo(body)}`
        } else {
            message = `[Failure] ${response.status} ${response.statusText}`
        }
    }
    console.log(`Response: [${req.route.value}] ${message}`)
}

/**
 * Convenience function to make a GET request to the Confluence REST API
 * @param route The route object created by using the route template literal tag
 * @param options The request options that will be passed to the fetch function - this is only necessary if you need to customize the request
 * @param asApp Whether to request the API as the app or as the user
 * @returns The response object
 */
export async function get(route: Route, options?: RequestInit, asApp: boolean = true): Promise<APIResponse> {
    const opts = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            ...(options?.headers || {})
        },
        ...options
    }
    logRequest(route, opts)

    let response: APIResponse|undefined = undefined
    if (asApp) {
        response = await api.asApp().requestConfluence(route, opts)
    } else {
        response = await  api.asUser().requestConfluence(route, opts)
    }

    await logResponse(response, { route, options })

    return response;
}

/**
 * Convenience function to make a POST request to the Confluence REST API
 * @param route The route object created by using the route template literal tag
 * @param options The request options that will be passed to the fetch function - this is only necessary if you need to customize the request
 * @param asApp Whether to request the API as the app or as the user
 * @param body The body of the request as POJO
 * @returns 
 */
export async function post(route: Route, body: any, options?: RequestInit, asApp: boolean = true): Promise<APIResponse> {
    const opts = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(options?.headers || {})
        },
        body: JSON.stringify(body),
        ...options
    }
    logRequest(route, opts)

    let response: APIResponse|undefined = undefined
    if (asApp) {
        response = await api.asApp().requestConfluence(route, opts)
    } else {
        response = await  api.asUser().requestConfluence(route, opts)
    }

    await logResponse(response, { route, options })

    return response;
}

/**
 * Convenience function to make a PUT request to the Confluence REST API
 * @param route The route object created by using the route template literal tag
 * @param options The request options that will be passed to the fetch function - this is only necessary if you need to customize the request
 * @param asApp Whether to request the API as the app or as the user
 * @param body The body of the request as POJO
 * @returns 
 */
export async function put(route: Route, body: any, options?: RequestInit, asApp: boolean = true): Promise<APIResponse> {
    const opts = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(options?.headers || {})
        },
        body: JSON.stringify(body),
        ...options
    }
    logRequest(route, opts)

    let response: APIResponse|undefined = undefined
    if (asApp) {
        response = await api.asApp().requestConfluence(route, opts)
    } else {
        response = await  api.asUser().requestConfluence(route, opts)
    }

    await logResponse(response, { route, options })

    return response;
}

/**
 * Convenience function to make a DELETE request to the Confluence REST API
 * @param route The route object created by using the route template literal tag
 * @param options The request options that will be passed to the fetch function - this is only necessary if you need to customize the request
 * @param asApp Whether to request the API as the app or as the user
 * @returns 
 */
export async function del(route: Route, options?: RequestInit, asApp: boolean = true): Promise<APIResponse> {
    const opts = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            ...(options?.headers || {})
        },
        ...options
    }

    logRequest(route, opts)    

    let response: APIResponse|undefined = undefined
    if (asApp) {
        response = await api.asApp().requestConfluence(route, opts)
    } else {
        response = await  api.asUser().requestConfluence(route, opts)
    }

    await logResponse(response, { route, options })

    return response;
}