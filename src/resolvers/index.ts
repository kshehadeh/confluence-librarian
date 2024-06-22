import Resolver from "@forge/resolver";
import { getProperty, setProperty } from "../lib/properties";

const resolver = new Resolver();

resolver.define("getPageDetails", async (req) => {
    const pageId = req.context.extension.content.id;
    const prop = await getProperty(pageId, 'markedForArchive');
    return {
        markedForArchive: prop?.value || false,
    };
});

resolver.define('markForArchive', async (req) => {

    const pageId = req.context.extension.content.id;
    await setProperty(pageId, 'markedForArchive', req.payload.mark);
    return {
        success: true,
    };
})

export const handler = resolver.getDefinitions();
