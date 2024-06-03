import Bull from 'bull';
import { compile, run } from '../code_executor/executor.js';
import { judge, JudgeResult } from '../code_executor/result.js';

const task = new Bull('judge', {
    redis: {
        host: 'redis',
    },
});

task.process(async job => {
    try {
        console.log(job.data);
        try {
            await compile(job.data.submit_id, job.data.lang);
        } catch (compile_err) {
            console.error(job.data.lang, compile_err);
            return [
                {
                    status: JudgeResult.CE,
                    testcase: null,
                    time: null,
                },
            ];
        }
        await run(job.data.submit_id, job.data.problem_id, job.data.lang);
        return await judge(job.data.problem_id);
    } catch (err) {
        console.log('some interal error occurs...\n', err.message);
    }
});

export {
    task,
};
