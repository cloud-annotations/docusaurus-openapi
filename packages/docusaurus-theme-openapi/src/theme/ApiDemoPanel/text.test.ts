/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { stripText } from "./text";

describe("stripText function", () => {
  it("should return empty string when passed undefined", () => {
    expect(stripText(undefined)).toBe("");
  });

  it("should strip markdown", () => {
    expect(
      stripText(
        "**This** description contains [markdown](https://www.markdownguide.org/)"
      )
    ).toBe("This description contains markdown");
  });

  it("should strip HTML", () => {
    expect(
      stripText(
        '<strong>This</strong> description contains <a href="https://www.w3.org/html/">HTML</a>'
      )
    ).toBe("This description contains HTML");
  });

  it("should replace newlines with space", () => {
    expect(stripText("one\ntwo\n\nthree")).toBe("one two three");
  });

  it("should insert whitespace between HTML elements", () => {
    expect(
      stripText("<div><div>one</div></div><p>two</p><p>three</p><br />four")
    ).toBe("one two three four");
  });
});
