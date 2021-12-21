/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { getQualifierMessage } from "./schema";

describe("getQualifierMessage", () => {
  it("should render nothing", () => {
    const actual = getQualifierMessage({});
    expect(actual).toBeUndefined();
  });

  it("should render minLength", () => {
    const expected = "**Possible values:** 1 ≤ length";
    const actual = getQualifierMessage({ minLength: 1 });
    expect(actual).toBe(expected);
  });

  it("should render maxLength", () => {
    const expected = "**Possible values:** length ≤ 40";
    const actual = getQualifierMessage({ maxLength: 40 });
    expect(actual).toBe(expected);
  });

  it("should render minLength and maxLength", () => {
    const expected = "**Possible values:** 1 ≤ length ≤ 40";
    const actual = getQualifierMessage({ minLength: 1, maxLength: 40 });
    expect(actual).toBe(expected);
  });
});
