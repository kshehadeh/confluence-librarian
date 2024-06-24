import { route } from "@forge/api";
import { ConfluenceProperty } from "./api2.types";
import { get, post, put } from "./client";
import { ContentType } from "./api1.types";

export async function createProperty(contentId: string, contentType: ContentType, key: string, value: any) {

    if (contentType === "page") {
        const response = await post(route`/wiki/api/v2/pages/${contentId}/properties`, {
            key: key,
            value: value
        });
        return response.ok;
    }

    throw new Error("Unsupported content type");
}

export async function setProperty(contentId: string, contentType: ContentType, key: string, value: any) {
    // First get the property to see if it exists
    const property = await getProperty(contentId, contentType, key);
    if (!property) {
        return createProperty(contentId, contentType, key, value);
    }

    if (contentType === 'page') {
        const response = await put(route`/wiki/api/v2/pages/${contentId}/properties/${property.id}`, {
            key,
            value,
            version: {
                number: property.version.number + 1,
                message: "Updated property"
            }
        });

        return response.ok;
    }

    throw new Error("Unsupported content type");
}

export async function getProperty(contentId: string, contentType: ContentType, key: string): Promise<ConfluenceProperty | undefined> {

    let properties: ConfluenceProperty[] = [];
    if (contentType === 'page') {
        const response = await get(route`/wiki/api/v2/pages/${contentId}/properties`)
        if (!response.ok) {
            return undefined;
        }    

        properties = (await response.json())?.results as ConfluenceProperty[];
    } else {
        throw new Error("Unsupported content type");
    }

    if (properties) {
        const property = properties.find((property: any) => property.key === key);
        return property    
    }
}