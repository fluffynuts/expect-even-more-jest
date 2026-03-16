import type { Condition } from "./dist/index";

declare module "vitest" {
    interface Assertion<T = any> {
        toBePromiseLike(): void;
        toBeConstructor(): void;
        toBeA(constructor: any): void;
        toBeAn(constructor: any): void;
        toExist(): void;
        toIntersectionEqual(other: object): void;
        toBeError(withMessage?: string | RegExp): void;
        toBeEmptyOrWhitespace(): void;
        toHaveBeenCalledOnce(): void;
        toHaveBeenCalledOnceWith(...args: any[]): void;
        toHaveBeenCalledWith(...args: any[]): void;
        toHaveBeenCalledOnceWithNoArgs(): void;
        toHaveBeenMostRecentlyCalledWith(...args: [ typeof Match.byFn, (...a: any[]) => boolean | void ]): void;
        toHaveBeenMostRecentlyCalledWith(...args: [ typeof Match.byArgs, ...any[] ]): void;
        toHaveBeenMostRecentlyCalledWith(...args: [ typeof Match.byArgs | typeof Match.byFn, ...any[] ]): void;
        toHaveBeenMostRecentlyCalledWith(...args: [ any, ...any[] ]): void;
        toBeCompleted(): Promise<void>;
        toBeResolved(message?: string, timeout?: number): Promise<void>;
        toBeRejected(message?: string, timeout?: number): Promise<void>;
        toBeFile(): void;
        toBeFolder(): void;
        toHaveContents(expected: string | Buffer): void;
        toBeEquivalentTo<T>(other: T[]): void;
        toHaveKey(key: string): void;
        toHaveKeys(key1: string, ...keys: string[]): void;
        toAllMatch(fn: Condition): void;
        toContainElementLike(other: any): void;
        toHaveAttribute(attrib: string, expected?: string): void;
        toBeVisible(): void;
        toBeDisabled(): void;
        toThrowMatching(matcher: (e: string | Error) => boolean): void;
        toHaveData<T extends object>(expected: T): void;
        toHaveQueryParameter(key: string, value: string | RegExp | ((s: string) => boolean)): void;
    }

    interface AsymmetricMatchersContaining {
        toBePromiseLike(): void;
        toBeConstructor(): void;
        toBeA(constructor: any): void;
        toBeAn(constructor: any): void;
        toExist(): void;
        toIntersectionEqual(other: object): void;
        toBeError(withMessage?: string | RegExp): void;
        toBeEmptyOrWhitespace(): void;
        toBeEquivalentTo<T>(other: T[]): void;
        toHaveKey(key: string): void;
        toHaveKeys(key1: string, ...keys: string[]): void;
        toAllMatch(fn: Condition): void;
        toContainElementLike(other: any): void;
        toHaveAttribute(attrib: string, expected?: string): void;
        toBeVisible(): void;
        toBeDisabled(): void;
        toThrowMatching(matcher: (e: string | Error) => boolean): void;
        toHaveData<T extends object>(expected: T): void;
    }
}
