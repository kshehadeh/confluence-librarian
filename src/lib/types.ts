
export interface PageDetails {
    markedForArchive: boolean;
}

export interface ArchiveResolverInput {
    pageId: string;
}

export interface ConfluenceProperty {
    id: string;
    key: string;
    value: any;
    version: {
        number: number;
        when: string;
        message: string;
    }
}