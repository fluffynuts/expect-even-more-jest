import { Condition } from "./index";

declare global {
    namespace jest {
        // noinspection JSUnusedGlobalSymbols
        interface Matchers<R> {
            // values
            toBePromiseLike(): void;
            toBeConstructor(): void;
            toBeA(constructor: any): void;
            toBeAn(constructor: any): void;
            toExist(): void;
            toIntersectionEqual(other: object): void;
            toBeError(withMessage?: string | RegExp): void;
            toBeEmptyOrWhitespace(): void;

            // mocks & spies
            toHaveBeenCalledOnce(): void;
            toHaveBeenCalledOnceWith(...args: any[]): void;
            toHaveBeenCalledWith(...args: any[]): void;
            toHaveBeenCalledOnceWithNoArgs(): void;

            // promises
            toBeCompleted(): Promise<void>;
            toBeResolved(message?: string, timeout?: number): Promise<void>;
            toBeRejected(message?: string, timeout?: number): Promise<void>;

            // file system
            toBeFile(): void;
            toBeFolder(): void;
            toHaveContents(expected: string | Buffer): void;

            // collections
            toBeEquivalentTo<T>(other: T[]): void;
            toHaveKey(key: string): void;
            toHaveKeys(key1: string, ...keys: string[]): void;
            toAllMatch(fn: Condition): void;
            toContainElementLike(other: any): void;

            // DOM
            toHaveAttribute(attrib: string, expected?: string): void;
            toBeVisible(): void;
            toBeDisabled(): void;

            // errors
            toThrowMatching(matcher: (e: string | Error) => boolean): void;
            // data-matching
            toHaveData<T extends object>(expected: T): void;
        }

        interface Expect {
          toBePromiseLike(): any;
          toBeConstructor(): any;
          toBeA(constructor: any);
          toBeAn(constructor: any);
          toExist(): any;
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
}
