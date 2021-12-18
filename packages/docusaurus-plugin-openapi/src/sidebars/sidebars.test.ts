/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

// import path from "path";

import fs from "fs";
import path from "path";

import cloneDeep from "lodash/cloneDeep";

import { generateSidebars, InfoItem } from ".";

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
    let introMd: InfoItem;
    beforeEach(() => {
      introMd = cloneDeep({
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
      });
    });

    it("base case & should create a category defaulting to source filename", () => {
      const input = [
        introMd,
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
      //   console.log(JSON.stringify(output, null, 2));

      // intro.md
      const info = output.find((x) => x.type === "link");
      expect(info?.docId).toBe("introduction");
      expect(info?.label).toBe("Introduction");
      expect(info?.href).toBe("/yaml/introduction");

      // swagger rendering
      const api = output.find((x) => x.type === "category");
      expect(api?.label).toBe("openapi");
      expect(api?.items).toBeInstanceOf(Array);
      expect(api?.items).toHaveLength(1);

      const [helloWorld] = api?.items ?? [];
      expect(helloWorld.type).toBe("link");
      expect(helloWorld.label).toBe("Hello World");

      expect(output).toBeInstanceOf(Array);
    });

    it("should leverage the info.title if provided", () => {
      const input = [
        introMd,
        {
          type: "api" as const,
          id: "hello-world",
          title: "Hello World",
          api: {
            info: { title: "Cloud Object Storage", version: "1.0.1" },
            tags: [],
          },
          source: "@site/examples/openapi.yaml",
          sourceDirName: ".",
          permalink: "/yaml/hello-world",
        },
      ];

      const output = generateSidebars(input, getOpts());

      //   console.log(JSON.stringify(output, null, 2));

      // swagger rendering
      const api = output.find((x) => x.type === "category");
      expect(api?.label).toBe("Cloud Object Storage");
    });
  });
});
