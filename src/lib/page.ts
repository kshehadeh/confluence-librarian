import { route } from '@forge/api'
import { ConfluenceApiErrorResponse } from './types';
import { CqlQueryResponse } from './api1.types';
import { Page } from './api2.types';
import { get, getErrorInfo } from './client';

export async function searchWithCql(cql: string, limit: number, cursor: string, isPrevCursor?: boolean) {
    const params = new URLSearchParams();
    params.append('cql', cql);
    params.append('limit', limit.toString());
    params.append('expand', 'space,version,metadata.properties.markedForArchive')
    if (cursor) {
        params.append('cursor', cursor);
    }    
    if (isPrevCursor) {
        params.append('prev', 'true');
    }

    const response = await get(route`/wiki/rest/api/content/search?${params}`);

    const body = await response.json();
    if (!response.ok) {
        const error = getErrorInfo(body);        
        return {
            statusCode: response.status,
            error
        } as ConfluenceApiErrorResponse
    }

    return (body as CqlQueryResponse)
}

export async function getPageById(contentId: string) {
    const response = await get(route`/wiki/api/v2/pages/${contentId}`);
    if (!response.ok) {
        return undefined
    }

    return await response.json() as Page;
}
