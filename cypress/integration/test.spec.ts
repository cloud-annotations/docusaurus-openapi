describe("test", () => {
  before(() => {
    cy.visit("/api");
  });

  it("renders query parameters", () => {
    cy.findByText(/query parameters/i).should("exist");
  });
});
