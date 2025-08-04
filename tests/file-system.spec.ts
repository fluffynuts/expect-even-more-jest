import "../src/index";
import { Sandbox } from "filesystem-sandbox";
import { fakerEN as faker } from "@faker-js/faker";

describe(`file system`, () => {
    describe(`toBeFile`, () => {
        it(`should test for existence of files`, async () => {
            // Arrange
            const
                sandbox = await Sandbox.create(),
                filename = randomFileName(),
                another = faker.string.alphanumeric(10),
                folder = faker.string.alphanumeric(10);
            await sandbox.writeFile(filename, faker.word.words());
            await sandbox.mkdir(folder);
            // Act
            expect(sandbox.fullPathFor(filename))
                .toBeFile();
            expect(sandbox.fullPathFor(another))
                .not.toBeFile();
            expect(sandbox.fullPathFor(folder))
                .not.toBeFile();
            // Assert
        });
    });

    describe(`toBeFolder`, () => {
        it(`should test for existence of folders`, async () => {
            // Arrange
            const
                sandbox = await Sandbox.create(),
                filename = faker.string.alphanumeric(10),
                another = faker.string.alphanumeric(10),
                folder = faker.string.alphanumeric(10);
            await sandbox.writeFile(filename, faker.word.words());
            await sandbox.mkdir(folder);
            // Act
            expect(sandbox.fullPathFor(filename))
                .not.toBeFolder();
            expect(sandbox.fullPathFor(another))
                .not.toBeFolder();
            expect(sandbox.fullPathFor(folder))
                .toBeFolder();
            // Assert
        });
    });

    describe(`toHaveContents`, () => {
        it(`should fail when the file doesn't exist or cannot be read`, async () => {
            // Arrange
            const
                sandbox = await Sandbox.create();
            // Act
            expect(() => expect(sandbox.fullPathFor(randomFileName()))
                .toHaveContents(faker.word.words())
            ).toThrow(/not found/);
            // Assert
        });

        it(`should test that the file contains the expected content`, async () => {
            // Arrange
            const
                sandbox = await Sandbox.create(),
                contents1 = faker.word.words({ count: { min: 15, max: 45 } }),
                contents2 = faker.word.words({ count: { min: 15, max: 45 } }),
                file1 = await sandbox.writeFile(randomFileName(), contents1),
                file2 = await sandbox.writeFile(randomFileName(), contents2);
            // Act
            expect(file1)
                .toHaveContents(contents1);
            expect(file2)
                .toHaveContents(contents2);
            expect(file1)
                .toHaveContents(Buffer.from(contents1));
            expect(file2)
                .toHaveContents(Buffer.from(contents2));

            expect(file1)
                .not.toHaveContents(contents2);
            expect(file2)
                .not.toHaveContents(contents1);

            expect(() => expect(file1)
                .toHaveContents(contents2)
            ).toThrow();
            expect(() => expect(file2)
                .toHaveContents(contents1)
            ).toThrow();
            // Assert
        });
    });

    const seenFileNames = new Set<string>();

    function randomFileName() {
        let result: string;
        do {
            result = faker.system.fileName();
        } while (seenFileNames.has(result));
        seenFileNames.add(result);
        return result;
    }

    beforeEach(() => {
        seenFileNames.clear();
    });
});

