/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import sdk from "postman-collection";

import { openApiQueryParams2PostmanQueryParams } from "./buildPostmanRequest";

describe("openApiQueryParams2PostmanQueryParams", () => {
  it("should transform empty array to empty array", () => {
    const expected: sdk.QueryParam[] = [];
    const actual = openApiQueryParams2PostmanQueryParams([]);
    expect(actual).toStrictEqual(expected);
  });

  it("default to comma delimited", () => {
    const expected: sdk.QueryParam[] = [
      new sdk.QueryParam({ key: "arrayParam", value: "abc,def" }),
    ];
    const actual = openApiQueryParams2PostmanQueryParams([
      {
        name: "arrayParam",
        in: "query",
        value: ["abc", "def"],
      },
    ]);
    expect(actual).toStrictEqual(expected);
  });

  it("should expand params if explode=true", () => {
    const expected: sdk.QueryParam[] = [
      new sdk.QueryParam({ key: "arrayParam", value: "abc" }),
      new sdk.QueryParam({ key: "arrayParam", value: "def" }),
    ];
    const actual = openApiQueryParams2PostmanQueryParams([
      {
        name: "arrayParam",
        in: "query",
        style: "form",
        explode: true,
        value: ["abc", "def"],
      },
    ]);
    expect(actual).toStrictEqual(expected);
  });

  it("should respect style=pipeDelimited", () => {
    const expected: sdk.QueryParam[] = [
      new sdk.QueryParam({ key: "arrayParam", value: "abc|def" }),
    ];
    const actual = openApiQueryParams2PostmanQueryParams([
      {
        name: "arrayParam",
        in: "query",
        style: "pipeDelimited",
        value: ["abc", "def"],
      },
    ]);
    expect(actual).toStrictEqual(expected);
  });

  it("should respect style=spaceDelimited", () => {
    const expected: sdk.QueryParam[] = [
      new sdk.QueryParam({ key: "arrayParam", value: "abc%20def" }),
    ];
    const actual = openApiQueryParams2PostmanQueryParams([
      {
        name: "arrayParam",
        in: "query",
        style: "spaceDelimited",
        value: ["abc", "def"],
      },
    ]);
    expect(actual).toStrictEqual(expected);
  });
});
