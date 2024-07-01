import { route } from '@forge/api'
import { ConfluenceApiErrorResponse, isConfluenceApiErrorResponse, SpaceDescriptor } from './types';
import { get, getErrorInfo, post, put } from './client';
import { SpaceResponse, Space, SpaceProperty } from './api2.types';

export async function getSpaces(): Promise<SpaceDescriptor[]> {
    const response = await get(route`/wiki/rest/api/space?status=current&limit=1000&type=global`)
    if (!response.ok) {
        return []
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

export async function getSpaceById(spaceId: string) : Promise<Space | undefined>{
    // get all the properties for a space
    const response = await get(route`/wiki/api/v2/spaces/${spaceId}`)
    if (!response.ok) {
        return undefined
    }

    // Find the one that matches 
    const space = await response.json() as Space
    return space
}