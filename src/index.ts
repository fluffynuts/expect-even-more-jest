import fs from "fs";
import Mock = jest.Mock;
import "expect-more-jest";
import { isEqual as _isEqual } from "lodash";

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export type Nullable<T> = (T | null);

/**
 * Wrapper around lodash.isequal, which also accepts a debug
 * parameter -- when set true, failed equality checks will be
 * dumped to the console
 * @param left
 * @param right
 * @param debug
 */
export function areEqual(
    left: any,
    right: any,
    debug?: boolean) {
    const result = _isEqual(left, right);
    if (!result && debug) {
        console.debug(`areEqual mismatch:\n` +
            `left:\n${JSON.stringify(left)}\n` +
            `right:${JSON.stringify(right)}`);
    }
    return result;
}

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeAsyncFunction(): void;
            toBePromiseLike(): void;
            toBeConstructor(): void;
            toBeA(constructor: any): void;
            toBeAn(constructor: any): void;
            toHaveBeenCalledOnce(): void;
            toHaveBeenCalledOnceWith(...args: any[]): void;
            toBeHidden(): void;
            toBeVisible(): void;
            toBeQuery(): void;
            toBeCommand(): void;
            toBeCompleted(): Promise<void>;
            toBeResolved(message?: string, timeout?: number): Promise<void>;
            toBeRejected(message?: string, timeout?: number): Promise<void>;
            toExist(): void;
            toBeDisabled(): void;
            toBePrototypical(): void;
            toBeFile(): void;
            toBeFolder(): void;
            toBeEquivalentTo<T>(other: T[]): void;
            toHaveKey(key: string): void;
            toHaveKeys(key1: string, ...keys: string[]): void;
            toEql(other: any): void;
            toIntersectionEqual(other: object): void;
            toAllMatch(fn: Condition): void;
        }
    }
}
export type Condition = (item: any) => boolean;

function assert(expr: boolean, failMessage: string | (() => string)) {
    if (!expr) {
        if (typeof failMessage === "function") {
            failMessage = failMessage();
        }
        throw new Error(failMessage);
    }
    return failMessage;
}

interface IHasIsNot {
    isNot: boolean;
}

function runAssertions(ctx: IHasIsNot, func: () => string | (() => string)) {
    try {
        const message = func() || "";
        return {
            message: typeof message === "function" ? message : () => message,
            pass: true
        };
    } catch (e) {
        return {
            pass: false,
            message: () => e.message || e
        };
    }
}


async function runAssertionsAsync(ctx: IHasIsNot, func: () => Promise<void>) {
    try {
        await func();
        return {
            message: () => "",
            pass: !ctx.isNot
        };
    } catch (e) {
        return {
            pass: false,
            message: () => e.message || e
        };
    }
}


function testIsQueryOrCommand(ctx: any, actual: any) {
    assert(actual !== undefined, "Actual is undefined");
    assert(actual.prototype !== undefined, `${ actual } is not a constructor`);
    assert(typeof actual.prototype.execute === "function",
        `${ actual } has no 'execute' function`);
    return () => `expected ${ actual }${ notFor(ctx) }to be a query or command`;
}

function testIsInstance(actual: any, ctor: any) {
    assert(actual !== undefined, "actual is undefined");
    assert(actual !== null, "actual is null");
    assert(actual instanceof ctor,
        `Expected instance of ${ Object.prototype.toString.call(ctor) } but got ${ actual }`);
}

function notFor(self: any) {
    return self.isNot
        ? " not "
        : " ";
}


function assertHasKeys(
    obj: object,
    keys: string[],
    msg: () => string): (() => string) {
    assert(!!obj, "actual is not set");
    assert(typeof obj === "object", "actual is not an object");
    assert((() => {
        const objectKeys = Object.keys(obj);
        return keys.reduce((acc, cur) =>
            acc && objectKeys.indexOf(cur) > -1,
            true);
    })(), msg);
    return msg;
}

function prettyPrint(obj: object | any[]) {
    return JSON.stringify(obj, null, 2);
}

