/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { generateSidebars } from ".";

// npx jest packages/docusaurus-plugin-openapi/src/sidebars/sidebars.test.ts --watch

describe("sidebars", () => {
  const getOpts = () => ({
    sidebarCollapsible: true,
    sidebarCollapsed: true,
  });

  const getIntro = (overrides = {}) => ({
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
    ...overrides,
  });

  describe("Single Spec - YAML", () => {
    it("base case - single spec with untagged routes should render flat with no categories", () => {
      const input = [
        getIntro(),
        {
          type: "api" as const,
          id: "hello-world",
          title: "Hello World",
          api: {
            tags: [],
          },
          source: "@site/examples/openapi.yaml",
          sourceDirName: ".",
          permalink: "/yaml/hello-world",
        },
      ];

      const output = generateSidebars(input, getOpts());
      // console.log(JSON.stringify(output, null, 2));

      // intro.md
      const info = output.find((x) => x.docId === "introduction");
      expect(info?.type).toBe("link");
      expect(info?.label).toBe("Introduction");
      expect(info?.href).toBe("/yaml/introduction");

      // swagger rendering
      const api = output.find((x) => x.docId === "hello-world");
      expect(api?.type).toBe("link");
      expect(api?.label).toBe("Hello World");
    });

    it("single spec tags case - should render root level categories per tag", () => {
      const input = [
        getIntro(),
        {
          type: "api" as const,
          id: "hello-world",
          title: "Hello World",
          api: {
            tags: ["stuff"],
          },
          source: "@site/examples/openapi.yaml",
          sourceDirName: ".",
          permalink: "/yaml/hello-world",
        },
      ];

      const output = generateSidebars(input, getOpts());
      // console.log(JSON.stringify(output, null, 2));

      // intro.md
      const info = output.find((x) => x.docId === "introduction");
      expect(info?.type).toBe("link");
      expect(info?.label).toBe("Introduction");
      expect(info?.href).toBe("/yaml/introduction");

      // swagger rendering
      const api = output.find((x) => x.type === "category");
      expect(api?.label).toBe("stuff");
      expect(api?.items).toBeInstanceOf(Array);
      expect(api?.items).toHaveLength(1);

      const [helloWorld] = api?.items ?? [];
      expect(helloWorld.type).toBe("link");
      expect(helloWorld.label).toBe("Hello World");
    });
  });
  describe("Multi Spec", () => {
    it("should leverage the info.title if provided for spec name @ root category", () => {
      const input = [
        {
          type: "api" as const,
          id: "cats",
          title: "Cats",
          api: {
            info: { title: "Cats", version: "1.0.1" },
            tags: [],
          },
          source: "@site/examples/cats.yaml",
          sourceDirName: ".",
          permalink: "/yaml/cats",
        },
        {
          type: "api" as const,
          id: "dogs",
          title: "Dogs",
          api: {
            info: { title: "Dogs", version: "1.0.1" },
            tags: [],
          },
          source: "@site/examples/dogs.yaml",
          sourceDirName: ".",
          permalink: "/yaml/dogs",
        },
      ];

      const output = generateSidebars(input, getOpts());

      // console.log(JSON.stringify(output, null, 2));
      expect(output).toHaveLength(2);
      const [cats, dogs] = output;
      expect(cats.type).toBe("category");
      expect(cats.items).toHaveLength(1);
      const [catLink] = cats.items ?? [];
      expect(catLink.type).toBe("link");
      expect(dogs.type).toBe("category");
      expect(dogs.items).toHaveLength(1);
      expect(dogs.label).toBe("Dogs");
    });

    it("empty title should render the filename.", () => {
      const input = [
        {
          type: "api" as const,
          id: "cats",
          title: "Cats",
          api: {
            info: { title: "Cats", version: "1.0.1" },
            tags: [],
          },
          source: "@site/examples/cats.yaml",
          sourceDirName: ".",
          permalink: "/yaml/cats",
        },
        {
          type: "api" as const,
          id: "dogs",
          title: "Dogs",
          api: {
            info: { title: "", version: "1.0.1" },
            tags: [],
          },
          source: "@site/examples/dogs.yaml",
          sourceDirName: ".",
          permalink: "/yaml/dogs",
        },
        {
          type: "api" as const,
          id: "dogs-id",
          title: "Dogs By Id",
          api: {
            info: { title: "", version: "1.0.1" },
            tags: [],
          },
          source: "@site/examples/dogs.yaml",
          sourceDirName: ".",
          permalink: "/yaml/dogs-id",
        },
      ];

      const output = generateSidebars(input, getOpts());

      // console.log(JSON.stringify(output, null, 2));
      const [cats, dogs] = output;
      expect(cats.items).toHaveLength(1);
      expect(dogs.type).toBe("category");
      expect(dogs.items).toHaveLength(2);
      expect(dogs.label).toBe("dogs");
    });

    it("multi spec, multi tag", () => {
      const input = [
        {
          type: "api" as const,
          id: "tails",
          title: "List Tails",
          api: {
            info: { title: "Cats", version: "1.0.1" },
            tags: ["Tails"],
          },
          source: "@site/examples/cats.yaml",
          sourceDirName: ".",
          permalink: "/yaml/tails",
        },
        {
          type: "api" as const,
          id: "tails-by-id",
          title: "Tails By Id",
          api: {
            info: { title: "Cats", version: "1.0.1" },
            tags: ["Tails"],
          },
          source: "@site/examples/cats.yaml",
          sourceDirName: ".",
          permalink: "/yaml/tails-by-id",
        },
        {
          type: "api" as const,
          id: "whiskers",
          title: "List whiskers",
          api: {
            info: { title: "Cats", version: "1.0.1" },
            tags: ["Whiskers"],
          },
          source: "@site/examples/cats.yaml",
          sourceDirName: ".",
          permalink: "/yaml/whiskers",
        },
        {
          type: "api" as const,
          id: "dogs",
          title: "Dogs",
          api: {
            info: { title: "Dogs", version: "1.0.1" },
            tags: ["Doggos"],
          },
          source: "@site/examples/dogs.yaml",
          sourceDirName: ".",
          permalink: "/yaml/dogs",
        },
        {
          type: "api" as const,
          id: "dogs-id",
          title: "Dogs By Id",
          api: {
            info: { title: "Dogs", version: "1.0.1" },
            tags: ["Doggos"],
          },
          source: "@site/examples/dogs.yaml",
          sourceDirName: ".",
          permalink: "/yaml/dogs-id",
        },
        {
          type: "api" as const,
          id: "toys",
          title: "Toys",
          api: {
            info: { title: "Dogs", version: "1.0.1" },
            tags: ["Toys"],
          },
          source: "@site/examples/dogs.yaml",
          sourceDirName: ".",
          permalink: "/yaml/toys",
        },
      ];

      const output = generateSidebars(input, getOpts());

      // console.log(JSON.stringify(output, null, 2));
      const [cats, dogs] = output;
      expect(cats.type).toBe("category");
      expect(cats.items).toHaveLength(2);
      const [tails, whiskers] = cats.items || [];
      expect(tails.type).toBe("category");
      expect(whiskers.type).toBe("category");
      expect(tails.items).toHaveLength(2);
      expect(whiskers.items).toHaveLength(1);
      expect(tails.items?.[0].type).toBe("link");
      expect(whiskers.items?.[0].type).toBe("link");
      expect(tails.items?.[0].label).toBe("List Tails");
      expect(whiskers.items?.[0].label).toBe("List whiskers");

      expect(dogs.type).toBe("category");
      expect(dogs.items).toHaveLength(2);
      expect(dogs.label).toBe("Dogs");
      const [doggos, toys] = dogs.items || [];
      expect(doggos.type).toBe("category");
      expect(toys.type).toBe("category");
      expect(doggos.items).toHaveLength(2);
      expect(toys.items).toHaveLength(1);
    });
  });
});
