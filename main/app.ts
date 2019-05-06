#!/usr/bin/env node
import { spawn } from 'child_process'
import inquirer from 'inquirer'
import 'colors'
import { Color } from 'colors';
type color = Exclude<keyof Color, 'bold'>

export default class Shell {
    static exit(text: string = '退出程序', color: color = 'red') {
        console.info('\r\n' + text[color])
        process.exit()
    }

    static write(text: string, color?: color) {
        return new Promise<void>((resolve, reject) => {
            process.stdout.on('error', reject)
            process.stdout.write(color ? text[color] : text, (err) => {
                process.stdout.removeListener('error', reject)
                err ? reject(err) : resolve()
            })
        })
    }

    static writeln(text: string, color?: color) {
        return Shell.write(text + '\r\n', color)
    }

    static spawn(cmd: string, showLog = false) {
        const cmds = cmd.replace(/  +/g, ' ').trim().split(' ')
        const func = cmds[0]
        const prams = cmds.slice(1)
        let bfs = Buffer.alloc(0)
        return new Promise<Buffer>((resolve, reject) => {
            spawn(func, prams)
                .on('exit', (code) => {
                    if (code == 0) {
                        resolve(bfs)
                    } else {
                        reject(new Error(`spawn执行[${cmd}]失败,错误代码:${code}`))
                    }
                })
                .on('error', (err) => {
                    err.message = bfs.toString() + '\n' + err.message
                    reject(err)
                })
                .stdout.on('data', (bf) => {
                    if (showLog) {
                        process.stdout.write(bf)
                    }
                    bfs = Buffer.concat([bfs, bf])
                })
        });
    }
    static async spawnString(cmd: string) {
        return (await Shell.spawn(cmd)).toString()
    }
    static async spawnMessage(cmd: string, msg: string, onErrorExit = false) {
        Shell.write(msg + ' ...... ', 'yellow')
        try {
            await Shell.spawn(cmd)
            Shell.writeln('【成功】', 'green')
            return true
        } catch (e) {
            Shell.writeln('【失败】', 'red')
            if (onErrorExit) {
                Shell.exit(e.message + ' 退出程序')
            }
            return false
        }
    }

    static async askCheckBox<T extends string>(
        question: string,
        selections: { [x in T]: string } | T[],
        defaultSelect?: T[]
    ): Promise<T[]> {
        return (await inquirer.prompt({
            name: 'data',
            type: 'checkbox',
            message: question,
            default: defaultSelect,
            choices: compareSelections(selections)
        }) as any)['data']
    }

    static async askList<T extends string>(
        question: string,
        selections: { [x in T]: string } | T[],
        defaultSelect?: T
    ): Promise<T> {
        return (await inquirer.prompt({
            name: 'data',
            type: 'list',
            message: question,
            default: defaultSelect,
            choices: compareSelections(selections)
        }) as any)['data']
    }

    static async askConfirm(question: string, defaultInput?: boolean): Promise<boolean> {
        return (await inquirer.prompt({
            name: 'data',
            type: 'confirm',
            message: question,
            default: defaultInput
        }) as any)['data']
    }

    static async askInput(
        question: string,
        defaultInput?: string,
        validate?: RegExp | ((s: string) => boolean | string) | ((s: string) => Promise<boolean | string>),
        validateError?: string
    ): Promise<string> {
        return (await inquirer.prompt({
            name: 'data',
            type: 'input',
            message: question,
            default: defaultInput,
            validate: validate && (async (input: string) => {
                if (typeof validate === 'function') {
                    return await validate(input.trim()) || validateError || false
                } else {
                    return validate.test(input.trim()) || validateError || false
                }
            })
        }) as any)['data']
    }

    static async askNumber(
        question: string,
        defaultInput?: number,
        validate?: RegExp | ((s: number) => boolean | string) | ((s: number) => Promise<boolean | string>),
        validateError?: string
    ): Promise<number> {
        return (await inquirer.prompt({
            name: 'data',
            type: 'number',
            message: question,
            default: defaultInput,
            validate: validate && (async (input: number) => {
                if (typeof validate === 'function') {
                    return await validate(input) || validateError || false
                } else {
                    return validate.test(input.toString()) || validateError || false
                }
            })
        }) as any)['data']
    }

    static async askPassword(
        question: string,
        defaultInput?: string,
        validate?: RegExp | ((s: string) => boolean | string) | ((s: string) => Promise<boolean | string>),
        validateError?: string
    ): Promise<string> {
        return (await inquirer.prompt({
            name: 'data',
            type: 'password',
            message: question,
            default: defaultInput,
            mask: '*',
            validate: validate && (async (input: string) => {
                if (typeof validate === 'function') {
                    return await validate(input) || validateError || false
                } else {
                    return validate.test(input.toString()) || validateError || false
                }
            })
        }) as any)['data']
    }
}

const compareSelections = (selections: { [x: string]: string } | string[]) => {
    const back: any[] = []
    if (selections instanceof Array) {
        return selections
    } else {
        for (let key in selections) {
            back.push({
                name: selections[key],
                value: key,
            })
        }
        return back
    }
}