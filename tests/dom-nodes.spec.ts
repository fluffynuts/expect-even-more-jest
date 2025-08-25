import "../src/index";

describe(`dom nodes`, () => {
    describe(`toHaveAttribute`, () => {
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

    describe(`toBeVisible`, () => {
        it(`should assert element visibility`, async () => {
            // Arrange
            const
                cssTag = HTMLElementBuilder.create("style")
                    .withAttribute("type", "text/css")
                    .withContent(`
                        .ng-hide { display: none !important }
                        `
                    ).build();
            document.head.appendChild(cssTag);
            const
                visibleEl = HTMLElementBuilder.buildDefault("div"),
                displayNoneEl = HTMLElementBuilder.create("div")
                    .withAttribute("style", "display: none")
                    .build(),
                hiddenByVisibilityEl = HTMLElementBuilder.create("div")
                    .withAttribute("style", "visibility: hidden")
                    .build(),
                collapsedEl = HTMLElementBuilder.create("div")
                    .withAttribute("style", "visibility: collapse")
                    .build(),
                hiddenEl = HTMLElementBuilder.create("div")
                    .withProp(o => o.hidden = true)
                    .build(),
                angularHiddenEl = HTMLElementBuilder.create("div")
                    .withClass("ng-hide")
                    .build();
            // Act
            expect(visibleEl)
                .toBeVisible();
            expect(displayNoneEl)
                .not.toBeVisible();
            expect(hiddenByVisibilityEl)
                .not.toBeVisible();
            expect(collapsedEl)
                .not.toBeVisible();
            expect(hiddenEl)
                .not.toBeVisible();
            expect(angularHiddenEl)
                .not.toBeVisible();

            expect(() =>
                expect(visibleEl)
                    .not.toBeVisible()
            ).toThrow();
            expect(() =>
                expect(displayNoneEl)
                    .toBeVisible()
            ).toThrow();
            expect(() =>
                expect(hiddenByVisibilityEl)
                    .toBeVisible()
            ).toThrow();
            expect(() =>
                expect(collapsedEl)
                    .toBeVisible()
            ).toThrow();
            expect(() =>
                expect(hiddenEl)
                    .toBeVisible()
            ).toThrow();
            expect(() =>
                expect(angularHiddenEl)
                    .toBeVisible()
            ).toThrow();

            // Assert
        });
    });

    interface Dictionary<T> {
        [key: string]: T
    }

    abstract class Builder<TBuilder extends Builder<TBuilder, TTarget>, TTarget> {
        protected transforms: ((o: TTarget) => void)[] = [];

        public withProp(fn: (target: TTarget) => void): TBuilder {
            this.transforms.push(fn);
            return this as unknown as TBuilder;
        }

        protected abstract construct(): TTarget;

        public build(): TTarget {
            const result = this.construct();
            for (const transform of this.transforms) {
                transform(result);
            }
            return result;
        }
    }

    class HTMLElementBuilder extends Builder<HTMLElementBuilder, HTMLElement> {
        static create(tagName: string) {
            return new HTMLElementBuilder(tagName);
        }

        static buildDefault(tagName: string) {
            return HTMLElementBuilder.create(tagName).build();
        }

        protected override construct(): HTMLElement {
            return document.createElement(this.tagName);
        }

        attributes: Dictionary<string> = {}
        children: HTMLElement[] = [];

        constructor(public tagName: string) {
            super();
        }

        public withAttribute(
            name: string,
            value: string
        ): HTMLElementBuilder {
            return this.withProp(
                o => o.setAttribute(name, value)
            );
        }

        public withClass(
            name: string
        ) {
            return this.withProp(
                o => o.classList.add(name)
            );
        }

        public withContent(
            content: string
        ) {
            return this.withProp(
                o => o.innerHTML = content
            );
        }

        public withChild(el: HTMLElement): HTMLElementBuilder {
            return this.withProp(
                o => o.appendChild(el)
            );
        }
    }
});

