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
            describe(`when the value is of the requested type`, () => {
                it(`should pass`, async () => {
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
            });

            describe(`when the value is not of the requested type`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    // Act
                    expect(() => expect(new MooCow())
                        .toBeAn(ExcitedMooCow)
                    ).toThrow();
                    // Assert
                });
            });

            class MooCow {
            }

            // tslint:disable-next-line:max-classes-per-file
            class ExcitedMooCow extends MooCow {
            }
        });

        describe(`toExist`, () => {
            describe(`given any non-null, defined value`, () => {
                it(`should pass`, async () => {
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
            });

            describe(`when the value is not null / undefined`, () => {
                describe(`and assertion is negated`, () => {
                    it(`should fail`, async () => {
                        // Arrange
                        // Act
                        expect(() => expect("foo").not.toExist())
                            .toThrow(/not to exist/)
                        // Assert
                    });

                });
            });
            describe(`given null`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    // Act
                    expect(() => expect(null).toExist())
                        .toThrow(/(?!not) to exist/);
                    // Assert
                });
            });

            describe(`given undefined`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    // Act
                    expect(() => expect(undefined).toExist())
                        .toThrow(/(?!not) to exist/);
                    // Assert
                });
            });
        });

        describe(`toBeConstructor`, () => {
            describe(`given a constructable`, () => {
                it(`should pass`, async () => {
                    // Arrange
                    // Act
                    expect(() => expect(MooCakes).toBeConstructor())
                        .not.toThrow();
                    // Assert
                });
                describe(`when negated`, () => {
                    it(`should fail`, async () => {
                        // Arrange
                        // Act
                        expect(() => expect(MooCakes).not.toBeConstructor())
                            .toThrow();
                        // Assert
                    });
                });
            });

            describe(`given a non-constructable`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    // Act
                    expect(() => expect({}).toBeConstructor())
                        .toThrow();
                    // Assert
                });
                describe(`when negated`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        // Act
                        expect(() => expect({}).not.toBeConstructor())
                            .not.toThrow();
                        // Assert
                    });
                });
            });

            // tslint:disable-next-line:max-classes-per-file
            class MooCakes {
            }
        });

        describe(`toIntersectionEqual`, () => {
            describe(`when the value is null`, () => {
                it(`should throw if actual either value is null or undefined`, async () => {
                    // Arrange
                    const
                        obj = {},
                        value = null;
                    // Act
                    expect(() => expect(obj)
                        .toIntersectionEqual(value as any)
                    ).toThrow();
                    expect(() => expect(value as any)
                        .toIntersectionEqual(obj)
                    ).toThrow();
                    // Assert
                });
            });

            describe(`when the value is undefined`, () => {
                it(`should throw`, async () => {
                    // Arrange
                    const
                        obj = {},
                        value = undefined;
                    // Act
                    expect(() => expect(obj)
                        .toIntersectionEqual(value as any)
                    ).toThrow();
                    expect(() => expect(value as any)
                        .toIntersectionEqual(obj)
                    ).toThrow();
                    // Assert
                });
            });

            describe(`when some matching props`, () => {
                it(`should pass`, async () => {
                    // Arrange
                    const
                        actual = { foo: 1, bar: 2 },
                        other = { foo: 1, quux: 3 };
                    // Act
                    expect(() => expect(actual).toIntersectionEqual(other))
                        .not.toThrow();
                    // Assert
                });

                describe(`and negated`, () => {
                    it(`should fail`, async () => {
                        // Arrange
                        const
                            actual = { foo: 1, bar: 2 },
                            other = { foo: 1, quux: 3 };
                        // Act
                        expect(() => expect(actual).not.toIntersectionEqual(other))
                            .toThrow();
                        // Assert
                    });
                });
            });

            describe(`when no props in common`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    const
                        actual = { foo: 1 },
                        other = { bar: 1 };
                    // Act
                    expect(() => expect(actual).toIntersectionEqual(other))
                        .toThrow();
                    // Assert
                });

                describe(`and negated`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        const
                            actual = { foo: 1 },
                            other = { bar: 1 };
                        // Act
                        expect(() => expect(actual).not.toIntersectionEqual(other))
                            .not.toThrow();
                        // Assert
                    });
                });
            });

            describe(`when common props aren't equal`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    const
                        actual = { foo: 1, bar: 2 },
                        other = { quux: 1, bar: 1 };
                    // Act
                    expect(() => expect(actual).toIntersectionEqual(other))
                        .toThrow();
                    // Assert
                });

                describe(`and negated`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        const
                            actual = { foo: 1, bar: 2 },
                            other = { quux: 1, bar: 1 };
                        // Act
                        expect(() => expect(actual).not.toIntersectionEqual(other))
                            .not.toThrow();
                        // Assert
                    });
                });
            });
        });

        describe(`toBeEmptyOrWhitespace`, () => {
            [
                "",
                null,
                undefined
            ].forEach(testCase => {
                describe(`given '${ testCase }'`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        // Act
                        expect(() =>
                            expect(testCase)
                                .toBeEmptyOrWhitespace()
                        ).not.toThrow();
                        // Assert
                    });
                    describe(`and negated`, () => {
                        it(`should fail`, async () => {
                            // Arrange
                            // Act
                            expect(() =>
                                expect(testCase)
                                    .not.toBeEmptyOrWhitespace()
                            ).toThrow();
                            // Assert
                        });
                    });
                });
            });
        });
    });

    describe(`mocks and spies`, () => {
        describe(`toHaveBeenCalledOnce`, () => {
            describe(`when jest mock has been called once`, () => {
                it(`should pass`, async () => {
                    // Arrange
                    const
                        mock = jest.fn();
                    // Act
                    mock();
                    expect(
                        () => expect(mock).toHaveBeenCalledOnce()
                    ).not.toThrow()
                    // Assert
                });

                describe(`and negated`, () => {
                    it(`should fail`, async () => {
                        // Arrange
                        const
                            mock = jest.fn();
                        // Act
                        mock();
                        expect(
                            () => expect(mock).not.toHaveBeenCalledOnce()
                        ).toThrow()
                        // Assert
                    });
                });
            });
            describe(`when jasmine spy has been called once`, () => {
                it(`should pass`, async () => {
                    // Arrange
                    const
                        spy = jasmine.createSpy("jasmineSpy");
                    // Act
                    spy();
                    expect(
                        () => expect(spy).toHaveBeenCalledOnce()
                    ).not.toThrow()
                    // Assert
                });
                describe(`and negated`, () => {
                    it(`should fail`, async () => {
                        // Arrange
                        const
                            spy = jasmine.createSpy("jasmineSpy");
                        // Act
                        spy();
                        expect(
                            () => expect(spy).not.toHaveBeenCalledOnce()
                        ).toThrow()
                        // Assert
                    });
                });
            });
            describe(`when jest mock has not been called at all`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    const
                        mock = jest.fn();
                    // Act
                    expect(
                        () => expect(mock).toHaveBeenCalledOnce()
                    ).toThrow()
                    // Assert
                });

                describe(`and negated`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        const
                            mock = jest.fn();
                        // Act
                        expect(
                            () => expect(mock).not.toHaveBeenCalledOnce()
                        ).not.toThrow()
                        // Assert
                    });
                });
            });
            describe(`when jasmine spy has not been called at all`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    const
                        spy = jasmine.createSpy("jasmineSpy");
                    // Act
                    expect(
                        () => expect(spy).toHaveBeenCalledOnce()
                    ).toThrow()
                    // Assert
                });
                describe(`and negated`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        const
                            spy = jasmine.createSpy("jasmineSpy");
                        // Act
                        expect(
                            () => expect(spy).not.toHaveBeenCalledOnce()
                        ).not.toThrow()
                        // Assert
                    });
                });
            });

            describe(`when jest mock has been called > once`, () => {
                it(`should pass`, async () => {
                    // Arrange
                    const
                        mock = jest.fn();
                    // Act
                    mock();
                    mock();
                    expect(
                        () => expect(mock).toHaveBeenCalledOnce()
                    ).toThrow()
                    // Assert
                });

                describe(`and negated`, () => {
                    it(`should fail`, async () => {
                        // Arrange
                        const
                            mock = jest.fn();
                        // Act
                        mock();
                        mock();
                        expect(
                            () => expect(mock).not.toHaveBeenCalledOnce()
                        ).not.toThrow()
                        // Assert
                    });
                });
            });

            describe(`when jasmine spy has been called > once`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    const
                        spy = jasmine.createSpy("jasmineSpy");
                    // Act
                    spy();
                    spy();
                    expect(
                        () => expect(spy).toHaveBeenCalledOnce()
                    ).toThrow()
                    // Assert
                });
                describe(`and negated`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        const
                            spy = jasmine.createSpy("jasmineSpy");
                        // Act
                        spy();
                        spy();
                        expect(
                            () => expect(spy).not.toHaveBeenCalledOnce()
                        ).not.toThrow()
                        // Assert
                    });
                });
            });
        });

        describe(`toHaveBeenCalledOnceWith`, () => {
            describe(`when the spy or mock was not called at all`, () => {
                it(`should fail`, async () => {
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

                describe(`and negated`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        const
                            spy = jasmine.createSpy("jasmineSpy"),
                            mock = jest.fn();
                        // Act
                        expect(() => expect(spy).not.toHaveBeenCalledOnceWith(1))
                            .not.toThrow();
                        expect(() => expect(mock).not.toHaveBeenCalledOnceWith(1))
                            .not.toThrow();
                        // Assert
                    });
                });
            });
            describe(`when spy or mock called with unexpected arguments`, () => {
                it(`should fail`, async () => {
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

                describe(`and negated`, () => {
                    it(`should pass`, async () => {
                        // Arrange
                        const
                            spy = jasmine.createSpy("jasmineSpy"),
                            mock = jest.fn();
                        spy(1, 2, 3);
                        mock("a", "b", "c");
                        // Act
                        expect(() => expect(spy).not.toHaveBeenCalledOnceWith(4, 5, 6))
                            .not.toThrow();
                        expect(() => expect(mock).not.toHaveBeenCalledOnceWith("e", "f", "g"))
                            .not.toThrow();
                        // Assert
                    });
                });
            });
            describe(`when there is a single matching call`, () => {
                it(`should pass`, async () => {
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

                describe(`and negated`, () => {
                    it(`should fail`, async () => {
                        // Arrange
                        const
                            spy = jasmine.createSpy("jasmineSpy"),
                            mock = jest.fn();
                        spy(1, 2, 3);
                        spy(4, 5, 6);
                        mock("e", "f", "g");
                        mock("a", "b", "c");
                        // Act
                        expect(() => expect(spy).not.toHaveBeenCalledOnceWith(4, 5, 6))
                            .toThrow();
                        expect(() => expect(mock).not.toHaveBeenCalledOnceWith("e", "f", "g"))
                            .toThrow();
                        // Assert
                    });
                });
            });
            describe(`when there is > 1 matching call`, () => {
                it(`should fail`, async () => {
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

                describe(`and negated`, () => {
                    it(`should pass`, async () => {
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
                        expect(() => expect(spy).not.toHaveBeenCalledOnceWith(4, 5, 6))
                            .not.toThrow();
                        expect(() => expect(mock).not.toHaveBeenCalledOnceWith("e", "f", "g"))
                            .not.toThrow();
                        // Assert
                    });
                });
            });
            describe(`given a regex expectation paired with a matched string argument`, () => {
                it(`should pass`, async () => {
                    // Arrange
                    const
                        spy = jasmine.createSpy("someSpy"),
                        mock = jest.fn(),
                        message = "Hello there! This is an error, wot!";
                    // Act
                    spy(message);
                    mock(message);
                    // Assert
                    expect(() =>
                        expect(spy)
                            .toHaveBeenCalledOnceWith(/this is an error/i)
                    ).not.toThrow();
                    expect(() =>
                        expect(mock)
                            .toHaveBeenCalledOnceWith(/this is an error/i)
                    ).not.toThrow();
                });
                
                describe(`and negated`, () => {
                    it(`should fail`, async () => {
                        // Arrange
                        const
                            spy = jasmine.createSpy("someSpy"),
                            mock = jest.fn(),
                            message = "Hello there! This is an error, wot!";
                        // Act
                        spy(message);
                        mock(message);
                        // Assert
                        expect(() =>
                            expect(spy)
                                .not.toHaveBeenCalledOnceWith(/this is an error/i)
                        ).toThrow();
                        expect(() =>
                            expect(mock)
                                .not.toHaveBeenCalledOnceWith(/this is an error/i)
                        ).toThrow();
                    });
                });
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
            it(`should fail for something which is not a promise(ie, a value)`, async () => {
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
            it(`should not throw when negated if the promise hasn't been resolved or rejected`, async () => {                // Arrange
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
                    a = [ 1, 2, 3 ],
                    b = [ 3, 2, 1 ],
                    c = [ 1, 3, 2 ];
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
                    a = [ 1, 2, 3 ],
                    shorter = [ 1, 2 ],
                    longer = [ 1, 2, 3, 4 ],
                    different = [ 2, 5, 6 ];
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
                const obj = faker.random.arrayElement([ null, undefined ]);
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
                const obj = faker.random.arrayElement([ null, undefined ]);
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
                    b = [ 4, 5, 6 ];
                // Act
                expect(b)
                    .not.toAllMatch(i => i < 6);
                // Assert
            });
            it(`should pass if all elements match`, async () => {
                // Arrange
                const
                    a = [ 1, 2, 3 ];
                // Act
                expect(a)
                    .toAllMatch(i => i < 4);
                // Assert
            });
        });

        describe(`toContainElementLike`, () => {
            it(`should find the single element`, async () => {
                // Arrange
                const array = [ { foo: "foo", bar: "bar" } ];
                // Act
                expect(array)
                    .toContainElementLike({ foo: "foo" });
                // Assert
            });

            it(`should throw when it can't find a match`, async () => {
                // Arrange
                const array = [ { foo: "foo", bar: "bar" } ];
                // Act
                expect(() =>
                    expect(array)
                        .toContainElementLike({ foo: "foo1" })
                ).toThrow();
                // Assert
            });

            it(`should not throw when negated and it can't find a match`, async () => {
                // Arrange
                const array = [ { foo: "foo", bar: "bar" } ];
                // Act
                expect(() =>
                    expect(array)
                        .not.toContainElementLike({ foo: "foo1" })
                ).not.toThrow();
                // Assert
            });

            it(`should throw when negated and can find the single element`, async () => {
                    // Arrange
                    const array = [ { foo: "foo", bar: "bar" } ];
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

    describe(`dom nodes`, () => {
        it(`should assert that a node has a given attribute with string value`, async () => {
            // Arrange
            const node = document.createElement("div");
            node.setAttribute("foo", "bar");
            // Act
            expect(() =>
                expect(node)
                    .toHaveAttribute("foo", "bar")
            ).not.toThrow();
            expect(() =>
                expect(node).not.toHaveAttribute("foo", "bar")
            ).toThrow("Expected not to find attribute 'foo' with value 'bar'");
            // Assert
        });

        it(`should assert that the attribute is not the unexpected value`, async () => {
            // Arrange
            const node = document.createElement("div");
            node.setAttribute("foo", "quux");
            // Act
            expect(() =>
                expect(node)
                    .not.toHaveAttribute("foo", "bar")
            ).not.toThrow();
            expect(() => expect(node).not.toHaveAttribute("foo", "quux"))
                .toThrow();
            // Assert
        });

        it(`should assert the attribute exists at all`, async () => {
            // Arrange
            const node = document.createElement("div");
            node.setAttribute("foo", "bar");
            // Act
            expect(() =>
                expect(node)
                    .toHaveAttribute("foo")
            ).not.toThrow();
            expect(() => expect(node).toHaveAttribute("wibbly"))
                .toThrow();
            // Assert
        });
    });
});
