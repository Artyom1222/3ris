import { program } from 'commander';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createTaskTransform } from './tasks/index.js';

program
    .option('-i, --input <path>', 'Input file path')
    .option('-o, --output <path>', 'Output file path')
    .requiredOption('-t, --task <task>', 'Task to perform (sort or distance)')
    .parse(process.argv);

const options = program.opts();


if (!['sort', 'distance'].includes(options.task)) {
    console.error('Invalid task. Must be "sort" or "distance".');
    process.exit(1);
}

let inputStream;
if (options.input) {
    try {
        await fs.promises.access(options.input, fs.constants.R_OK);
        inputStream = createReadStream(options.input);
    } catch (error) {
        console.error(`Error accessing input file: ${error.message}`);
        process.exit(1);
    }
} else {
    inputStream = process.stdin;
}

let outputStream;
if (options.output) {
    try {
        const stats = await fs.promises.stat(options.output);
        if (stats.isDirectory()) {
            throw new Error('Output path is a directory');
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(`Error accessing output file: ${error.message}`);
            process.exit(1);
        }
    }
    const flags = options.input ? 'w' : 'a';
    outputStream = createWriteStream(options.output, { flags });
} else {
    outputStream = process.stdout;
}

const taskTransform = createTaskTransform(options.task);

async function runPipeline() {
    try {
        await pipeline(
            inputStream,
            taskTransform,
            outputStream
        );
    } catch (error) {
        console.error('Pipeline error:', error.message);
        process.exit(1);
    }
}

runPipeline();
