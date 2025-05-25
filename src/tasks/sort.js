import { Transform } from 'stream';

export class SortTransform extends Transform {
    _transform(chunk, encoding, callback) {
        try {
            const inputLine = chunk.toString().trim();
            const array = JSON.parse(inputLine);
            if (!Array.isArray(array)) {
                throw new Error('Input is not an array');
            }

            const sorted = array.sort((a, b) =>
                a.localeCompare(b, undefined, { sensitivity: 'base' })
            );
            this.push(JSON.stringify(sorted) + '\n');

            callback();
        } catch (error) {
            process.stderr.write(`Error (sort): ${error.message}\n`);
            callback();
        }
    }
}
