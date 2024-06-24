import React, { useEffect, useState } from "react";
import ForgeReconciler, {
    Heading,
    Text,
    DynamicTable,
    Box,
    Stack,
} from "@forge/react";
import { invoke } from "@forge/bridge";
import { LabelDetails } from "../lib/api2.types";
import { SearchWithCqlSection } from "../components/sections/SearchWithCqlSection";
import { MarkedForArchiveSection } from "../components/sections/MarkedForArchiveSection";
import { MarkedForArchiveProvider } from "../components/providers/MainPageProvider";

const App = () => {

    return (
        <MarkedForArchiveProvider>
            <Stack space="space.400">
                <Box xcss={{ borderWidth: "border.width" }}>
                    <MarkedForArchiveSection />
                </Box>

                <Box xcss={{ borderWidth: "border.width" }}>
                    <SearchWithCqlSection />
                </Box>
            </Stack>
        </MarkedForArchiveProvider>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
