import React from "react";
import ForgeReconciler, {
    Box,
    Stack,
    Inline,
} from "@forge/react";
import { SearchWithCqlSection } from "../components/sections/SearchWithCqlSection";
import { MarkedForArchiveSection } from "../components/sections/MarkedForArchiveSection";
import { MarkedForArchiveProvider } from "../components/providers/MainPageProvider";
import { BrowseBySpaceSection } from "../components/sections/BrowseBySpaceSection";

const App = () => {
    return (
        <MarkedForArchiveProvider>
            <Inline space="space.400">
                <Box>
                    <Box
                        xcss={{
                            borderWidth: "border.width",
                            minWidth: "400px",
                            maxWidth: "100%",
                        }}
                    >
                        <MarkedForArchiveSection />
                    </Box>
                </Box>
                <Stack space={"space.400"}>
                    <Box
                        xcss={{
                            borderWidth: "border.width",
                            minWidth: "400px",
                            maxWidth: "100%",
                        }}
                    >
                        <SearchWithCqlSection />
                    </Box>

                    <Box
                        xcss={{
                            borderWidth: "border.width",
                            minWidth: "400px",
                            maxWidth: "100%",
                        }}
                    >
                        <BrowseBySpaceSection />
                    </Box>
                </Stack>
            </Inline>
        </MarkedForArchiveProvider>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
