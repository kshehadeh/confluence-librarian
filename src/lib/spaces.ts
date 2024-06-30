import { route } from '@forge/api'
import { ConfluenceApiErrorResponse, isConfluenceApiErrorResponse } from './types';
import { get, getErrorInfo, post, put } from './client';
import { SpaceResponse, Space, SpaceProperty } from './api2.types';

export async function getSpaces() {
    const response = await get(route`/wiki/rest/api/space?status=current&limit=1000&type=global`)
    if (!response.ok) {
        return {
            statusCode: response.status,
            error: getErrorInfo(await response.json())
        } as ConfluenceApiErrorResponse        
    }

    const body = await response.json()
    return body.results.map((space: any) => ({
        key: space.key,
        name: space.name,
    }))
}

export async function getSpacesWithProperty() {
    const response = await get(route`/wiki/rest/api/space?status=current&limit=1000&type=global`)
    if (!response.ok) {
        return {
            statusCode: response.status,
            error: getErrorInfo(await response.json())
        } as ConfluenceApiErrorResponse        
    }

    const body = await response.json()
    return body.results.map((space: any) => ({
        key: space.key,
        name: space.name,
    }))

}

export async function getSpaceByKey(spaceKey: string) : Promise<Space | undefined>{
    // get all the properties for a space
    const response = await get(route`/wiki/api/v2/spaces?key=${spaceKey}`)
    if (!response.ok) {
        return undefined
    }

    // Find the one that matches 
    const body = await response.json() as SpaceResponse
    return body.results.find((space: any) => space.key === spaceKey)

}

export async function getSpaceProperty(spaceKey: string, propertyKey: string): Promise<SpaceProperty | undefined>{
    const space = await getSpaceByKey(spaceKey)

    if (!space) {
        return undefined;
    }
    
    const response = await get(route`/wiki/api/v2/spaces/${space.id}/properties`)
    if (response) { 
        const body = await response.json()
        return body.results.find((property: any) => property.key === propertyKey)
    }

    return undefined
}

export async function setSpaceProperty(spaceKey: string, propertyKey: string, propertyValue: unknown) {
    const property = await getSpaceProperty(spaceKey, propertyKey)
    
    if (!property) {
        const space = await getSpaceByKey(spaceKey)
        if (!space) {
            return false
        }

        const response = await post(route`/wiki/api/v2/spaces/${space.id}/properties`, {
            key: propertyKey,
            value: propertyValue
        })
        
        return response.ok
    } else {
        const response = await put(route`/wiki/api/v2/spaces/${property.id}`, {
            key: propertyKey,
            value: propertyValue,
            version: {
                number: property.version.number + 1,
                message: "Updated by Librarian"
            }            
        })
        
        return response.ok
    }
}