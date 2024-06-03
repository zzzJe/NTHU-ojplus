import { readFile } from 'node:fs/promises';
import { source_base, join } from '../utils/path.js';
import { parse } from 'node:path';
import { glob } from 'glob';

/**
 * Enumeration to all acceptable language kinds.
 * @readonly
 * @enum {symbol}
 */
const JudgeResult = {
    CE: Symbol("CE"),
    AC: Symbol("AC"),
    WA: Symbol("WA"),
    PE: Symbol("PE"),
    RE: Symbol("RE"),
    TLE: Symbol("TLE"),
    XX: Symbol("XX"),
};
Object.freeze(JudgeResult);

async function judge_single(problem_id, testcase) {
    const meta_file_path = join(source_base, 'submission', 'meta', `${testcase}.txt`);
    const meta_content = (await readFile(meta_file_path)).toString();
    const meta = Object.fromEntries(
        Array.from(meta_content.split('\n').filter(String), e => e.split(':'))
    );
    const time = meta['time'];
    const exitcode = meta['exitcode'];

    if (exitcode !== '0') {
        const errorStatus = meta['status'];
        if (['RE', 'SG'].includes(errorStatus)) {
            return {
                status: JudgeResult.RE,
                testcase: testcase,
                time: time,
            };
        } else if (errorStatus === 'TO') {
            return {
                status: JudgeResult.TLE,
                testcase: testcase,
                time: time,
            };
        } else {
            return {
                status: JudgeResult.XX,
                testcase: testcase,
                time: time,
            };
        }
    } else {
        const user_answer_path = join(source_base, 'submission', 'result', `${testcase}.txt`);
        const actual_answer_path = join(source_base, 'submission', 'answer', problem_id, `${testcase}.txt`);
        const user_answer_content = (await readFile(user_answer_path)).toString();
        const actual_answer_content = (await readFile(actual_answer_path)).toString();
        if (user_answer_content === actual_answer_content) {
            return {
                status: JudgeResult.AC,
                testcase: testcase,
                time: time,
            };
        }
        if (user_answer_content.replace(/\s+/g, ':') === actual_answer_content.replace(/\s+/g, ':')) {
            return {
                status: JudgeResult.PE,
                testcase: testcase,
                time: time,
            };
        } else {
            return {
                status: JudgeResult.WA,
                testcase: testcase,
                time: time,
            };
        }
    }
}

async function judge(problem_id) {
    const user_answer_list = await glob(join(source_base, 'submission', 'result', '*'));
    let total_result = [];
    for (const user_answer of user_answer_list) {
        const single_result = await judge_single(problem_id, parse(user_answer).name);
        total_result = [...total_result, single_result];
    }
    return total_result;
}

export {
    JudgeResult,
    judge,
};
