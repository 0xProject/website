function convertToCSV(
    headers: string[],
    objArray: Array<{[key: string]: any}>): string {
    let str = `${headers.join('\t')}\r\n`;

    for (const element of objArray) {
        let line = '';
        for (const field of Object.keys(element)) {
            if (line !== '') { line += '\t'; }
            if (typeof(element[field] === 'object')) {
                line += JSON.stringify(element[field]);
            } else {
                line += element[field];
            }
        }

        str += `${line}\r\n`;
    }

    return str;
}

export function exportCSVFile(
    headers: string[],
    objArray: Array<{[key: string]: any}>,
    fileTitle?: string): any {

    const csv = convertToCSV(headers, objArray);

    const exportedFilenmae = `${fileTitle}.csv` || 'export.csv';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
