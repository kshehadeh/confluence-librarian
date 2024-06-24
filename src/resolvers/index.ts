import Resolver from "@forge/resolver";
import { getProperty, setProperty } from "../lib/properties";
import { addLabelToContent, getLabelDetails, removeLabelFromContent, searchWithCql } from "../lib/page";
import { LABEL_MARKED_FOR_ARCHIVE, PROPERTY_MARKED_FOR_ARCHIVE } from "../lib/const";

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
    await setProperty(contentId, contentType, PROPERTY_MARKED_FOR_ARCHIVE, markedForArchive);

    if (markedForArchive) {
        await addLabelToContent(contentId, LABEL_MARKED_FOR_ARCHIVE);
    } else {
        await removeLabelFromContent(contentId, LABEL_MARKED_FOR_ARCHIVE);
    }

    return {
        success: true,
    };
})

resolver.define('getLabelDetails', async (req) => {
    return getLabelDetails(LABEL_MARKED_FOR_ARCHIVE);    
})

resolver.define('searchWithCql', async (req) => {
    return searchWithCql(req.payload.cql, req.payload.start, req.payload.limit);
});

export const handler = resolver.getDefinitions();
