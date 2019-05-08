#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const inquirer_1 = __importDefault(require("inquirer"));
require("colors");
class Shell {
    static exit(text = '退出程序', color = 'red') {
        console.info('\r\n' + text[color]);
        process.exit();
    }
    static write(text, color) {
        return new Promise((resolve, reject) => {
            process.stdout.on('error', reject);
            process.stdout.write(color ? text[color] : text, (err) => {
                process.stdout.removeListener('error', reject);
                err ? reject(err) : resolve();
            });
        });
    }
    static writeln(text, color) {
        return Shell.write(text + '\r\n', color);
    }
    static spawn(cmd, showLog = false) {
        const cmds = cmd.replace(/  +/g, ' ').trim().split(' ');
        const func = cmds[0];
        const prams = cmds.slice(1);
        let bfs = Buffer.alloc(0);
        return new Promise((resolve, reject) => {
            child_process_1.spawn(func, prams)
                .on('exit', (code) => {
                if (code == 0) {
                    resolve(bfs);
                }
                else {
                    reject(new Error(`spawn执行[${cmd}]失败,错误代码:${code}`));
                }
            })
                .on('error', (err) => {
                err.message = bfs.toString() + '\n' + err.message;
                reject(err);
            })
                .stdout.on('data', (bf) => {
                if (showLog) {
                    process.stdout.write(bf);
                }
                bfs = Buffer.concat([bfs, bf]);
            });
        });
    }
    static spawnString(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield Shell.spawn(cmd)).toString().trim();
        });
    }
    static processSpawn(cmd, msg, onErrorExit = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof cmd === 'string') {
                cmd = [cmd];
            }
            return yield Shell.processDone(() => __awaiter(this, void 0, void 0, function* () {
                for (let i of cmd) {
                    yield Shell.spawn(i);
                }
            }), msg, onErrorExit);
        });
    }
    static processDone(proc, msg, onErrorExit = false) {
        return __awaiter(this, void 0, void 0, function* () {
            Shell.write(msg + ' ...... ', 'yellow');
            try {
                yield proc();
                Shell.writeln('【成功】', 'green');
                return true;
            }
            catch (e) {
                Shell.writeln('【失败】', 'red');
                if (onErrorExit) {
                    Shell.exit(e.message + ' 退出程序');
                }
                return false;
            }
        });
    }
    static askCheckBox(question, selections, defaultSelect) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield inquirer_1.default.prompt({
                name: 'data',
                type: 'checkbox',
                message: question,
                default: defaultSelect,
                choices: compareSelections(selections)
            }))['data'];
        });
    }
    static askList(question, selections, defaultSelect) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield inquirer_1.default.prompt({
                name: 'data',
                type: 'list',
                message: question,
                default: defaultSelect,
                choices: compareSelections(selections)
            }))['data'];
        });
    }
    static askConfirm(question, defaultInput) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield inquirer_1.default.prompt({
                name: 'data',
                type: 'confirm',
                message: question,
                default: defaultInput
            }))['data'];
        });
    }
    static askInput(question, defaultInput, validate, validateError) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield inquirer_1.default.prompt({
                name: 'data',
                type: 'input',
                message: question,
                default: defaultInput,
                validate: validate && ((input) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof validate === 'function') {
                        return (yield validate(input.trim())) || validateError || false;
                    }
                    else {
                        return validate.test(input.trim()) || validateError || false;
                    }
                }))
            }))['data'];
        });
    }
    static askNumber(question, defaultInput, validate, validateError) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield inquirer_1.default.prompt({
                name: 'data',
                type: 'number',
                message: question,
                default: defaultInput,
                validate: validate && ((input) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof validate === 'function') {
                        return (yield validate(input)) || validateError || false;
                    }
                    else {
                        return validate.test(input.toString()) || validateError || false;
                    }
                }))
            }))['data'];
        });
    }
    static askPassword(question, defaultInput, validate, validateError) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield inquirer_1.default.prompt({
                name: 'data',
                type: 'password',
                message: question,
                default: defaultInput,
                mask: '*',
                validate: validate && ((input) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof validate === 'function') {
                        return (yield validate(input)) || validateError || false;
                    }
                    else {
                        return validate.test(input.toString()) || validateError || false;
                    }
                }))
            }))['data'];
        });
    }
}
exports.default = Shell;
const compareSelections = (selections) => {
    const back = [];
    if (selections instanceof Array) {
        return selections;
    }
    else {
        for (let key in selections) {
            back.push({
                name: selections[key],
                value: key,
            });
        }
        return back;
    }
};
//# sourceMappingURL=app.js.map