import "../src/index";
import * as faker from "faker";
import { Sandbox } from "filesystem-sandbox";

describe(`expect-even-more-jest`, () => {
    it(`should import expect-more-jest`, async () => {
        // Arrange
        // Act
        expect(() => {
            // intentionally empty
        }).toBeFunction();
        // Assert
    });

    describe(`values`, () => {
        describe(`toBeA / toBeAn`, () => {
            it(`should not throw when the value is of the requested type`, async () => {
                // Arrange
                // Act
                expect(() => expect(new MooCow())
                    .toBeA(MooCow)
                ).not.toThrow();
                expect(() => expect(new ExcitedMooCow())
                    .toBeAn(ExcitedMooCow)
                ).not.toThrow();
                // Assert
            });

            it(`should throw when the value is not of the required prototype`, async () => {
                // Arrange
                // Act
                expect(() => expect(new MooCow())
                    .toBeAn(ExcitedMooCow)
                ).toThrow();
                // Assert
            });

            class MooCow {
            }

            // tslint:disable-next-line:max-classes-per-file
            class ExcitedMooCow extends MooCow {
            }
        });

        describe(`toExist`, () => {
            it(`should pass for any value which is not null or undefined`, async () => {
                // Arrange
                // Act
                expect("foo")
                    .toExist();
                expect(1)
                    .toExist();
                expect(0)
                    .toExist();
                // Assert
            });

            it(`should fail when the value is not null/undefined & negaged`, async () => {
                // Arrange
                // Act
                expect(() => expect("foo").not.toExist())
                    .toThrow(/not to exist/)
                // Assert
            });

            it(`should throw for null`, async () => {
                // Arrange
                // Act
                expect(() => expect(null).toExist())
                    .toThrow(/(?!not) to exist/);
                // Assert
            });

            it(`should throw for undefined`, async () => {
                // Arrange
                // Act
                expect(() => expect(undefined).toExist())
                    .toThrow(/(?!not) to exist/);
                // Assert
            });
        });

        describe(`toBeConstructor`, () => {
            it(`should not throw for a constructable`, async () => {
                // Arrange
                // Act
                expect(() => expect(MooCakes).toBeConstructor())
                    .not.toThrow();
                // Assert
            });

            it(`should throw for a non constructable`, async () => {
                // Arrange
                // Act
                expect(() => expect({}).toBeConstructor())
                    .toThrow();
                // Assert
            });

            // tslint:disable-next-line:max-classes-per-file
            class MooCakes {
            }
        });

        describe(`toIntersectionEqual`, () => {
            it(`should throw if actual either value is null or undefined`, async () => {
                // Arrange
                const
                    obj = {},
                    values = [undefined, null];
                // Act
                expect(() => expect(obj)
                    .toIntersectionEqual(faker.random.arrayElement(values) as any)
                ).toThrow();
                expect(() => expect(faker.random.arrayElement(values) as any)
                    .toIntersectionEqual(obj)
                ).toThrow();
                // Assert
            });

            it(`should not throw if there are some matching props`, async () => {
                // Arrange
                const
                    actual = { foo: 1, bar: 2 },
                    other = { foo: 1, quux: 3 };
                // Act
                expect(() => expect(actual).toIntersectionEqual(other))
                    .not.toThrow();
                // Assert
            });

            it(`should throw if there are no props in common`, async () => {
                // Arrange
                const
                    actual = { foo: 1 },
                    other = { bar: 1 };
                // Act
                expect(() => expect(actual).toIntersectionEqual(other))
                    .toThrow();
                // Assert
            });

            it(`should throw if there are common props which are not equal`, async () => {
                // Arrange
                const
                    actual = { foo: 1, bar: 2 },
                    other = { quux: 1, bar: 1 };
                // Act
                expect(() => expect(actual).toIntersectionEqual(other))
                    .toThrow();
                // Assert
            });
        });
    });

    describe(`mocks and spies`, () => {
        describe(`toHaveBeenCalledOnce`, () => {
            it(`should not throw when a jasmine spy or jest mock has been called once`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("jasmineSpy"),
                    mock = jest.fn();
                // Act
                spy();
                mock();
                expect(
                    () => expect(spy).toHaveBeenCalledOnce()
                ).not.toThrow()
                expect(
                    () => expect(mock).toHaveBeenCalledOnce()
                ).not.toThrow()
                // Assert
            });
            it(`should throw if a jasmine spy or jest mock was not called at all`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("jasmineSpy"),
                    mock = jest.fn();
                // Act
                expect(
                    () => expect(spy).toHaveBeenCalledOnce()
                ).toThrow()
                expect(
                    () => expect(mock).toHaveBeenCalledOnce()
                ).toThrow()
                // Assert
            });
            it(`should throw if a jasmine spy or jest mock was called > once`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("jasmineSpy"),
                    mock = jest.fn(),
                    howMany = faker.random.number({ min: 2, max: 10 });
                for (let i = 0; i < howMany; i++) {
                    spy();
                    mock();
                }
                // Act
                expect(
                    () => expect(spy).toHaveBeenCalledOnce()
                ).toThrow()
                expect(
                    () => expect(mock).toHaveBeenCalledOnce()
                ).toThrow()
                // Assert
            });
        });

        describe(`toHaveBeenCalledOnceWith`, () => {
            it(`should throw if the spy or mock was not called at all`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("jasmineSpy"),
                    mock = jest.fn();
                // Act
                expect(() => expect(spy).toHaveBeenCalledOnceWith(1))
                    .toThrow();
                expect(() => expect(mock).toHaveBeenCalledOnceWith(1))
                    .toThrow();
                // Assert
            });
            it(`should throw if the spy or mock was called, but not with the required args`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("jasmineSpy"),
                    mock = jest.fn();
                spy(1, 2, 3);
                mock("a", "b", "c");
                // Act
                expect(() => expect(spy).toHaveBeenCalledOnceWith(4, 5, 6))
                    .toThrow();
                expect(() => expect(mock).toHaveBeenCalledOnceWith("e", "f", "g"))
                    .toThrow();
                // Assert
            });

            it(`should not throw if there was a single matching call`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("jasmineSpy"),
                    mock = jest.fn();
                spy(1, 2, 3);
                spy(4, 5, 6);
                mock("e", "f", "g");
                mock("a", "b", "c");
                // Act
                expect(() => expect(spy).toHaveBeenCalledOnceWith(4, 5, 6))
                    .not.toThrow();
                expect(() => expect(mock).toHaveBeenCalledOnceWith("e", "f", "g"))
                    .not.toThrow();
                // Assert
            });

            it(`should throw if there was > 1 matching call`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("jasmineSpy"),
                    mock = jest.fn();
                spy(4, 5, 6);
                spy(1, 2, 3);
                spy(4, 5, 6);
                mock("e", "f", "g");
                mock("a", "b", "c");
                mock("e", "f", "g");
                // Act
                expect(() => expect(spy).toHaveBeenCalledOnceWith(4, 5, 6))
                    .toThrow();
                expect(() => expect(mock).toHaveBeenCalledOnceWith("e", "f", "g"))
                    .toThrow();
                // Assert
            });

            it(`should do regex matching if it encounters a positionally matched string arg with regex expectation`,
                async () => {
                    // Arrange
                    const
                        spy = jasmine.createSpy("someSpy"),
                        mock = jest.fn(),
                        message = "Hello there! This is an error, wot!";
                    // Act
                    spy(message);
                    mock(message);
                    // Assert
                    expect(spy)
                        .toHaveBeenCalledOnceWith(/this is an error/i);
                    expect(mock)
                        .toHaveBeenCalledOnceWith(/this is an error/i);
                });
        });
    });

    describe(`promises`, () => {
        describe(`toBePromiseLike`, () => {
            it(`should pass for something which is considered to be a promise`, async () => {
                // Arrange
                // Act
                expect(new Promise<any>(() => {
                    // intentionally left blank
                })).toBePromiseLike();
                expect({
                    then: () => {
                        // intentionally left blank
                    }
                }).toBePromiseLike();
                // Assert
            });
            it(`should fail for something which is not a promise (ie, a value)`, async () => {
                // Arrange
                // Act
                expect(1).not.toBePromiseLike();
                expect("a").not.toBePromiseLike();
                expect({}).not.toBePromiseLike();
                expect(false).not.toBePromiseLike();
                expect([]).not.toBePromiseLike();
                // Assert
            });
        });

        // difficult to test, so I have to do positive cases from both sides :/
        describe(`toBeCompleted`, () => {
            it(`should not throw when negated if the promise hasn't been resolved or rejected`, async () => {
                // Arrange
                const promise = new Promise(() => {
                    // intentionally left blank
                });
                // Act
                await expect(promise).not.toBeCompleted();
                // Assert
            });
            it(`should not throw when the promise was resolved`, async () => {
                // Arrange
                // Act
                await expect(Promise.resolve()).toBeCompleted();
                // Assert
            });
            it(`should not throw when the promise was rejected`, async () => {
                // Arrange
                // Act
                await expect(Promise.reject()).toBeCompleted();
                // Assert
            });
        });

        describe(`toBeResolved`, () => {
            it(`should not throw when negated if the promise hasn't been resolved or rejected`, async () => {
                // Arrange
                const unresolved = new Promise(() => {
                    // intentionally left blank
                });
                const rejected = new Promise((resolve, reject) => {
                    setTimeout(reject, 20);
                });
                // Act
                await expect(rejected).not.toBeResolved();
                await expect(unresolved).not.toBeResolved();
                // Assert
            });
            it(`should not throw when the promise was resolved`, async () => {
                // Arrange
                // Act
                await expect(Promise.resolve()).toBeResolved();
                // Assert
            });
            it(`should not throw when negated & the promise was rejected`, async () => {
                // Arrange
                // Act
                await expect(Promise.reject()).not.toBeResolved();
                // Assert
            });
        });

        describe(`toBeRejected`, () => {
            it(`should not throw when negated on uncompleted promise`, async () => {
                // Arrange
                const unresolved = new Promise(() => {
                    // intentionally left blank
                });
                // Act
                await expect(unresolved).not.toBeRejected();
                // Assert
            });
            it(`should not throw when negated on resolved promise`, async () => {
                // Arrange
                const resolved = Promise.resolve();
                // Act
                await expect(resolved).not.toBeRejected();
                // Assert
            });
            it(`should not throw when positive on rejected promise`, async () => {
                // Arrange
                const rejected = Promise.reject();
                // Act
                await expect(rejected).toBeRejected();
                // Assert
            });
        });
    });

    describe(`file system`, () => {
        describe(`toBeFile`, () => {
            it(`should test for existence of files`, async () => {
                // Arrange
                const
                    sandbox = await Sandbox.create(),
                    filename = faker.random.alphaNumeric(10),
                    another = faker.random.alphaNumeric(10),
                    folder = faker.random.alphaNumeric(10);
                await sandbox.writeFile(filename, faker.random.words());
                await sandbox.mkdir(folder);
                // Act
                expect(sandbox.fullPathFor(filename))
                    .toBeFile();
                expect(sandbox.fullPathFor(another))
                    .not.toBeFile();
                expect(sandbox.fullPathFor(folder))
                    .not.toBeFile();
                // Assert
            });
        });

        describe(`toBeFolder`, () => {
            it(`should test for existence of folders`, async () => {
                // Arrange
                const
                    sandbox = await Sandbox.create(),
                    filename = faker.random.alphaNumeric(10),
                    another = faker.random.alphaNumeric(10),
                    folder = faker.random.alphaNumeric(10);
                await sandbox.writeFile(filename, faker.random.words());
                await sandbox.mkdir(folder);
                // Act
                expect(sandbox.fullPathFor(filename))
                    .not.toBeFolder();
                expect(sandbox.fullPathFor(another))
                    .not.toBeFolder();
                expect(sandbox.fullPathFor(folder))
                    .toBeFolder();
                // Assert
            });
        });
    });

    describe(`collections`, () => {
        describe(`toBeEquivalentTo`, () => {
            it(`should not throw when same collections just out of order`, async () => {
                // Arrange
                const
                    a = [1, 2, 3],
                    b = [3, 2, 1],
                    c = [1, 3, 2];
                // Act
                expect(a)
                    .toBeEquivalentTo(b);
                expect(a)
                    .toBeEquivalentTo(c);
                expect(b)
                    .toBeEquivalentTo(c);
                // Assert
            });

            it(`should fail on totally different collections`, async () => {
                // Arrange
                const
                    a = [1, 2, 3],
                    shorter = [1, 2],
                    longer = [1, 2, 3, 4],
                    different = [2, 5, 6];
                // Act
                expect(a)
                    .not.toBeEquivalentTo(shorter);
                expect(a)
                    .not.toBeEquivalentTo(longer);
                expect(a)
                    .not.toBeEquivalentTo(different);
                // Assert
            });
        });
        describe(`toHaveKey`, () => {
            it(`should fail when object does not exist`, async () => {
                // Arrange
                const obj = faker.random.arrayElement([null, undefined]);
                // Act
                expect(() =>
                    expect(obj)
                        .toHaveKey(faker.random.alphaNumeric(1))
                ).toThrow();
                // Assert
            });

            it(`should pass when object has key`, async () => {
                // Arrange
                const
                    obj = {} as any,
                    key = faker.random.alphaNumeric(10),
                    value = faker.random.alphaNumeric(10);
                obj[key] = value;
                // Act
                expect(obj)
                    .toHaveKey(key);
                // Assert
            });

            it(`should fail when object does not have key`, async () => {
                // Arrange
                const
                    obj = {} as any,
                    key = faker.random.alphaNumeric(10),
                    otherKey = faker.random.alphaNumeric(10),
                    value = faker.random.alphaNumeric(10);
                obj[key] = value;
                // Act
                expect(() => {
                    expect(obj)
                        .toHaveKey(otherKey)
                }).toThrow();
                expect(obj)
                    .not.toHaveKey(otherKey);
                // Assert
            });
        });
        describe(`toHaveKeys`, () => {
            it(`should fail when object does not exist`, async () => {
                // Arrange
                const obj = faker.random.arrayElement([null, undefined]);
                // Act
                expect(() =>
                    expect(obj)
                        .toHaveKeys(faker.random.alphaNumeric(1))
                ).toThrow();
                // Assert
            });

            it(`should pass when object has key`, async () => {
                // Arrange
                const
                    obj = {} as any,
                    key = faker.random.alphaNumeric(10),
                    value = faker.random.alphaNumeric(10);
                obj[key] = value;
                // Act
                expect(obj)
                    .toHaveKeys(key);
                // Assert
            });

            it(`should fail when object does not have key`, async () => {
                // Arrange
                const
                    obj = {} as any,
                    key = faker.random.alphaNumeric(10),
                    otherKey = faker.random.alphaNumeric(10),
                    value = faker.random.alphaNumeric(10);
                obj[key] = value;
                // Act
                expect(() => {
                    expect(obj)
                        .toHaveKeys(otherKey)
                }).toThrow();
                expect(obj)
                    .not.toHaveKeys(otherKey);
                // Assert
            });

            it(`should pass when all keys found`, async () => {
                // Arrange
                const
                    obj = {} as any,
                    key = faker.random.alphaNumeric(10),
                    otherKey = faker.random.alphaNumeric(10),
                    value = faker.random.alphaNumeric(10);
                obj[key] = value;
                obj[otherKey] = value;
                // Act
                expect(obj)
                    .toHaveKeys(key, otherKey);
                // Assert
            });
        });

        describe(`toAllMatch`, () => {
            it(`should fail if collection is empty`, async () => {
                // Arrange
                const a: number[] = [];
                // Act
                expect(() => expect(a).toAllMatch(i => i > 0))
                    .toThrow();
                // Assert
            });
            it(`should fail if even one element does not match`, async () => {
                // Arrange
                const
                    b = [4, 5, 6];
                // Act
                expect(b)
                    .not.toAllMatch(i => i < 6);
                // Assert
            });
            it(`should pass if all elements match`, async () => {
                // Arrange
                const
                    a = [1, 2, 3];
                // Act
                expect(a)
                    .toAllMatch(i => i < 4);
                // Assert
            });
        });

        describe(`toContainElementLike`, () => {
            it(`should find the single element`, async () => {
                // Arrange
                const array = [{ foo: "foo", bar: "bar" }];
                // Act
                expect(array)
                    .toContainElementLike({ foo: "foo" });
                // Assert
            });

            it(`should throw when it can't find a match`, async () => {
                // Arrange
                const array = [{ foo: "foo", bar: "bar" }];
                // Act
                expect(() =>
                    expect(array)
                        .toContainElementLike({ foo: "foo1" })
                ).toThrow();
                // Assert
            });

            it(`should not throw when negated and it can't find a match`, async () => {
                // Arrange
                const array = [{ foo: "foo", bar: "bar" }];
                // Act
                expect(() =>
                    expect(array)
                        .not.toContainElementLike({ foo: "foo1" })
                ).not.toThrow();
                // Assert
            });

            it(`should throw when negated and can find the single element`, async () => {
                    // Arrange
                    const array = [{ foo: "foo", bar: "bar" }];
                    // Act
                    expect(() => {
                        expect(array)
                            .not.toContainElementLike({ foo: "foo" });
                    }).toThrow();
                    // Assert
                }
            );
        });
    });

    describe(`toBeError`, () => {
        it(`should match an error with string message`, async () => {
            // Arrange
            const
                message = "le error",
                error = new Error(message);
            // Act
            expect(error)
                .toBeError(message);
            // Assert
        });

        it(`should match an error with regex for message`, async () => {
            // Arrange
            const
                message = "le Error",
                error = new Error(message);
            // Act
            expect(error)
                .toBeError(/err/i);
            // Assert
        });

        it(`should not match !error`, async () => {
            // Arrange
            const notAnError = { message: "not an error" };
            // Act
            expect(notAnError)
                .not.toBeError();
            expect(notAnError)
                .not.toBeError(/error/);
            // Assert
        });
        it(`should not match error with incorrect message`, async () => {
            // Arrange
            const
                message = "le Error",
                error = new Error(message);
            // Act
            expect(error)
                .not.toBeError("le error");
            // Assert
        });
        it(`should not match error with incorrect regex`, async () => {
            // Arrange
            const
                message = "le Error",
                error = new Error(message);
            // Act
            expect(error)
                .not.toBeError(/le error/);
            // Assert
        });
    });
});
