import { storage } from "@forge/api";
import { WhereConditions } from "@forge/storage";


const SPACE_ENTITY_NAME = 'space_v2';

export interface SpaceEntity {
    key: string;
    spaceId: string;
    title: string;
    status: string
}


export class SpaceStore {
    static async set(space: SpaceEntity) {
        await storage.entity<SpaceEntity>(SPACE_ENTITY_NAME)
        .set(space.key, space)
    }

    static async get(key: string): Promise<SpaceEntity | undefined> {
        const result = await storage.entity<SpaceEntity>(SPACE_ENTITY_NAME)
            .get(key)
        return result
    }

    static async getByStatus(status: string): Promise<SpaceEntity[]> {
        const result = await storage.entity<SpaceEntity>(SPACE_ENTITY_NAME)
            .query()
            .index('status')
            .where(WhereConditions.equalsTo(status))
            .getMany()
        return result?.results?.map(result => result.value) || []
    }
}
