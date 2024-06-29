import {
    Box,
    Stack,
    Heading,
    Button,
    Form,
    Inline,
    Select,    
    SectionMessage,
} from "@forge/react";
import React, { useCallback, useEffect } from "react";
import { ContentTable, ContentTableLoadingState } from "../shared/ContentTable";
import { invoke } from "@forge/bridge";
import { SpaceDescriptor } from "../../lib/types";
import { difference, differenceBy } from "es-toolkit";

export function BrowseBySpaceSection() {
    const [loadingState, setLoadingState] =
        React.useState<ContentTableLoadingState>("success");

    const [cql, setCql] = React.useState<string>("");
    const [retrievedSpaces, setRetrievedSpaces] = React.useState<SpaceDescriptor[]>([]);
    const [currentSpaces, setCurrentSpaces] = React.useState<SpaceDescriptor[]>(
        [],
    );

    const [spaces, setSpaces] = React.useState<SpaceDescriptor[]>([]);

    useEffect(() => {
        invoke<SpaceDescriptor[]>("getSpaces", {}).then((spaces) => {
            setSpaces(spaces);
        });
    }, []);

    const onSearch = () => {
        setLoadingState("loading");
        setCql(`type=page and space in (${currentSpaces.map((s) => `"${s.key}"`).join(",")})`);
    };

    const onSearchStateChange = (state: ContentTableLoadingState) => {
        if (state === "success") {
            setRetrievedSpaces([...currentSpaces]);
        }
        setLoadingState(state);
    };

    const allowSearch = useCallback(() => {
        if (loadingState === "loading") {
            return false;
        }

        if (currentSpaces.length === 0) {
            return false;
        }

        if (retrievedSpaces.length === 0) {
            return true;
        }

        const differences = differenceBy(currentSpaces, retrievedSpaces, (v) => v.key);        
        if (differences.length > 0) {
            return true;
        }

        return false;
    }, [currentSpaces, retrievedSpaces]);

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
                <Heading as="h2">Browse Staged By Space</Heading>

                <Form onSubmit={onSearch}>
                    <Inline alignBlock="center" space="space.300">
                        <Select
                            placeholder="Choose Space"
                            name="space"
                            options={spaces.map((s) => ({
                                label: s.name,
                                value: s.key,
                            }))}
                            isMulti
                            onChange={(value) => {
                                setCurrentSpaces(
                                    value.map(
                                        (v: {
                                            label: string;
                                            value: string;
                                        }) => ({
                                            key: v.value,
                                            name: v.label,
                                        }),
                                    ),
                                );
                            }}
                        />
                        <Button
                            type="submit"
                            isDisabled={!allowSearch()}
                        >
                            {loadingState === "loading"
                                ? "Searching..."
                                : "Search"}
                        </Button>
                    </Inline>
                </Form>

                <ContentTable
                    cql={cql}
                    onSearchStateChange={onSearchStateChange}
                    getStartedText={
                        <SectionMessage appearance="information">
                            Choose one or more spaces
                        </SectionMessage>
                    }
                    columns={["title", "space", "staged"]}
                />
            </Stack>
        </Box>
    );
}
