# expect-even-more-jest
## What is it?

It's [expect-more-jest](https://www.npmjs.com/package/expect-more-jest) with _even more_ stuff!

## Why?

Because [expect-more-jest](https://www.npmjs.com/package/expect-more-jest) has most of the things
I need, but is missing a few, which I'm not entirely sure would be accepted upstream. This way, I
present one package with all the tastiness of
[expect-more-jest](https://www.npmjs.com/package/expect-more-jest) _as well as_ all the useful
things that _I_ like!

## Ok, so what's in the tin?

First, check out what [expect-more-jest supplies](https://www.npmjs.com/package/expect-more-jest#-matchers)
Cool, huh?

Now, in addition to that, I've added:

```typescript
describe(`expect-even-more-jest', () => {
    it(`makes your tests and output easier to read as well!`, async () => {
        // values
        expect(SomeClass).toBeConstructor();
        expect(new SomeClass()).toBeA(SomeClass);
        // syntactic sugar: better flowing
        expect(new ExcitedThing()).toBeAn(ExcitedThing);
        // test that a value is not null or undefined
        expect(someValue).toExist();
        // tests matching properties on two objects
        expect({ foo: 1, bar: 2 })
            .toIntersectionEqual({ foo: 1, quux: 2 });

        // mocks & spies
        expect(spyOrMock).toHaveBeenCalledOnce();
        expect(spyOrMock).toHaveBeenCalledOnceWith("hello", "world");

        // promises
        // - completed promises have resolved _or_ rejected
        await expect(Promise.resolve()).toBeCompleted();
        await expect(Promise.reject()).toBeCompleted();

        // test that a promise resolves within a timeframe (defaults to 50 ms)
        await expect(Promise.resolve()).toBeResolved("should have resolved", 5000);
        // test that a promise rejects within a timeframe (defaults to 50 ms)
        await expect(Promise.reject()).toBeRejected("should have rejected", 123);
        expect(new Promise(() => {})).toBePromiseLike();

        // file system
        expect(pathToFile).toBeFile();
        expect(pathToFolder).toBeFolder();

        // collections
        expect([1, 2, 3 ]).toBeEquivalentTo([ 2, 1, 3]);
        expect({ foo: 1 }).toHaveKey("foo");
        expect({ foo: 1, bar: 2 }).toHaveKeys("foo", "bar");
        expect([ 1, 2, 3 ]).toAllMatch(i => i < 4);
        // performs deep partial equality testing on elements of an array to find
        // the search object, using jasmine.objectContaining (so you don't need
        // to match _all_ properties!
        expect(arrayOfObjects).toContainElementLike(search);
    });
});
```
