import fs from "fs";
import Mock = jest.Mock;
import "expect-more-jest";
import _isEqual from "lodash.isequal";
import CustomMatcherResult = jest.CustomMatcherResult;

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type Nullable<T> = (T | null);

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

      // collections
      toBeEquivalentTo<T>(other: T[]): void;

      toHaveKey(key: string): void;

      toHaveKeys(key1: string, ...keys: string[]): void;

      toAllMatch(fn: Condition): void;

      toContainElementLike(other: any): void;

      // DOM
      toHaveAttribute(attrib: string, expected?: string): void;

      // errors
      toThrowMatching(matcher: (e: string | Error) => boolean): void;
    }
  }
}
export type Condition = (item: any) => boolean;

export function assert(expr: boolean, failMessage: string | (() => string)) {
  if (!expr) {
    if (typeof failMessage === "function") {
      failMessage = failMessage();
    }
    throw new Error(failMessage);
  }
  return failMessage;
}

export interface IHasIsNot {
  isNot: boolean;
}

export function runAssertions(ctx: IHasIsNot, func: () => string | (() => string)): CustomMatcherResult {
  try {
    const message = func() || "";
    return {
      message: typeof message === "function" ? message : () => message,
      pass: true
    };
  } catch (e) {
    return {
      pass: false,
      message: () => resolveErrorMessage(e)
    };
  }
}

function resolveErrorMessage(e: unknown): string {
  const err = e as Error;
  return err.message || `${ e }`;
}


export async function runAssertionsAsync(ctx: IHasIsNot, func: () => Promise<() => string>) {
  try {
    const message = await func();
    return {
      message,
      pass: !ctx.isNot
    };
  } catch (e) {
    return {
      pass: false,
      message: () => resolveErrorMessage(e)
    };
  }
}


function testIsInstance(actual: any, ctor: any) {
  assert(actual !== undefined, "actual is undefined");
  assert(actual !== null, "actual is null");
  assert(
    actual instanceof ctor,
    `Expected instance of ${ Object.prototype.toString.call(ctor) } but got ${ actual }`
  );
}

export function notFor(self: any) {
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
    return keys.reduce(
      (acc, cur) =>
        acc && objectKeys.indexOf(cur) > -1,
      true
    );
  })(), msg);
  return msg;
}

export function prettyPrint(obj: object | any[]) {
  return JSON.stringify(obj, null, 2);
}

