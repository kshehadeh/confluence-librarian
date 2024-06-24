import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { CqlQueryResponse } from "../../lib/api1.types";
import { invoke } from "@forge/bridge";
import {
    ConfluenceApiErrorResponse,
    ContentDetails,
    isConfluenceApiErrorResponse,
} from "../../lib/types";
import { Link, Button, DynamicTable, SectionMessage } from "@forge/react";
import { DateTime } from "luxon";
import React from "react";
import { useMarkedForArchive } from "../providers/MainPageProvider";

export interface ContentTableProps {
    cql: string;
    emptyText?: ReactElement
    onSearchStateChange?: (state: ContentTableLoadingState) => void;
}

export type ContentTableLoadingState = "loading" | "error" | "success";

export function ContentTable({ cql, onSearchStateChange, emptyText }: ContentTableProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [results, setResults] = useState<CqlQueryResponse | undefined>(
        undefined,
    );

    const { recentlyUpdated, updateMarkStatus } = useMarkedForArchive();

    const markForArchive = useCallback(({contentId, contentType, markedForArchive}: ContentDetails) => {
        invoke("markForArchive", {
            contentId,
            contentType,
            markedForArchive,
        }).then(() => {            
            updateMarkStatus([{contentId, contentType, markedForArchive}]);
        });
    }, []);

    useEffect(() => {
        if (!results || !recentlyUpdated) {
            return;
        }

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
                                    id: page.metadata?.properties?.markedForArchive?.id,
                                    key: page.metadata?.properties?.markedForArchive?.key,
                                },
                            },
                        },
                    };
                }),
            };
        });
    }, [recentlyUpdated]);

    useEffect(() => {
        if (!cql) {
            return;
        }

        setResults(undefined);

        setLoading(true);
        onSearchStateChange?.("loading");
        invoke<CqlQueryResponse | ConfluenceApiErrorResponse>("searchWithCql", {
            cql,
            start: 0,
            limit: 10,
        })
            .then((response) => {
                setLoading(false);
                onSearchStateChange?.("success");

                if (isConfluenceApiErrorResponse(response)) {
                    setError(response.error);
                } else {
                    setError(undefined);
                    setResults(response);
                }
            })
            .catch((e) => {
                setLoading(false);
                onSearchStateChange?.("error");
                setError(e);
            });
    }, [cql]);

    const head = {
        cells: [
            { content: "Title" },
            { content: "Space" },
            { content: "Type" },
            { content: "Last Modified" },
            { content: "Actions" },
        ],
    };

    const rows = results?.results.map((page) => ({
        isHighlighted: !!page.metadata?.properties?.markedForArchive?.value,
        cells: [
            {
                content: (
                    <Link href={"/wiki" + page._links.webui}>{page.title}</Link>
                ),
            },
            { content: page.type },
            { content: page.space.key },
            {
                content: DateTime.fromISO(page.version.when).toFormat(
                    "yyyy LLL dd",
                ),
            },
            {
                content: page.metadata?.properties?.markedForArchive?.value ? (
                    <Button
                        spacing="compact"
                        iconBefore="undo"
                        onClick={() => markForArchive({contentId: page.id, contentType: page.type , markedForArchive: false})}
                    >
                        Unmark
                    </Button>
                ) : (
                    <Button
                        spacing="compact"
                        iconBefore="redo"
                        onClick={() => markForArchive({contentId: page.id, contentType: page.type , markedForArchive: true})}
                    >
                        Mark
                    </Button>
                ),
            },
        ],
    }));

    const emptyView = useMemo(
        () => (
            // if there's an error then show the error
            error ? <SectionMessage appearance="error">{error}</SectionMessage> : 

            // if there's no query, then explain that.
            !cql ? <SectionMessage>Enter a CQL query to search</SectionMessage> :

            // if there's no results, then show the empty text or a default message
            emptyText ? <SectionMessage>{emptyText}</SectionMessage> :
            <SectionMessage appearance="information">No results found</SectionMessage>                    
        ),
        [error, emptyText],
    );

    return (<DynamicTable rows={rows} head={head} emptyView={emptyView} />);
}
