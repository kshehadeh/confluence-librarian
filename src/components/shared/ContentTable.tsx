import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { CqlQueryResponse } from "../../lib/api1.types";
import { invoke } from "@forge/bridge";
import {
    ConfluenceApiErrorResponse,
    ContentDetails,
    isConfluenceApiErrorResponse,
} from "../../lib/types";
import {
    Link,
    Button,
    DynamicTable,
    SectionMessage,
    Stack,
    Inline,
    Toggle,
} from "@forge/react";
import { DateTime } from "luxon";
import React from "react";
import { useMarkedForArchive } from "../providers/MainPageProvider";
import { getUrlParameter } from "../../lib/url";

const COLUMNS = {
    title: { key: "title", label: "Title" },
    space: { key: "space", label: "Space" },
    type: { key: "type", label: "Type" },
    modified: { key: "lastModified", label: "Last Modified" },
    staged: { key: "staged", label: "Staged" },
};

export type AvailableColumns = keyof typeof COLUMNS;

export interface ContentTableProps {
    cql: string;
    emptyText?: ReactElement;
    getStartedText?: ReactElement;
    limit?: number;
    columns?: AvailableColumns[];
    onSearchStateChange?: (
        state: ContentTableLoadingState,
        cql: string,
    ) => void;
}

export type ContentTableLoadingState = "loading" | "error" | "success";

export function ContentTable({
    cql,
    onSearchStateChange,
    getStartedText,
    emptyText,
    columns,
    limit = 10,
}: ContentTableProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [itemsBeingUpdated, setItemsBeingUpdated] = useState<string[]>([]);
    const [results, setResults] = useState<CqlQueryResponse | undefined>(
        undefined,
    );

    const { recentlyUpdated, updateMarkStatus } = useMarkedForArchive();

    const markForArchive = useCallback(
        ({ contentId, contentType, markedForArchive }: ContentDetails) => {
            setItemsBeingUpdated((items) => [...items, contentId]);
            invoke("markForArchive", {
                contentId,
                contentType,
                markedForArchive,
            }).then(() => {
                updateMarkStatus([
                    { contentId, contentType, markedForArchive },
                ]);

                setItemsBeingUpdated((items) =>
                    items.filter((item) => item !== contentId),
                );
            });
        },
        [],
    );

    const nextCursor = getUrlParameter(results?._links.next, "cursor");
    const prevCursor = getUrlParameter(results?._links.prev, "cursor");

    useEffect(() => {
        if (!results || !recentlyUpdated) {
            return;
        }

        const updatedInList = recentlyUpdated.find((updated) =>
            results.results.some(
                (page) =>
                    page.id === updated.contentId &&
                    page.type === updated.contentType,
            ),
        );

        if (!updatedInList) {
            // if the update content is not in the list then do a full refresh of the list
            //  because it may mean that a new content item was marked for archive.
            updateList(cql);
        } else {
            setResults((results) => {
                if (!results) {
                    return results;
                }

                return {
                    ...results,
                    results: results.results.map((page) => {
                        const updated = recentlyUpdated.find(
                            (updated) =>
                                updated.contentId === page.id &&
                                updated.contentType === page.type,
                        );

                        if (!updated) {
                            return page;
                        }

                        return {
                            ...page,
                            metadata: {
                                ...page.metadata,
                                properties: {
                                    ...page.metadata?.properties,
                                    markedForArchive: {
                                        value: updated.markedForArchive as any,
                                        id: page.metadata?.properties
                                            ?.markedForArchive?.id,
                                        key: page.metadata?.properties
                                            ?.markedForArchive?.key,
                                    },
                                },
                            },
                        };
                    }),
                };
            });
        }
    }, [recentlyUpdated]);

    const updateList = useCallback(
        (cql: string, cursor?: string, isPrevCursor?: boolean) => {
            console.log("CQL: ", cql);
            setLoading(true);
            onSearchStateChange?.("loading", cql);
            invoke<CqlQueryResponse | ConfluenceApiErrorResponse>(
                "searchWithCql",
                {
                    cql,
                    limit,
                    cursor,
                    isPrevCursor,
                },
            )
                .then((response) => {
                    setLoading(false);
                    onSearchStateChange?.("success", cql);

                    if (isConfluenceApiErrorResponse(response)) {
                        setError(response.error);
                    } else {
                        setError(undefined);
                        setResults(response);
                    }
                })
                .catch((e) => {
                    setLoading(false);
                    onSearchStateChange?.("error", cql);
                    setError(e);
                });
        },
        [],
    );

    useEffect(() => {
        if (!cql) {
            return;
        }
        updateList(cql);
    }, [cql]);

    if (!columns || columns.length === 0) {
        columns = ["title", "space", "type", "modified", "staged"];
    }

    const head = useMemo(() => {
        const cells: { content: string }[] = [];

        if (columns) {
            columns.forEach((column) => {
                cells.push({ content: COLUMNS[column].label });
            });
        }

        return {
            cells,
        };
    }, []);

    const rows = results?.results.map((page) => {
        const cells =
            columns?.map((column) => {
                switch (column) {
                    case "title":
                        return {
                            content: (
                                <Link href={"/wiki" + page._links.webui}>
                                    {page.title}
                                </Link>
                            ),
                        };
                    case "space":
                        return { content: page.space.key };
                    case "type":
                        return { content: page.type };
                    case "modified":
                        return {
                            content: DateTime.fromISO(
                                page.version.when,
                            ).toFormat("yyyy LLL dd"),
                        };
                    case "staged":
                        return {
                            content: page.type === 'page' ? (
                                <Toggle
                                    size="regular"
                                    name={`${page.id}-mark-for-archive`}
                                    label={"Stage"}
                                    isDisabled={
                                        itemsBeingUpdated.includes(page.id)
                                    }
                                    isChecked={
                                        !!page.metadata?.properties
                                            ?.markedForArchive?.value
                                    }
                                    onChange={(e) =>
                                        markForArchive({
                                            contentId: page.id,
                                            contentType: page.type,
                                            markedForArchive:
                                                !!e.target.checked,
                                        })
                                    }
                                />
                            ) : '',
                        };
                    default:
                        return { content: "" };
                }
            }) || [];
        return {
            isHighlighted: !!page.metadata?.properties?.markedForArchive?.value,
            cells,
        };
    });

    const emptyView = useMemo(
        () =>
            // if there's an error then show the error
            error ? (
                <SectionMessage appearance="error">{error}</SectionMessage>
            ) : // if there's no query, then explain that.
            !cql ? (
                getStartedText ?? (
                    <SectionMessage>Enter a CQL query to search</SectionMessage>
                )
            ) : (
                // if there's no results, then show the empty text or a default message
                emptyText ?? (
                    <SectionMessage appearance="information">
                        No results found
                    </SectionMessage>
                )
            ),
        [error, cql, emptyText],
    );

    return (
        <Stack space="space.300">
            <DynamicTable
                rows={rows}
                head={head}
                emptyView={emptyView}
                isLoading={loading}
            />
            <Inline space="space.300">
                <Button
                    isDisabled={loading || !results}
                    onClick={() => updateList(cql)}
                >
                    Refresh
                </Button>

                {results && results._links.prev && (
                    <Button
                        isDisabled={loading}
                        onClick={() => {
                            updateList(cql, prevCursor, true);
                        }}
                    >
                        Previous
                    </Button>
                )}

                {results && results._links.next && (
                    <Button
                        isDisabled={loading}
                        onClick={() => {
                            updateList(cql, nextCursor);
                        }}
                    >
                        Next
                    </Button>
                )}
            </Inline>
        </Stack>
    );
}
