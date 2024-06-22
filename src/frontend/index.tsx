import React, { useEffect, useState } from "react";
import ForgeReconciler, {
    Label,
    Text,
    Toggle,
} from "@forge/react";
import { invoke } from "@forge/bridge";
import { useProductContext } from "@forge/react";
import { PageDetails } from "../lib/types";

const App = () => {
    const context = useProductContext();
    const [data, setData] = useState<PageDetails | null>(null);

    useEffect(() => {
        invoke<PageDetails>("getPageDetails", {
            pageId: context?.extension.content.id,
        }).then(setData);
    }, []);

    const handleMarking = (mark: boolean) => {
        console.log(context?.extension);
        invoke("markForArchive", {
            pageId: context?.extension.content.id,
            mark,
        }).then(() => {
            setData({ markedForArchive: mark });
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
