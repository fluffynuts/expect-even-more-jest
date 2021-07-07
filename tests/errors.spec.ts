import "../src/index";

describe(`errors`, () => {
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
