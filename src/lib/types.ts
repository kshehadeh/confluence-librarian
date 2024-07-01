export interface ArchiveResolverInput {
    pageId: string;
}

export interface ConfluenceApiErrorResponse {
    statusCode: number;
    error: string;
}
export interface SpaceDescriptor {
    key: string;
    name: string;
}

export function isConfluenceApiErrorResponse(obj: any): obj is ConfluenceApiErrorResponse {
    return obj.statusCode !== undefined && obj.error !== undefined;
}

