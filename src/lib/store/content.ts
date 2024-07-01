import { storage } from "@forge/api";
import { WhereConditions } from "@forge/storage";

const CONTENT_ENTITY_NAME = 'content_v2';

export interface ContentEntity {    
    contentId: string;    
    contentType: string;
    spaceKey: string;
    spaceId: string;
    title: string;
    status: string;
}


export class ContentStore {
    static async set(content: ContentEntity) {
        await storage.entity<ContentEntity>(CONTENT_ENTITY_NAME)
        .set(content.contentId, content)
    }

    static async get(contentId: string): Promise<ContentEntity | undefined> {
        const result = await storage.entity<ContentEntity>(CONTENT_ENTITY_NAME)
            .get(contentId)

        return result
    }

    static async getByStatus(status: string): Promise<ContentEntity[]> {
        const result = await storage.entity<ContentEntity>(CONTENT_ENTITY_NAME)
            .query()
            .index('status')
            .where(WhereConditions.equalsTo(status))
            .getMany()
        return result?.results?.map(result => result.value) || []
    }
}