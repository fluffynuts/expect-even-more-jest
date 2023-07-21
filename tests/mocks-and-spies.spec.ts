import "../src/index";
import faker from "faker";

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
                    .toThrow(/"e","f","g".*"a","b","c"/s);
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
    describe(`toHaveBeenCalledOnceWithNoArgs`, () => {
        describe(`when mock or spy was called with no arguments`, () => {
            it(`should pass`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("spy"),
                    mock = jest.fn();
                // Act
                spy();
                mock();
                // Assert
                expect(() => expect(spy)
                    .toHaveBeenCalledOnceWithNoArgs()
                ).not.toThrow();
                expect(() => expect(mock)
                    .toHaveBeenCalledOnceWithNoArgs()
                ).not.toThrow();
            });

            describe(`and negated`, () => {
                it(`should fail`, async () => {
                    // Arrange
                    const
                        spy = jasmine.createSpy("spy"),
                        mock = jest.fn();
                    // Act
                    spy();
                    mock();
                    // Assert
                    expect(() => expect(spy)
                        .not.toHaveBeenCalledOnceWithNoArgs()
                    ).toThrow();
                    expect(() => expect(mock)
                        .not.toHaveBeenCalledOnceWithNoArgs()
                    ).toThrow();
                });
            });
        });
        describe(`when mock or spy was called with arguments`, () => {
            it(`should fail`, async () => {
                // Arrange
                const
                    spy = jasmine.createSpy("spy"),
                    mock = jest.fn();
                // Act
                spy(faker.random.number());
                mock(faker.random.words());
                // Assert
                expect(() => expect(spy)
                    .toHaveBeenCalledOnceWithNoArgs()
                ).toThrow();
                expect(() => expect(mock)
                    .toHaveBeenCalledOnceWithNoArgs()
                ).toThrow();
            });
            describe(`and negated`, () => {
                it(`should pass`, async () => {
                    // Arrange
                    const
                        spy = jasmine.createSpy("spy"),
                        mock = jest.fn();
                    // Act
                    spy(faker.random.number());
                    mock(faker.random.words());
                    // Assert
                    expect(() => expect(spy)
                        .not.toHaveBeenCalledOnceWithNoArgs()
                    ).not.toThrow();
                    expect(() => expect(mock)
                        .not.toHaveBeenCalledOnceWithNoArgs()
                    ).not.toThrow();
                });
            });
        });
    });

    describe(`wild issues`, () => {
        it(`should be able to print for jasmine.any(Function)`, async () => {
            // Arrange
            const obj = {
                fn(i: any) {
                    // moo
                }
            };
            spyOn(obj, "fn");
            // Act
            obj.fn(() => {
            });
            // Assert
            expect(obj.fn)
                .toHaveBeenCalledOnceWith(jasmine.any(Function));
        });
    });

    describe(`toThrowMatching`, () => {
        it(`should match via the provided function`, async () => {
            // Arrange
            // Act
            expect(() => {
                expect(() => {
                    throw new Error("foo bar")
                })
                    .toThrowMatching(
                        e => e instanceof Error &&
                            e.message.indexOf("foo") > -1 &&
                            e.message.indexOf("bar") > -1
                    );
            }).not.toThrow();

            expect(() => {
                expect(() => {
                    throw new Error("cow beef")
                }).toThrowMatching(
                    e => e instanceof Error &&
                        e.message.indexOf("foo") > -1 &&
                        e.message.indexOf("bar") > -1
                );
            }).toThrow();

            expect(() => {
                expect(() => {
                    return 10;
                }).not.toThrowMatching(
                    e => e instanceof Error &&
                        e.message.indexOf("foo") > -1 &&
                        e.message.indexOf("bar") > -1
                );
            }).toThrow();
            // Assert
        });
    })
    ;
})
;

