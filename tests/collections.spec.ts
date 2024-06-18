// noinspection UnnecessaryLocalVariableJS

import "../src/index";
import faker from "faker";

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

