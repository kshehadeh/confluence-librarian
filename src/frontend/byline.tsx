import React, { useEffect, useState } from "react";
import ForgeReconciler, {
    Label,
    Text,
    Toggle,
} from "@forge/react";
import { invoke } from "@forge/bridge";
import { useProductContext } from "@forge/react";
import { STATUS_ACTIVE, STATUS_STAGED_FOR_ARCHIVE } from "../lib/const";
import { ResolverResponse } from "../lib/api";
import { ContentEntity } from "../lib/store/content";


const App = () => {
    const context = useProductContext();    
    const [data, setData] = useState<ContentEntity | null>(null);

    const contentId = context?.extension.content.id;
    const contentType = context?.extension.content.type;

    useEffect(() => {
        if (!context?.extension.content.id) return;

        invoke<ResolverResponse<ContentEntity>>("getPage", {
            contentId,
            contentType
        }).then((result) => {
            if (!result.success || !result.data) {
                return console.error(result.error);
            }

            setData(result.data)
        });
    }, [context?.extension.content.id]);

    const handleMarking = (mark: boolean) => {        
        invoke<ResolverResponse<ContentEntity>>("setPageStatus", {
            contentId,
            contentType,
            status: mark ? STATUS_STAGED_FOR_ARCHIVE : STATUS_ACTIVE,
        }).then((result: ResolverResponse<ContentEntity>) => {
            if (result.success && result.data) {
                setData(result.data);
            }            
        });
    };

    if (!data) return <Text>Loading...</Text>;

    return (
        <>
            <Toggle
                id="markForArchive"
                size="large"
                isChecked={data.status === STATUS_STAGED_FOR_ARCHIVE}
                onChange={() => handleMarking(data.status !== STATUS_STAGED_FOR_ARCHIVE)}
            />
            <Label labelFor="markForArchive">Marked For Archive</Label>
        </>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
