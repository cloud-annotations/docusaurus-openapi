/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

describe("test", () => {
  before(() => {
    cy.visit("/api/recursive");
  });

  it("renders query parameters", () => {
    cy.findByText(/query parameters/i).should("exist");
  });

  it("loads when clicking on tabs", () => {
    cy.on("uncaught:exception", () => {
      // there is an uncaught error trying to load monaco in ci
      return false;
    });

    function checkTab(tab: RegExp, links: RegExp[], heading: RegExp) {
      cy.get(".navbar").findByRole("link", { name: tab }).click();

      for (let link of links) {
        cy.get("nav.menu").findByRole("link", { name: link }).click();
      }

      cy.findByRole("heading", { name: heading, level: 1 }).should("exist");
    }

    checkTab(/issue 21/i, [], /missing summary/i);
    checkTab(/cos/i, [], /generating an iam token/i);
    checkTab(/yaml/i, [/api/i, /hello world/i], /hello world/i);
    checkTab(
      /petstore/i,
      [/pet/i, /add a new pet to the store/i],
      /add a new pet to the store/i
    );
    checkTab(/api/i, [/^pet$/i, /recursive/i], /recursive/i);
  });

  it("loads a page with authentication", () => {
    cy.visit("/cos/list-buckets");
    cy.findByRole("button", { name: /authorize/i }).should("exist");

    cy.visit("/cos/create-a-bucket");
    cy.findByRole("button", { name: /authorize/i }).should("exist");
  });
});