function intersect<T>(left: T[], right: T[]): T[] {
    const result: Array<T> = [];
    left.forEach(value => {
        if (result.indexOf(value) === -1 && right.indexOf(value) > -1) {
            result.push(value);
        }
    });
    right.forEach(value => {
        if (result.indexOf(value) === -1 && left.indexOf(value) > -1) {
            result.push(value);
        }
    });
    return result;
}

beforeAll(() => {
    expect.extend({
        toAllMatch(actual: any, condition: Condition) {
            return runAssertions(this, () => {
                const die = (m: string) => {
                    throw new Error(`toAllMatch: ${ m }`);
                };
                if (!Array.isArray(actual)) {
                    return die("Actual must be an array");
                }
                if (!condition) {
                    return die("condition not set");
                }
                const misMatches = actual.filter(condition);
                assert(misMatches.length === 0,
                    `Some elements don't match the provided condition:\n\n${
                        misMatches.map(m => JSON.stringify(m)).join("\n")
                    }`);
                return "Expected to find mismatches, but didn't";
            });
        },
        toEql(actual: any, expected: any) {
            return runAssertions(this, () => {
                const msg = () => `expected ${ actual } to == ${ expected }`;
                // tslint:disable-next-line:triple-equals
                return assert(actual == expected, msg());
            });
        },
        toIntersectionEqual(actual: any, expected: any) {
            return runAssertions(this, () => {
                assert(!!actual, "actual is null or undefined");
                assert(!!expected, "expected is null or undefined");
                const
                    actualProps = Object.keys(actual),
                    expectedProps = Object.keys(expected),
                    intersection = intersect(actualProps, expectedProps);
                assert(!!intersection.length, "No intersection properties found");
                const mismatches = intersection.reduce(
                    (acc, cur) => {
                        if (!areEqual(actual[cur], expected[cur])) {
                            acc.push(`expected ${ cur } to be ` +
                                `${ JSON.stringify(expected[cur]) } but got ${ JSON.stringify(actual[cur]) }`);
                        }
                        return acc;
                    }, [] as string[]);
                const msg = () => mismatches.join("\n");
                assert(mismatches.length === 0, msg);
                return msg;
            });
        },
        toHaveKeys(actual: object, ...expected: string[]) {
            return runAssertions(this, () => {
                assert(!!expected, "keys are not set");
                const msg = () => `expected\n${ prettyPrint(actual) }\nto have keys\n${ prettyPrint(expected) }`;
                return assertHasKeys(actual, expected, msg);
            });
        },
        toHaveKey(actual: object, expected: string) {
            return runAssertions(this, () => {
                assert(!!expected, "key is not set");
                const msg = () => `expected ${ prettyPrint(actual) } to have key "${ expected }"`;
                return assertHasKeys(
                    actual, [expected], msg
                );
            });
        },
        toBeEquivalentTo(actual: any[], expected: any[]) {
            return runAssertions(this, () => {
                const msg = () => `expected collection equivalent to\n${
                    prettyPrint(expected)
                }\nbut got\n${
                    prettyPrint(actual)
                }`;
                assert(Array.isArray(actual), () => `${ actual } is not an array`);
                assert(Array.isArray(expected), () => `${ expected } is not an array`);
                assert(
                    actual.length === expected.length,
                    msg);
                assert(actual.reduce((acc, cur) =>
                    acc && expected.indexOf(cur) > -1,
                    true), msg);
                return msg;
            });
        },
        toBeFile(actual: string) {
            return runAssertions(this, () => {
                const msg = () => `expected ${ actual } ${ notFor(this) }to be a file`;
                assert(!!actual, msg);
                assert(fs.existsSync(actual), msg);
                return msg;
            });
        },
        toBeFolder(actual: string) {
            return runAssertions(this, () => {
                const msg = () => `expected ${ actual } ${ notFor(this) }to be a folder`;
                assert(!!actual, msg);
                assert((() => {
                    if (!fs.existsSync(actual)) {
                        return false;
                    }
                    return fs.statSync(actual).isDirectory();
                })(), msg);
                return msg;
            });
        },
        toBePrototypical(actual: any) {
            return runAssertions(this, () => {
                const msg = () => `expected${ notFor(this) }prototype, but got ${ prettyPrint(actual) }`;
                assert(actual, msg);
                assert(actual.prototype, msg);
                return msg;
            });
        },
        toBeAsyncFunction(actual: any) {
            return runAssertions(this, () => {
                const msg = () => `expected${ notFor(this) }async function but got ${ prettyPrint(actual) }`;
                assert(Object.prototype.toString.call(actual) === "[object AsyncFunction]" ||
                    Object.prototype.toString.call(actual) === "[object Function]",
                    msg);
                return msg;
            });
        },
        toBePromiseLike(actual: any) {
            return runAssertions(this, () => {
                const err = (moreInfo?: string) => {
                    return `expected something${ notFor(this) }promise-like, but got ${
                        actual
                    }${ moreInfo ? "\n\t(" : "" }${ moreInfo }${ moreInfo ? ")" : "" }`;
                };

                assert(actual, err);
                assert(typeof actual === "object", err);
                assert(actual.then && typeof actual.then === "function",
                    "should have a then function");
                return () => err();
            });
        },
        toBeConstructor(actual: any) {
            return runAssertions(this, () => {
                const err = () => {
                    return `expected ${ actual }${ notFor(this) }to be a constructor`;
                };

                assert(actual, err);
                assert(actual.prototype, err);
                return err;
            });
        },
        toBeA(actual, ctor) {
            return runAssertions(this, () => {
                testIsInstance(actual, ctor);
                return () => `expected${ notFor(this) }to get instance of ${ ctor }, but received ${ actual }`;
            });
        },
        toBeAn(actual, ctor) {
            return runAssertions(this, () => {
                testIsInstance(actual, ctor);
                return () => `expected${ notFor(this) }to get instance of ${ ctor }, but received ${ actual }`;
            });
        },
        toHaveBeenCalledOnce(actual: Mock) {
            return runAssertions(this, () => {
                if (this.isNot) {
                    throw new Error([
                        "Negation of 'toHaveBeenCalledOnce' is ambiguous ",
                        "(do you mean 'not at all' or 'any number except 1'?)"
                    ].join(""));
                }
                expect(actual).toHaveBeenCalledTimes(1);
                return () => `Expected${ notFor(this) }to have been called once`;
            });
        },
        toHaveBeenCalledOnceWith(actual: Mock | jasmine.Spy, ...args: any[]) {
            return runAssertions(this, () => {
                expect(actual).toHaveBeenCalled();
                expect(actual).toHaveBeenCalledWith(...args);
                let allArgs: any[];
                // jasmine spies come from doing `spyOn(thing, "method")`
                // jest mocks come from `jest.fn()`
                if (isJasmineSpy(actual)) {
                    const spy = actual as jasmine.Spy;
                    allArgs = spy.calls.all().map(c => c.args);
                } else if (isJestMock(actual)) {
                    const mock = actual as Mock;
                    allArgs = mock.mock.calls;
                } else {
                    throw new Error("actual doesn't appear to be a spy or a mock?");
                }
                const matching = allArgs.filter(
                    a => {
                        try {
                            expect(a).toEqual(args);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    });
                assert(
                    matching.length === 1,
                    `Should have found exactly one matching call, but found ${ matching.length }`
                );
                return () => `Expected${ notFor(this) }to have been called once with ${ args }`;
            });

            function isJasmineSpy(a: any) {
                return a &&
                    a.calls &&
                    typeof a.calls.all === "function";
            }

            function isJestMock(a: any) {
                return a &&
                    a.mock &&
                    Array.isArray(a.mock.calls);
            }
        },
        async toBeCompleted(actual: Promise<any>) {
            return runAssertionsAsync(this, async () => {
                let
                    completed = false,
                    state = "pending";
                const msg = () => `expected${ notFor(this) }to complete promise (final state: ${ state })`;
                if (!actual.then) {
                    return fail("actual is not a promise");
                }
                actual.then(() => {
                    state = "resolved";
                    completed = true;
                }).catch(() => {
                    state = "rejected";
                    completed = true;
                });
                await sleep(50);
                if (completed && this.isNot) {
                    fail(msg());
                } else if (!completed && !this.isNot) {
                    fail(msg());
                }
            });
        },
        async toBeResolved(actual: Promise<any> | (() => Promise<any>), message?: string, timeout?: number) {
            return runAssertionsAsync(this, async () => {
                let resolved: Nullable<boolean> = null;
                if (typeof (actual) === "function") {
                    actual = actual();
                }
                timeout = timeout || 50;
                const msg = () =>
                    `expected${ notFor(this) }to resolve promise, but ${
                        (resolved === null ? "it never completed" : "it rejected")
                    }${ message ? "More info: " + message : "" }`;
                if (!actual.then) {
                    return fail("actual is not a promise");
                }
                actual.then(
                    () => resolved = true
                ).catch(
                    () => resolved = false
                );
                let slept = 0;
                while (resolved === null && slept < timeout) {
                    await sleep(50);
                    slept += 50;
                }
                if (resolved && this.isNot) {
                    fail(msg());
                } else if (!resolved && !this.isNot) {
                    fail(msg());
                }
            });
        },
        async toBeRejected(actual: Promise<any> | (() => Promise<any>), message?: string, timeout?: number) {
            return runAssertionsAsync(this, async () => {
                if (typeof (actual) === "function") {
                    actual = actual();
                }
                let rejected: Nullable<boolean> = null;
                timeout = timeout || 50;
                const msg = () => `expected${ notFor(this) }to reject promise, but ${
                    (rejected === null ? "it never completed" : "it resolved") }${
                    message ? `More info: ${ message }` : ""
                }`;
                actual.then(
                    () => rejected = false
                ).catch(
                    () => rejected = true
                );
                let slept = 0;
                while (rejected === null && slept < timeout) {
                    await sleep(50);
                    slept += 50;
                }
                if (rejected && this.isNot) {
                    fail(msg());
                } else if (!rejected && !this.isNot) {
                    fail(msg());
                }
            });
        },
        toExist(actual: any) {
            return runAssertions(this, () => {
                const msg = () => `Expected ${ actual }${ notFor(this) }to exist`;
                assert(actual !== null && actual !== undefined, msg);
                return msg;
            });
        },
        toBeDisabled(actual: HTMLInputElement | HTMLButtonElement) {
            return runAssertions(this, () => {
                const msg = () => `Expected ${ actual }${ notFor(this) }to be disabled`;
                assert(actual.disabled, msg);
                return msg;
            });
        },
        toHaveReceivedNoCallsAtAll(mockedObject: any) {
            return runAssertions(this, () => {
                const called = Object.getOwnPropertyNames(
                    Object.getPrototypeOf(mockedObject)
                ).reduce((acc: string[], cur: string) => {
                    const prop = mockedObject[cur];
                    if (typeof prop.mock === "undefined") {
                        return acc;
                    }
                    if (prop.mock.calls && prop.mock.calls.length) {
                        acc.push(cur);
                    }
                    return acc;
                }, []);
                const msg = () => `expected${ notFor(this) }to have received any calls, but got ${ called }`;
                assert(!called.length, msg);
                return msg;
            });
        },
        toHaveReceivedOnly(mockedObject: any,
                           ...calls: string[]) {

            return runAssertions(this, () => {
                const called = Object.getOwnPropertyNames(
                    Object.getPrototypeOf(mockedObject)
                ).reduce((acc: string[], cur: string) => {
                    const prop = mockedObject[cur];
                    if (typeof prop.mock === "undefined") {
                        return acc;
                    }
                    if (prop.mock.calls &&
                        prop.mock.calls.length &&
                        calls.indexOf(cur) === -1) {
                        acc.push(cur);
                    }
                    return acc;
                }, []);
                const msg = () => `expected${ notFor(this) }to have received any calls, but got ${ called }`;
                assert(!called.length, msg);
                return msg;
            });
        }
    });
});

export function stringLike(...parts: string[]) {
    const re = [".*"].concat(parts.join(".*")).concat([".*"]).join("");
    return expect.stringMatching(new RegExp(re));
}
