#!/usr/bin/env node
/// <reference types="node" />
import 'colors';
import { Color } from 'colors';
declare type color = Exclude<keyof Color, 'bold'>;
export default class Shell {
    static exit(text?: string, color?: color): void;
    static write(text: string, color?: color): Promise<void>;
    static writeln(text: string, color?: color): Promise<void>;
    static spawn(cmd: string, showLog?: boolean): Promise<Buffer>;
    static spawnString(cmd: string): Promise<string>;
    static spawnMessage(cmd: string, msg: string, onErrorExit?: boolean): Promise<boolean>;
    static processMessage(proc: () => any, msg: string, onErrorExit?: boolean): Promise<boolean>;
    static askCheckBox<T extends string>(question: string, selections: {
        [x in T]: string;
    } | T[], defaultSelect?: T[]): Promise<T[]>;
    static askList<T extends string>(question: string, selections: {
        [x in T]: string;
    } | T[], defaultSelect?: T): Promise<T>;
    static askConfirm(question: string, defaultInput?: boolean): Promise<boolean>;
    static askInput(question: string, defaultInput?: string, validate?: RegExp | ((s: string) => boolean | string) | ((s: string) => Promise<boolean | string>), validateError?: string): Promise<string>;
    static askNumber(question: string, defaultInput?: number, validate?: RegExp | ((s: number) => boolean | string) | ((s: number) => Promise<boolean | string>), validateError?: string): Promise<number>;
    static askPassword(question: string, defaultInput?: string, validate?: RegExp | ((s: string) => boolean | string) | ((s: string) => Promise<boolean | string>), validateError?: string): Promise<string>;
}
export {};
//# sourceMappingURL=app.d.ts.map