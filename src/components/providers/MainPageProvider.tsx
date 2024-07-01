import React, { createContext, useContext, useState } from "react";
import { ContentType } from "../../lib/api1.types";
import { ContentEntity } from "../../lib/store/content";


interface MarkedForArchiveContextType {
    updateMarkStatus: (content: ContentEntity[]) => void;    
    recentlyUpdated: ContentEntity[]
}

const MarkedForArchiveContext = createContext<MarkedForArchiveContextType>({
    updateMarkStatus: () => {},
    recentlyUpdated: []
})

export const useMarkedForArchive = () => {
    return useContext(MarkedForArchiveContext);
}

export function MarkedForArchiveProvider({ children }: { children: React.ReactNode }) {
    const [recentlyUpdated, setRecentlyUpdated] = useState<ContentEntity[]>([]);

    const updateMarkStatus = (content: ContentEntity[]) => {                
        setRecentlyUpdated(content);
    }

    return (
        <MarkedForArchiveContext.Provider value={{ updateMarkStatus, recentlyUpdated }}>
            {children}
        </MarkedForArchiveContext.Provider>
    )
}