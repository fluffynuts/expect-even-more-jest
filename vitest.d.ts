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
