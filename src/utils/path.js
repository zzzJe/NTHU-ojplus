import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

/**
 * Parse the file name in the path.
 * @param {string} path 
 * 
 * @example
 * // returns 'i_love_mopping.txt'
 * parse_filename('usr/src/app/i_love_mopping.txt');
 * @example
 * // returns 'executable'
 * parse_filename('usr/src/app/executable');
 * 
 * @returns {string}
 */
function parse_filename(path) {
    const [name_with_ext] = path.split(/\/|\\/g).slice(-1);
    const name = name_with_ext.split('.')[0];
    return name;
}

const source_base = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const isolate_base = (id = 0) => `/var/local/lib/isolate/${id}/box`;
isolate_base.toString = () => '/var/local/lib/isolate/0/box';

export {
    join,
    parse_filename,
    source_base,
    isolate_base,
};
