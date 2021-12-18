/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

// import path from "path";

import { generateSidebars } from ".";

// npx jest packages/docusaurus-plugin-openapi/src/sidebars/sidebars.test.ts --watch

describe("sidebars", () => {
  const getOpts = () => ({
    sidebarCollapsible: true,
    sidebarCollapsed: true,
  });
  it("info", () => {
    const sidebars = generateSidebars(
      [
        // introduction page
        {
          type: "info",
          id: "pets",
          frontMatter: {},
          permalink: "",
          slug: "",
          source: "@site/docs/folder/subFolder/subSubFolder/myDoc.md",
          unversionedId: "",
          title: "title - pets",
          description: "desc - petstore",
          sourceDirName: "./folder/subFolder/subSubFolder",
          info: {
            title: "pets",
            version: "1.0.0",
          },
        },
      ],
      getOpts()
    );
    // console.log(JSON.stringify(sidebars, null, 2));
    expect(sidebars).toBeInstanceOf(Array);
  });

  describe.only("YAML", () => {
    it("rendering", () => {
      const input = [
        {
          type: "info" as const,
          id: "introduction",
          unversionedId: "introduction",
          title: "Introduction",
          description: "Sample description.",
          slug: "/introduction",
          frontMatter: {},
          info: {
            title: "YAML Example",
            version: "1.0.0",
            description: "Sample description.",
          },
          source: "@site/examples/openapi.yaml",
          sourceDirName: ".",
          permalink: "/yaml/introduction",
          next: {
            title: "Hello World",
            permalink: "/yaml/hello-world",
          },
        },
        {
          type: "api" as const,
          id: "hello-world",
          unversionedId: "hello-world",
          title: "Hello World",
          description: "",
          slug: "/hello-world",
          frontMatter: {},
          api: {
            description: "Example OpenApi definition with YAML.",
            method: "get",
            path: "/hello",
            tags: [],
          },
          source: "@site/examples/openapi.yaml",
          sourceDirName: ".",
          permalink: "/yaml/hello-world",
          previous: {
            title: "Introduction",
            permalink: "/yaml/introduction",
          },
        },
      ];

      const output = generateSidebars(input, getOpts());
      console.log(JSON.stringify(output, null, 2));

      // intro.md
      const info = output.find((x) => x.type === "link");
      expect(info?.docId).toBe("introduction");
      expect(info?.label).toBe("Introduction");
      expect(info?.href).toBe("/yaml/introduction");

      // swagger rendering
      const api = output.find((x) => x.type === "category");
      expect(api?.label).toBe("API");
      expect(api?.items).toBeInstanceOf(Array);
      expect(api?.items).toHaveLength(1);

      const [helloWorld] = api?.items ?? [];
      expect(helloWorld.type).toBe("link");
      expect(helloWorld.label).toBe("Hello World");

      expect(output).toBeInstanceOf(Array);
    });

    it("child folders", async () => {
      const input = [
        {
          type: "api" as const,
          id: "cats",
          title: "Cats",
          api: {
            info: { title: "Cat Store" },
            tags: ["Cats"],
          },
          source: "@site/examples/animals/pets/cats.yaml",
          sourceDirName: "animals/pets",
          permalink: "/yaml/cats",
        },
        {
          type: "api" as const,
          id: "burgers",
          title: "Burgers",
          api: {
            info: { title: "Burger Store" },
            tags: ["Burgers"],
          },
          source: "@site/examples/food/fast/burgers.yaml",
          sourceDirName: "food/fast",
          permalink: "/yaml/burgers",
        },
      ];

      const output = await generateSidebars(input, getOpts());
      expect(output).toBeTruthy();
      // console.log(JSON.stringify(output, null, 2));
      // console.log(output);
      const [animals, foods] = output;
      expect(animals.type).toBe("category");
      expect(foods.type).toBe("category");

      /*
        animals
          pets
            Cat Store
              cats
        Foods
          Buger Store
            Burger Example
              burgers
      */
      output.filter(isCategory).forEach((category) => {
        // console.log(category.label);
        expect(category.items[0].type).toBe("category");
        category.items.filter(isCategory).forEach((subCategory) => {
          expect(subCategory.items[0].type).toBe("category");
          subCategory.items.filter(isCategory).forEach((groupCategory) => {
            expect(groupCategory.items[0].type).toBe("category");
            groupCategory.items.forEach((linkItem) => {
              expect(linkItem.type).toBe("category");
            });
          });
        });
      });
    });
  });
});
