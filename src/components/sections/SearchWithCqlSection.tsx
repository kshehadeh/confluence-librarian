import React from "react";
import {
    Box,
    Button,
    Form,
    Heading,
    Inline,
    Stack,
    Textfield,
} from "@forge/react";
import { ContentTable, ContentTableLoadingState } from "../shared/ContentTable";

export function SearchWithCqlSection() {
    const [cql, setCql] = React.useState<string>("");
    const [finalCql, setFinalCql] = React.useState<string>("");
    const [loadingState, setLoadingState] = React.useState<ContentTableLoadingState>("success");

    const onChange = (value: string) => {
        setCql(value);
    };

    const onSearch = () => {
        setFinalCql(cql);
    };

    const onSearchStateChange = (state: ContentTableLoadingState) => {
        setLoadingState(state);
    }

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
                            width={400}
                            value={cql}
                            onChange={(e) => onChange((e.target as any).value)}
                        />
                        <Button type="submit" isDisabled={loadingState === 'loading'}>
                            {loadingState === 'loading' ? "Searching..." : "Search"}
                        </Button>
                    </Inline>
                </Form>

                <ContentTable cql={finalCql} onSearchStateChange={onSearchStateChange} />
            </Stack>
        </Box>
    );
}
