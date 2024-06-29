
// Get a specific parameter from a given URL
export function getUrlParameter(url: string | undefined, parameter: string): string {
    if (!url) return "";
    const urlOb = new URL(url, "http://example.com");
    return urlOb.searchParams.get(parameter) ?? "";
}