function intersect<T>(left: T[], right: T[]): T[] {
  const result: T[] = [];
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

function isEmptyOrWhitespace(value: string | null | undefined) {
  // noinspection SuspiciousTypeOfGuard
  return value === null ||
         value === undefined ||
         (typeof value === "string" &&
          (value || "").toString().length === 0
         );
}

beforeAll(() => {
  expect.extend({
    toBeEmptyOrWhitespace(actual: string | null | undefined) {
      return runAssertions(this, () => {
        assert(isEmptyOrWhitespace(actual), `Expected '${ actual }' to be empty or whitespace string`);
        return `Expected '${ actual }' not to be empty or whitespace string`;
      });
    },
    toHaveAttribute(actual: HTMLElement, attrib: string, expected: string) {
      return runAssertions(this, () => {
        assert(actual instanceof HTMLElement, `actual must be an html element`);
        const checkValue = expected !== undefined;
        if (checkValue) {
          assert(
            actual.getAttribute(attrib) === expected,
            `Expected to find attribute ${ attrib } with value ${ expected }`
          )
        } else {
          assert(
            actual.getAttribute(attrib) !== null,
            `Expected to find attribute '${ attrib }'`
          );
        }
        return checkValue
          ? `Expected not to find attribute '${ attrib }' with value '${ expected }'`
          : `Expected not to find attribute '${ attrib }'`;
      });
    },
    toContainElementLike(actual: any[], other: any) {
      return runAssertions(this, () => {
        assert(Array.isArray(actual), `actual must be an array`);
        const search = expect.objectContaining(other);
        const found = actual.find(el => this.equals(el, search));
        assert(found, `Found no match for\n${ prettyPrint(other) }`);
        return `Expected not to find anything matching\n${ prettyPrint(other) }\nbut found:\n${ prettyPrint(found) }`;
      });
    },
    toAllMatch(actual: any, condition: Condition) {
      return runAssertions(this, () => {
        const die = (m: string) => {
          throw new Error(`toAllMatch: ${ m }`);
        };
        if (!Array.isArray(actual)) {
          return die("Actual must be an array");
        }
        if (actual.length === 0) {
          return die("Actual should not be empty");
        }
        if (!condition) {
          return die("condition not set");
        }
        const matches = actual.filter(condition);
        assert(
          matches.length === actual.length,
          `Some elements don't match the provided condition:\n\n${
            matches.map(m => prettyPrint(m)).join("\n")
          }`
        );
        return "Expected to find mismatches, but didn't";
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
              acc.push(`expected ${ cur } to be \n` +
                       `${ prettyPrint(expected[cur]) }\nbut got\n${ prettyPrint(actual[cur]) }`);
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
          actual, [ expected ], msg
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
          msg
        );
        assert(actual.reduce(
          (acc, cur) =>
            acc && expected.indexOf(cur) > -1,
          true
        ), msg);
        return msg;
      });
    },
    toBeFile(actual: string) {
      return runAssertions(this, () => {
        const msg = () => `expected ${ actual } ${ notFor(this) }to be a file`;
        assert(!!actual, msg);
        assert((() => {
          if (!fs.existsSync(actual)) {
            return false;
          }
          return fs.statSync(actual).isFile();
        })(), msg);
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
    toBePromiseLike(actual: any) {
      return runAssertions(this, () => {
        const err = (moreInfo?: string) => {
          return `expected something${ notFor(this) }promise-like, but got ${
            actual
          }${ moreInfo ? "\n\t(" : "" }${ moreInfo }${ moreInfo ? ")" : "" }`;
        };

        assert(actual, err);
        assert(typeof actual === "object", err);
        assert(
          actual.then && typeof actual.then === "function",
          "should have a then function"
        );
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
        expect(actual).toHaveBeenCalledTimes(1);
        return () => `expected${ notFor(this) }to have been called once`;
      });
    },
    toHaveBeenCalledOnceWithNoArgs(actual: Mock | jasmine.Spy) {
      return runAssertions(this, () => {
        const receivedArgs = fetchSpyOrMockArgs(actual);
        const matching = receivedArgs.filter(r => r.length === 0);
        assert(
          matching.length === 1,
          `expected${ notFor(this) }to find exactly 1 call with no arguments, but found ${ matching.length }`
        );
        return () => `expected${ notFor(this) }to have found exactly 1 call with no arguments`;
      });
    },
    toHaveBeenCalledWith(actual: Mock | jasmine.Spy, ...args: any[]) {
      return runAssertions(this, () => {
        const receivedArgs = fetchSpyOrMockArgs(actual);
        const matching = receivedArgs.filter(
          received => {
            try {
              expect(received.length)
                .toEqual(args.length);
              received.forEach((r: any, idx: number) => {
                const test = args[idx];
                if (typeof r === "string" && test instanceof RegExp) {
                  expect(r).toMatch(test);
                } else {
                  expect(r).toEqual(test);
                }
              });
              return true;
            } catch (e) {
              return false;
            }
          });
        assert(
          receivedArgs.length > 0,
          `expected${ notFor(this) }to have been called, but it was not\n${ debugReceived(args, receivedArgs) }`
        );
        assert(
          matching.length > 0,
          `expected${ notFor(this) }to have received at least one matching call, but none were found\n${ debugReceived(
            args,
            receivedArgs
          ) }`
        );
        return () => `expected${ notFor(this) }to have been called with ${ args }\n${ debugReceived(
          args,
          receivedArgs
        ) }`;
      });
    },
    toHaveBeenCalledOnceWith(actual: Mock | jasmine.Spy, ...args: any[]) {
      return runAssertions(this, () => {
        if (args.length === 0) {
          // tslint:disable-next-line:no-console
          console.warn(`
'toHaveBeenCalledOnceWith' was invoked with no arguments.
If this is by design, rather use 'toHaveBeenCalledOnceWithNoArgs()'.`.trim()
          );
        }
        const receivedArgs = fetchSpyOrMockArgs(actual);
        const matching = receivedArgs.filter(
          received => {
            try {
              expect(received.length)
                .toEqual(args.length);
              received.forEach((r: any, idx: number) => {
                const test = args[idx];
                if (typeof r === "string" && test instanceof RegExp) {
                  expect(r).toMatch(test);
                } else {
                  expect(r).toEqual(test);
                }
              });
              return true;
            } catch (e) {
              return false;
            }
          });
        assert(
          matching.length === 1,
          `expected${ notFor(this) }to have found exactly one matching call, but found ${ matching.length }\n${ debugReceived(
            args,
            receivedArgs
          ) }`
        );
        return () => `expected${ notFor(this) }to have been called once with ${ args }\n${ debugReceived(
          args,
          receivedArgs
        ) }`;
      });
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
        return msg;
      });
    },
    async toBeResolved(actual: Promise<any> | (() => Promise<any>), message?: string, timeout?: number) {
      return runAssertionsAsync(this, async () => {
        let state = "pending";
        const msg = () =>
          `expected${ notFor(this) }to complete promise (final state: ${ state })${ (message ? `More info: ${ message }` : "") }`;
        if (typeof (actual) === "function") {
          actual = actual();
        }
        if (!actual.then) {
          return fail("actual is not a promise");
        }
        actual.then(() => {
          state = "resolved";
        }).catch(() => {
          state = "rejected";
        });
        timeout = timeout || 50;
        let slept = 0;
        while (state === "pending" && slept < timeout) {
          await sleep(50);
          slept += 50;
        }
        if (state === "resolved") {
          return msg;
        }
        throw new Error(msg());
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
        return msg;
      });
    },
    toExist(actual: any) {
      return runAssertions(this, () => {
        const msg = () => `expected ${ actual }${ notFor(this) }to exist`;
        assert(actual !== null && actual !== undefined, msg);
        return msg;
      });
    },
    toBeError(actual: Error, match?: string | RegExp) {
      return runAssertions(this, () => {
        let meta = "";
        if (match) {
          if (match instanceof RegExp) {
            meta = ` to match ${ match }`
          } else {
            meta = ` with message ${ match }`
          }
        }
        const msg = () => `Expected ${ actual }${ notFor(this) } to be an error${ meta }`;
        // noinspection SuspiciousTypeOfGuard
        assert(actual instanceof Error, msg);
        if (match) {
          if (match instanceof RegExp) {
            assert(!!actual.message.match(match), msg);
          } else {
            assert(actual.message === match, msg);
          }
        }
        return msg;
      });
    },
    toThrowMatching(actual: () => void, matcher: (e: string | Error) => boolean) {
      return runAssertions(this, () => {
        try {
          actual();
          return () => `Expected function to throw an error, but none was thrown`;
        } catch (e) {
          const msg = () => `Expected function to throw error matching ${ matcher }\ninstead, it threw: ${ e }`;
          assert(matcher(e as Error), msg);
          return msg;
        }
      });
    }
  });
});

/**
 * Wrapper around lodash.isequal, which also accepts a debug
 * parameter -- when set true, failed equality checks will be
 * dumped to the console
 * @param left
 * @param right
 * @param debug
 */
function areEqual(
  left: any,
  right: any,
  debug?: boolean) {
  const result = _isEqual(left, right);
  if (!result && debug) {
    // tslint:disable-next-line:no-console
    console.debug(`areEqual mismatch:\n` +
                  `left:\n${ prettyPrint(left) }\n` +
                  `right:${ prettyPrint(right) }`);
  }
  return result;
}

function isJasmineSpy(a: any) {
  return a &&
         a.calls &&
         typeof a.calls.all === "function";
}

export function isJestMock(a: any) {
  return a &&
         a.mock &&
         Array.isArray(a.mock.calls);
}

// NB: this is useful from other modules; leave it exported!
export function fetchSpyOrMockArgs(subject: Mock | jasmine.Spy | Function): any[] {
  // jasmine spies come from doing `spyOn(thing, "method")`
  // jest mocks come from `jest.fn()`
  if (isJasmineSpy(subject)) {
    const spy = subject as jasmine.Spy;
    return spy.calls.all().map(c => c.args);
  } else if (isJestMock(subject)) {
    const mock = subject as Mock;
    return mock.mock.calls;
  } else {
    throw new Error(`${ subject } doesn't appear to be a jasmine spy or a jest mock?`);
  }
}

function debugReceived(
  expected: any[],
  received: any[][]
): string {
  const result = [] as string[];
  for (const r of received) {
    result.push(r.map(stringify).join(","));
  }
  const parts = [
    ` expected call:\n (`,
    expected.map(stringify).join(","),
    `)\n`
  ];
  if (received.length) {
    parts.push.apply(parts, [
      ` received call${ received.length === 1 ? "" : "s" }:\n (`,
      result.join(`)\n (`),
      ")"
    ]);
  } else {
    parts.push(` received calls: none`);
  }
  return parts.join("");
}

const argPrinters = [
  nullPrinter,
  undefinedPrinter,
  numericPrinter,
  stringPrinter,
  objectPrinter,
  fallbackPrinter
];

type Optional<T> = T | undefined;

function nullPrinter(value: any): Optional<string> {
  if (value === null) {
    return "null";
  }
}

function undefinedPrinter(value: any): Optional<string> {
  if (value === undefined) {
    return "undefined";
  }
}

function numericPrinter(value: any): Optional<string> {
  if (typeof value === typeof 1) {
    return `${ value }`;
  }
}

function stringPrinter(value: any): Optional<string> {
  if (typeof value === typeof "") {
    return `"${ value.replace(/"/, "\\") }"`;
  }
}

function objectPrinter(value: any): Optional<string> {
  try {
    return prettyPrint(value);
  } catch (e) {
    return `${ value }`;
  }
}

function fallbackPrinter(value: any): string {
  return `${ value }`;
}

export function stringify(arg: any): string {
  for (const printer of argPrinters) {
    const potentialResult = printer(arg);
    if (potentialResult !== undefined) {
      return potentialResult;
    }
  }
  throw new Error(`No arg printer installed for ${ arg }`);
}
