import { SortTransform } from './sort.js';
import { DistanceTransform } from './distance.js';

export function createTaskTransform(task) {
    switch (task) {
        case 'sort':
            return new SortTransform();
        case 'distance':
            return new DistanceTransform();
        default:
            throw new Error('Invalid task');
    }
}
