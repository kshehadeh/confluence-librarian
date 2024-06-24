import { Box, Stack, Heading } from "@forge/react";
import React from "react";
import { LABEL_MARKED_FOR_ARCHIVE } from "../../lib/const";
import { ContentTable } from "../shared/ContentTable";

export function MarkedForArchiveSection() {
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
                <Heading as="h2">Content Marked For Archive</Heading>
                <ContentTable cql={`label = '${LABEL_MARKED_FOR_ARCHIVE}'`} />
            </Stack>
        </Box>
    );
}
