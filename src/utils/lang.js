import { source_base, isolate_base, join } from './path.js';

const submission_base = join(source_base, 'submission');

/**
 * Enumeration to all acceptable language kinds.
 * @readonly
 * @enum {symbol}
 */
const LangaugeSort = {
    C: "C",
    Cpp: "Cpp",
};
Object.freeze(LangaugeSort);

/**
 * @readonly
 * @enum {(name: string) => string}
 */
const CompileCommand = {
    [LangaugeSort.C]: name => `gcc -O2 -std=c99 ${join(submission_base, 'raw', `${name}.c`)} -o ${join(isolate_base(), `${name}.out`)}`,
    [LangaugeSort.Cpp]: name => `g++ -O2 -std=c++17 ${join(submission_base, 'raw', `${name}.cpp`)} -o ${join(isolate_base(), `${name}.out`)}`,
};
Object.freeze(CompileCommand);

/**
 * @readonly
 * @enum {(name: string) => string}
 */
const RunCommand = {
    [LangaugeSort.C]: (name, testcase) => `isolate --meta=${join(submission_base, 'meta', `${testcase}.txt`)} --stdin=stdin.txt --stdout=result.txt --time=1 --wall-time=1.5 --mem=32768 --run ${name}.out`,
    [LangaugeSort.Cpp]: (name, testcase) => `isolate --meta=${join(submission_base, 'meta', `${testcase}.txt`)} --stdin=stdin.txt --stdout=result.txt --time=1 --wall-time=1.5 --mem=32768 --run ${name}.out`,
};
Object.freeze(RunCommand);

export {
    LangaugeSort,
    CompileCommand,
    RunCommand,
};
