import { Box, Stack, Heading, DynamicTable, Button } from "@forge/react";
import React, { useCallback, useEffect } from "react";
import { STATUS_STAGED_FOR_ARCHIVE } from "../../lib/const";
import { invoke } from "@forge/bridge";
import { ResolverResponse } from "../../lib/api";
import { ContentEntity } from "../../lib/store/content";

export function MarkedForArchiveTable ({ content,loading }: { loading: boolean, content: ContentEntity[] }) {
    const header = {
        cells: [
            {
                key: "title",
                content: "Title",
            },
            {
                key: "space",
                content: "Space",
            },
            {
                key: "status",
                content: "Status",
            },
        ],
    };
    
    const cells = content.map((page) => ({
        key: page.contentId,
        cells: [
            {
                key: "title",
                content: page.title,
            },
            {
                key: "space",
                content: page.spaceKey,
            },
            {
                key: "status",
                content: page.status,
            },
        ],
    }));

    return (
        <DynamicTable head={header} rows={cells} isLoading={loading} />
    );
}
export function MarkedForArchiveSection() {

    const [content, setContent] = React.useState<ContentEntity[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    const fetchContent = useCallback(async () => {
        setLoading(true)
        const response = await invoke<ResolverResponse<ContentEntity[]>>("getPagesWithStatus", { status: STATUS_STAGED_FOR_ARCHIVE });
        if (!response.success || !response.data) {
            return;
        }
        setLoading(false)
        setContent(response.data);
    }, []);

    useEffect(() => {
        fetchContent()
    }, [])

    return (
        <Box
            xcss={{
                borderStyle: "solid",
                borderWidth: "border.width",
                borderColor: "color.border.accent.gray",
                borderRadius: "border.radius",
                padding: "space.400",
            }}
        >
            <Stack space="space.300" grow="fill">
                <Heading as="h2">Staged Content</Heading>
                <MarkedForArchiveTable content={content} loading={loading}/>
                <Button onClick={fetchContent}>Refresh</Button>
            </Stack>
        </Box>
    );
}
