import Resolver from "@forge/resolver";
import { getPageById, searchWithCql } from "../lib/page";
import { STATUS_ACTIVE } from "../lib/const";
import { getSpaceById, getSpaceByKey, getSpaces } from "../lib/spaces";
import { SpaceEntity, SpaceStore } from "../lib/store/space";
import { ContentEntity, ContentStore } from "../lib/store/content";
import { error, success } from "../lib/api";
import { isConfluenceApiErrorResponse, SpaceDescriptor } from "../lib/types";

const resolver = new Resolver();

resolver.define("getPage", async (req) => {
    const contentId = req.payload.contentId;
    const contentType = req.payload.contentType;

    const page = await getPageById(contentId);
    if (!page) {
        return error(`Unable to find content with ID ${contentId}`)
    }

    const space = await getSpaceById(page.spaceId);
    if (!space) {
        return error(`Unable to find space with ID ${page.spaceId}`)
    }

    let meta = await ContentStore.get(contentId)
    if (!meta) {
        meta = {
            contentId,
            contentType,
            title: page.title,
            status: STATUS_ACTIVE,
            spaceId: page.spaceId,
            spaceKey: space.key
        }

        ContentStore.set(meta);
    }

    return success<ContentEntity>(meta)
});

resolver.define('setPageStatus', async (req) => {    
    const contentId = req.payload.contentId;
    const contentType = req.payload.contentType;
    const status = req.payload.status;
    const page = await getPageById(contentId);
    if (!page) {
        return error(`Unable to find content with ID ${contentId}`)        
    }
    
    const space = await getSpaceById(page.spaceId);
    if (!space) {
        return error(`Unable to find space with ID ${page.spaceId}`)
    }

    const newContentEntity = {
        contentId,
        contentType,
        title: page.title,
        spaceId: page.spaceId,
        spaceKey: space.key,
        status,
    }

    await ContentStore.set(newContentEntity)

    return success<ContentEntity>(newContentEntity);
});

resolver.define('getPagesWithStatus', async (req) => {
    const pages = await ContentStore.getByStatus(req.payload.status);
    return success<ContentEntity[]>(pages);
});

resolver.define('getSpace', async (req) => {
    const spaceKey = req.payload.spaceKey;
    const space = await getSpaceByKey(spaceKey);
    if (!space) {
        return error(`Unable to find space with key ${spaceKey}`);
    }

    let meta = await SpaceStore.get(spaceKey);
    if (!meta) {
        meta = {
            key: space.key,
            spaceId: space.id,
            title: space.name,
            status: STATUS_ACTIVE
        }

        SpaceStore.set(meta);
    }
    
    return success<SpaceEntity>(meta);
})

resolver.define('setSpaceStatus', async (req) => {
    const spaceKey = req.payload.spaceKey;
    const status = req.payload.status;
    const space = await getSpaceByKey(spaceKey);
    if (!space) {
        return error(`Unable to find space with key ${spaceKey}`);
    }

    const newSpaceEntity = {
        key: space.key,
        spaceId: space.id,
        title: space.name,
        status,
    }

    await SpaceStore.set(newSpaceEntity)

    return success<SpaceEntity>(newSpaceEntity);
})

resolver.define('getSpacesWithStatus', async (req) => {
    const spaces = await SpaceStore.getByStatus(req.payload.status);    
    return success<SpaceEntity[]>(spaces);
})

resolver.define('getAllSpaces', async (req) => {
    const spaces = await getSpaces();
    return success<SpaceDescriptor[]>(spaces);
})

resolver.define('searchWithCql', async (req) => {
    const content = await searchWithCql(req.payload.cql, req.payload.limit, req.payload.cursor, req.payload.isPrevCursor);
    if (isConfluenceApiErrorResponse(content)) {
        return error(content.error);
    }
    return success(content.results);
});

export const handler = resolver.getDefinitions();
