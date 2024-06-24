export type ContentType = "page" | "blog" | "attachment" | "database" | "comment"

export interface CqlQueryResponse {
    results: CqlQueryResponseResult[]
    start: number
    limit: number
    size: number
    totalSize: number
    cqlQuery: string
    searchDuration: number
    archivedResultCount: number
    _links: Links
}

export interface CqlQueryResponseResult {
    id: string
    referenceId: string
    type: ContentType
    status: string
    title: string
    space: Space
    metadata: Metadata
    version: Version
    macroRenderedOutput: MacroRenderedOutput
    extensions: Extensions
    _expandable: Expandable2
    _links: Links
}

export interface Metadata {
    properties: Properties
}

export interface Properties {
    markedForArchive: {
        value: string
        id: string
        key: string        
    }
}

export interface Version {
    by: {
        type: string
    },
    when: string
    message: string
    number: number
    minorEdit: boolean
}

export interface Space {
    id: number
    key: string
    name: string
    type: string
    status: string
    _expandable: Expandable
    _links: Links
}

export interface Expandable {
    settings: string
    metadata: string
    operations: string
    lookAndFeel: string
    identifiers: string
    permissions: string
    icon: string
    description: string
    theme: string
    history: string
    homepage: string
}

export interface Links {
    webui: string
    self: string
    editui: string
}

export interface MacroRenderedOutput { }

export interface Extensions {
    position: number
}

export interface Expandable2 {
    container: string
    metadata: string
    restrictions: string
    history: string
    body: string
    version: string
    descendants: string
    childTypes: string
    schedulePublishInfo: string
    operations: string
    schedulePublishDate: string
    children: string
    ancestors: string
}

