export function useFacetQuery(selectedFacets: Record<string, string[]>): Record<string, any> {
    const params: Record<string, any> = {};

    Object.entries(selectedFacets).forEach(([facet, values]) => {
        if (facet === 'terms') {
            params[`q[${facet}]`] = values;
            return;
        }

        values.forEach((value, index) => {
            params[`q[${facet}][${index}]`] = value;
        });
    });

    return params;
}