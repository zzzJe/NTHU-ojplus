import api from './api.js';
import { task } from './task_queue/index.js';
import { LangaugeSort } from './utils/lang.js';

task.on('completed', (job, res) => {
    console.log(`Job id: ${job.id} has been completed and returned`, res);
});

task.add({
    submit_id: '10000',
    problem_id: '0',
    lang: LangaugeSort.C,
});

api.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
