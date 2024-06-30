import { route } from '@forge/api'
import { ConfluenceApiErrorResponse } from './types';
import { CqlQueryResponse } from './api1.types';
import { LabelDetails } from './api2.types';
import { del, get, getErrorInfo, post } from './client';

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

export async function getContentById(contentId: string) {
    const response = await get(route`/wiki/rest/api/content/${contentId}`);
    if (!response.ok) {
        return undefined
    }

    return await response.json();
}

export async function getLabelDetails(label: string) {
    const response = await get(route`/wiki/rest/api/label/?name=${label}`);
    if (!response.ok) {
        return undefined
    }
    
    return (await response.json()) as LabelDetails;    
}

export async function addLabelToContent(contentId: string, label: string) {
    const response = await post(route`/wiki/rest/api/content/${contentId}/label`, [{
        prefix: 'global',
        name: label
    }]);
    
    if (!response.ok) {        
        return undefined
    }

    return response.json();    
}

export async function removeLabelFromContent(contentId: string, label: string) {
    const response = await del(route`/wiki/rest/api/content/${contentId}/label/${label}`);
    return response.ok;
}

export async function hasLabel(contentId: string, label: string) {
    const response = await get(route`/wiki/api/content/${contentId}/label/${label}`);
    return response.ok;
}