import "../src/index";
import { Sandbox } from "filesystem-sandbox";
import { fakerEN as faker } from "@faker-js/faker";

describe(`file system`, () => {
    describe(`toBeFile`, () => {
        it(`should test for existence of files`, async () => {
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
});

