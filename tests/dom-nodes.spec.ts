import "../src/index";

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

