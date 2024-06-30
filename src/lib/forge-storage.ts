import { storage } from "@forge/api";
import { WhereConditions } from "@forge/storage";

const CONTENT_ENTITY_NAME = 'content_v2';
const SPACE_ENTITY_NAME = 'space_v2';

export interface SpaceEntity {
    key: string;
    spaceId: string;
    title: string;
    status: string
}

export interface ContentEntity {    
    contentId: string;    
    contentType: string;
    title: string;
    status: string
}

export async function getSpaceByKey(key: string): Promise<SpaceEntity | undefined> {
    const result = await storage.entity<SpaceEntity>(SPACE_ENTITY_NAME)
        .query()
        .index('key')
        .where(WhereConditions.equalsTo(key))
        .getOne()

    return result?.value    
}

export async function getSpaceById(id: number): Promise<SpaceEntity | undefined> {
    const result = await storage.entity<SpaceEntity>(SPACE_ENTITY_NAME)
        .query()
        .index('spaceId')
        .where(WhereConditions.equalsTo(id))
        .getOne()

    return result?.value
}

export async function getSpacesByStatus(status: string): Promise<SpaceEntity[]> {
    const result = await storage.entity<SpaceEntity>(SPACE_ENTITY_NAME)
        .query()
        .index('status')
        .where(WhereConditions.equalsTo(status))
        .getMany()

    return result?.results?.map(result => result.value) || []
}

export async function setSpace(space: SpaceEntity) : Promise<boolean> {
        
    const result = await storage.entity<SpaceEntity>(SPACE_ENTITY_NAME)
        .set(space.key, space)

    return true;
}

export async function getContentById(contentId: number) {
    const result = await storage.entity<ContentEntity>(CONTENT_ENTITY_NAME)
        .get(contentId.toString())

    return result
}

export async function setContent(content: ContentEntity) : Promise<boolean> {
            
    console.log('setContent', content)
    const result = await storage.entity<ContentEntity>(CONTENT_ENTITY_NAME)
        .set(content.contentId.toString(), content)

    console.log('setContent', result)

    return true;
}

export async function getContentByStatus(status: string, contentType?: string): Promise<ContentEntity[]> {
    const query = storage.entity<ContentEntity>(CONTENT_ENTITY_NAME)
        .query()
        .index('status')
        .where(WhereConditions.equalsTo(status))        

    if (contentType) {
        query.andFilter('contentType', WhereConditions.equalsTo(contentType))
    }
    
    const result = await query.getMany()

    return result?.results?.map(result => result.value) || []
}