import "../src/index";

describe(`expect-even-more-jest`, () => {
    it(`should import expect-more-jest`, async () => {
        // Arrange
        // Act
        expect(() => {}).toBeFunction();
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
});
