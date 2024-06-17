export function useCSVExport() {
    const convertToCSV = (items: any[], headers: { title: string; value: string }[], excludeColumns: string[] = []) => {
        const filteredHeaders = headers.filter(header => !excludeColumns.includes(header.value));
        const headerRow = filteredHeaders.map(header => header.title).join(',');
        const dataRows = items.map(item => {
            return filteredHeaders.map(header => `"${item[header.value]}"`).join(',');
        }).join('\n');
        return `${headerRow}\n${dataRows}`;
    };

    const saveAsCSV = async (filename: string, content: string) => {
        const opts = {
            type: 'save-file',
            suggestedName: filename,
            types: [{
                description: 'CSV file',
                accept: { 'text/csv': ['.csv'] },
            }],
        };

        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
    };

    const exportCSV = async (items: any[], headers: { title: string; value: string }[], excludeColumns: string[], filename: string = 'export') => {
        const csvContent = convertToCSV(items, headers, excludeColumns);
        await saveAsCSV(`${filename}-${new Date().toLocaleString()}.csv`, csvContent);
    };

    return {
        exportCSV,
    };
}