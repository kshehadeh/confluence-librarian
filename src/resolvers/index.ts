import Resolver from "@forge/resolver";
import { getProperty, setProperty } from "../lib/properties";
import { getContentById, addLabelToContent, getLabelDetails, removeLabelFromContent, searchWithCql } from "../lib/page";
import { LABEL_MARKED_FOR_ARCHIVE, PROPERTY_MARKED_FOR_ARCHIVE, STATUS_ACTIVE, STATUS_STAGED_FOR_ARCHIVE } from "../lib/const";
import { getSpaceByKey, getSpaceProperty, getSpaces, setSpaceProperty } from "../lib/spaces";
import { setContent, setSpace } from "../lib/forge-storage";

const resolver = new Resolver();

resolver.define("getPageDetails", async (req) => {
    const contentId = req.payload.contentId;
    const contentType = req.payload.contentType;

    const prop = await getProperty(contentId, contentType, PROPERTY_MARKED_FOR_ARCHIVE);
    return {
        contentId,
        contentType,
        markedForArchive: prop?.value || false,
    };
});

resolver.define('markForArchive', async (req) => {    
    const contentId = req.payload.contentId;
    const contentType = req.payload.contentType;
    const markedForArchive = req.payload.markedForArchive;
    const content = await getContentById(contentId);

    if (!content) {
        return {
            success: false,
        };
    }
    await setProperty(contentId, contentType, PROPERTY_MARKED_FOR_ARCHIVE, markedForArchive);

    await setContent({
        contentId,
        contentType,
        status: markedForArchive ? STATUS_STAGED_FOR_ARCHIVE : STATUS_ACTIVE,
        title: content.title,
    })

    if (markedForArchive) {
        await addLabelToContent(contentId, LABEL_MARKED_FOR_ARCHIVE);
    } else {
        await removeLabelFromContent(contentId, LABEL_MARKED_FOR_ARCHIVE);
    }

    return {
        success: true,
    };
});

resolver.define('getSpaceDetails', async (req) => {
    const spaceKey = req.payload.spaceKey;
    const space = await getSpaceByKey(spaceKey);
    const prop = await getSpaceProperty(spaceKey, PROPERTY_MARKED_FOR_ARCHIVE);
    return {
        id: space?.id,
        key: space?.key,
        name: space?.name,
        markedForArchive: prop?.value || false,
    };
})

resolver.define('getSpacesMarkedForArchive', async (req) => {
    
})

resolver.define('getLabelDetails', async (req) => {
    return getLabelDetails(LABEL_MARKED_FOR_ARCHIVE);    
})

resolver.define('searchWithCql', async (req) => {
    return searchWithCql(req.payload.cql, req.payload.limit, req.payload.cursor, req.payload.isPrevCursor);
});

resolver.define('getSpaces', async () => {
    return getSpaces();
});

resolver.define('markSpaceForArchive', async (req) => {
    const spaceKey = req.payload.spaceKey;
    const markedForArchive = req.payload.markedForArchive;

    const space = await getSpaceByKey(spaceKey);
    if (!space) {
        return {
            success: false,
        };
    }

    const success = setSpace({
        key: space.key,
        spaceId: space.id,
        title: space.name,
        status: markedForArchive ? STATUS_STAGED_FOR_ARCHIVE : STATUS_ACTIVE,
    })
    // const success = await setSpaceProperty(spaceKey, PROPERTY_MARKED_FOR_ARCHIVE, markedForArchive);

    return {
        success,
    };
});

export const handler = resolver.getDefinitions();
