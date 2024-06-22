import api, { route } from "@forge/api";
import { ConfluenceProperty } from "./types";

export function getErrorInfo(body: any) {
    console.log("Error info: " + JSON.stringify(body, null, 2));
    return body.errorMessages || body.errors || body.message || body.error || body;
}

export async function createProperty(pageId: string, key: string, value: any) {
    console.log("Creating property " + key + " with " + value);

    const response = await api.asApp()
        .requestConfluence(route`/wiki/api/v2/pages/${pageId}/properties`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: key,
                value: value
            }),
        });

    if (!response.ok) {
        console.log("Failed to create property: " + response.status + " " + response.statusText)
        return false;
    }

    return true;
}

export async function setProperty(pageId: string, key: string, value: any) {
    console.log("Setting property " + key + " to " + value);

    // First get the property to see if it exists
    const property = await getProperty(pageId, key);
    if (!property) {
        return createProperty(pageId, key, value);
    }

    const response = await api.asApp()
        .requestConfluence(route`/wiki/api/v2/pages/${pageId}/properties/${property.id}/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key,
                value,
                version: {
                    number: property.version.number + 1,
                    message: "Updated property"
                }
            }),
        });

    if (!response.ok) {
        console.log("Failed to set property: " + response.status + " " + response.statusText + "\n" + getErrorInfo(await response.json()));
        return false;
    }

    return true;
}

export async function getProperty(pageId: string, key: string): Promise<ConfluenceProperty | undefined> {
    console.log("Getting property: " + key);

    const response = await api.asApp()
        .requestConfluence(route`/wiki/api/v2/pages/${pageId}/properties`, {
            headers: {
                'Accept': 'application/json'
            }
        })

    if (!response.ok) {
        const errorInfo = await response.json();
        console.log("Failed to fetch properties: " + response.status + " " + response.statusText + " " + JSON.stringify(errorInfo, null, 2));
        return undefined;
    }

    const properties = await response.json() as { results: ConfluenceProperty[] };

    const property = properties.results.find((property: any) => property.key === key);

    return property
}
