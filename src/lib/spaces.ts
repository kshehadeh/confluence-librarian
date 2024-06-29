import { route } from '@forge/api'
import { ConfluenceApiErrorResponse } from './types';
import { get, getErrorInfo } from './client';

export async function getSpaces() {
    const response = await get(route`/wiki/rest/api/space?status=current&limit=1000&type=global`)
    if (!response.ok) {
        return {
            statusCode: response.status,
            error: getErrorInfo(await response.json())
        } as ConfluenceApiErrorResponse        
    }

    const body = await response.json()
    return body.results.map((space: any) => ({
        key: space.key,
        name: space.name,
    }))
}