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

export interface LabelDetails {
    label: Label
    associatedContents: AssociatedContents
}

export interface Label {
    prefix: string
    name: string
    id: string
    label: string
}

export interface AssociatedContents {
    results: Result[]
    start: number
    limit: number
    size: number
}

export interface Result {
    contentType: string
    contentId: number
    title: string
}


export interface Page {
    id: string
    status: string
    title: string
    spaceId: string
    parentId: string
    parentType: string
    position: number
    authorId: string
    ownerId: string
    lastOwnerId: string
    createdAt: string
    version: Version
    body: Body
    labels: Labels
    properties: Properties
    operations: Operations
    likes: Likes
    versions: Versions
    isFavoritedByCurrentUser: boolean
    _links: Links6
}

export interface Version {
    createdAt: string
    message: string
    number: number
    minorEdit: boolean
    authorId: string
}

export interface Body {
    storage: Storage
    atlas_doc_format: AtlasDocFormat
    view: View
}

export interface Storage { }

export interface AtlasDocFormat { }

export interface View { }

export interface Labels {
    results: Result[]
    meta: Meta
    _links: Links
}

export interface Result {
    id: string
    name: string
    prefix: string
}

export interface Meta {
    hasMore: boolean
    cursor: string
}

export interface Links {
    self: string
}

export interface Properties {
    results: Result2[]
    meta: Meta2
    _links: Links2
}

export interface Result2 {
    id: string
    key: string
    version: Version2
}

export interface Version2 { }

export interface Meta2 {
    hasMore: boolean
    cursor: string
}

export interface Links2 {
    self: string
}

export interface Operations {
    results: Result3[]
    meta: Meta3
    _links: Links3
}

export interface Result3 {
    operation: string
    targetType: string
}

export interface Meta3 {
    hasMore: boolean
    cursor: string
}

export interface Links3 {
    self: string
}

export interface Likes {
    results: Result4[]
    meta: Meta4
    _links: Links4
}

export interface Result4 {
    accountId: string
}

export interface Meta4 {
    hasMore: boolean
    cursor: string
}

export interface Links4 {
    self: string
}

export interface Versions {
    results: Result5[]
    meta: Meta5
    _links: Links5
}

export interface Result5 {
    createdAt: string
    message: string
    number: number
    minorEdit: boolean
    authorId: string
}

export interface Meta5 {
    hasMore: boolean
    cursor: string
}

export interface Links5 {
    self: string
}

export interface Links6 {
    base: string
}
