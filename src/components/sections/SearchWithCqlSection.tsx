import React, { useEffect } from "react";
import {
    Box,
    Button,
    Form,
    Heading,
    Inline,
    Select,
    Stack,
    Textfield,
} from "@forge/react";
import { ContentTable, ContentTableLoadingState } from "../shared/ContentTable";
import { getKeyValue, storeKeyValue } from "../../lib/storage";

export function SearchWithCqlSection() {
    const [cql, setCql] = React.useState<string>("");
    const [finalCql, setFinalCql] = React.useState<string>("");
    const [loadingState, setLoadingState] =
        React.useState<ContentTableLoadingState>("success");
    const [recentCql, setRecentCql] = React.useState<string[]>([]);

    const onChange = (value: string) => {
        setCql(value);
    };

    const onSearch = () => {
        setFinalCql(cql);
    };

    const onSearchStateChange = (
        state: ContentTableLoadingState,
        cql: string,
    ) => {
        setLoadingState(state);

        if (state === "success") {
            addToRecentCqlQueries(cql);
        }
    };

    const addToRecentCqlQueries = React.useCallback(
        (cql: string) => {
            if (!recentCql.includes(cql)) {
                const newList = [...recentCql, cql];
                storeKeyValue("recentCql", newList);
                setRecentCql([...recentCql, cql]);
            }
        },
        [recentCql],
    );

    React.useEffect(() => {
        if (finalCql && !recentCql.includes(finalCql)) {
            setRecentCql([...recentCql, finalCql]);
        }
    }, [finalCql]);

    useEffect(() => {
        const recents = getKeyValue("recentCql");
        if (recents) {
            setRecentCql(recents);
        }
    }, []);

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
                <Heading as="h2">Search with CQL</Heading>

                <Form onSubmit={onSearch}>
                    <Inline alignBlock="center" space="space.300">
                        <Textfield
                            isMonospaced={true}
                            placeholder="Enter CQL query here"
                            name="cql"
                            width={"50%"}
                            value={cql}
                            onChange={(e) => onChange((e.target as any).value)}
                            elemAfterInput={
                                <Button
                                    type="submit"
                                    isDisabled={loadingState === "loading"}
                                >
                                    {loadingState === "loading"
                                        ? "Searching..."
                                        : "Search"}
                                </Button>
                            }
                        />
                    </Inline>
                </Form>

                <ContentTable
                    cql={finalCql}
                    onSearchStateChange={onSearchStateChange}
                    columns={["title", "space", "staged"]}
                />

                <Select
                    name="recentCql"
                    onChange={(v) => setCql(v.value)}
                    value={cql}
                    placeholder="Recent"
                    appearance="default"
                    options={recentCql.map((v) => {
                        return { label: v, value: v };
                    })}
                />
            </Stack>
        </Box>
    );
}
