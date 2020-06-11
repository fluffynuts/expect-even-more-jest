import "../src/index";

describe(`expect-even-more-jest`, () => {
    it(`should import expect-more-jest`, async () => {
        // Arrange
        // Act
        expect(() => {
        }).toBeFunction();
        // Assert
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
    });

    // TODO: add more tests
    // -> the matchers in this package are used daily, but
    //    should have explicit tests here

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
})
;
