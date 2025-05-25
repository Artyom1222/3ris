import { Transform } from 'stream';

export class DistanceTransform extends Transform {
    _transform(chunk, encoding, callback) {
        try {
            const inputLine = chunk.toString().trim();

            const [point1Str, point2Str] = inputLine.split(':');
            if (!point1Str || !point2Str) {
                throw new Error('Invalid format. Use [x1,y1]:[x2,y2]');
            }

            const point1 = JSON.parse(point1Str);
            const point2 = JSON.parse(point2Str);
            if (!Array.isArray(point1) || point1.length !== 2 ||
                !Array.isArray(point2) || point2.length !== 2) {
                throw new Error('Points must be arrays of two numbers');
            }

            const distance = Math.abs(point1[0] - point2[0]) +
                Math.abs(point1[1] - point2[1]);
            this.push(distance.toString() + '\n');

            callback();
        } catch (error) {
            process.stderr.write(`Error (distance): ${error.message}\n`);
            callback();
        }
    }
}
