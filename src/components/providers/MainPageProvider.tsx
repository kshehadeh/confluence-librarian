import React, { createContext, useContext, useState } from "react";
import { ContentDetails } from "../../lib/types";
import { ContentType } from "../../lib/api1.types";


interface MarkedForArchiveContextType {
    updateMarkStatus: (content: ContentDetails[]) => void;    
    recentlyUpdated: {
        contentId: string
        contentType: ContentType
        markedForArchive: boolean
    }[]
}

const MarkedForArchiveContext = createContext<MarkedForArchiveContextType>({
    updateMarkStatus: () => {},
    recentlyUpdated: []
})

export const useMarkedForArchive = () => {
    return useContext(MarkedForArchiveContext);
}

export function MarkedForArchiveProvider({ children }: { children: React.ReactNode }) {
    const [recentlyUpdated, setRecentlyUpdated] = useState<ContentDetails[]>([]);

    const updateMarkStatus = (content: ContentDetails[]) => {                
        setRecentlyUpdated(content);
    }

    return (
        <MarkedForArchiveContext.Provider value={{ updateMarkStatus, recentlyUpdated }}>
            {children}
        </MarkedForArchiveContext.Provider>
    )
}