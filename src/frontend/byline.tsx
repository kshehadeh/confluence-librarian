import React, { useEffect, useState } from "react";
import ForgeReconciler, {
    Label,
    Text,
    Toggle,
} from "@forge/react";
import { invoke } from "@forge/bridge";
import { useProductContext } from "@forge/react";
import { ContentDetails } from "../lib/types";

const App = () => {
    const context = useProductContext();    
    const [data, setData] = useState<ContentDetails | null>(null);

    const contentId = context?.extension.content.id;
    const contentType = context?.extension.content.type;

    useEffect(() => {
        if (!context?.extension.content.id) return;

        invoke<ContentDetails>("getPageDetails", {
            contentId,
            contentType
        }).then(setData);
    }, [context?.extension.content.id]);

    const handleMarking = (mark: boolean) => {
        console.log(context?.extension);
        invoke("markForArchive", {
            contentId,
            contentType,
            mark,
        }).then(() => {
            setData({ contentId, contentType, markedForArchive: mark });
        });
    };

    if (!data) return <Text>Loading...</Text>;

    return (
        <>
            <Toggle
                id="markForArchive"
                size="large"
                isChecked={data.markedForArchive}
                onChange={() => handleMarking(!data.markedForArchive)}
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
