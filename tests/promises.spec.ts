import "../src/index";

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

