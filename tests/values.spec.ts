import "../src/index";

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

