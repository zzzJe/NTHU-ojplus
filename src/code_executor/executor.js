import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { LangaugeSort, CompileCommand, RunCommand } from '../utils/lang.js';
import { parse } from 'node:path';
import { source_base, isolate_base, join } from '../utils/path.js';
import { glob } from 'glob';

/**
 * Generate executable `{id}.out` in code_files/. May throw error if compilation failed.
 * @param {string} id Id represent the submission's identity 
 * @param {LangaugeSort} lang 
 * 
 * @example
 * // returns 'c8763'
 * await compile('c87663', LanguageSort.C);
 * 
 * @returns {Promise<string>}
 */
async function compile(id, lang) {
    const compile_cmd = CompileCommand[lang](id);
    const exec = promisify(execCallback);
    try {
        await exec(compile_cmd);
        return id;
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Run command with `{submit_id}.out` in problem labeled `{problem_id}`. May throw error if running failed.
 * @param {string} submit_id Id represent the submission's identity
 * @param {string} problem_id Id represent the problem
 * @param {LangaugeSort} lang 
 * 
 * @example
 * // returns 'c8763'
 * await run('c8763', LanguageSort.C);
 * 
 * @returns {Promise<string>}
 */
async function run(submit_id, problem_id, lang) {
    const existed_trashes = await glob(join(source_base, 'submission', 'result', '*'));
    for (const trash of existed_trashes) {
        await unlink(trash);
    }
    const existed_metas = await glob(join(source_base, 'submission', 'meta', '*'));
    for (const trash of existed_metas) {
        await unlink(trash);
    }
    const testcases = await glob(join(source_base, 'submission', 'input', problem_id, '*.txt'));
    if (testcases.length === 0)
        console.error('no testcase specified...');
    for (const testcase of testcases) {
        const testcase_id = parse(testcase).name;
        await run_single(submit_id, problem_id, testcase_id, lang);
    }
}

async function run_single(submit_id, problem_id, testcase_id, lang) {
    const run_cmd = RunCommand[lang](submit_id, testcase_id);
    // use db later
    await writeFile(join(isolate_base(), 'stdin.txt'), await readFile(join(source_base, 'submission', 'input', problem_id, `${testcase_id}.txt`)));
    const exec = promisify(execCallback);
    try {
        await exec(run_cmd);
        // use db later
    } catch (err) {
        // console.err(err);
    }
    await writeFile(join(source_base, 'submission', 'result', `${testcase_id}.txt`), await readFile(join(isolate_base(), 'result.txt')));
    return submit_id;
}

export {
    compile,
    run,
};
