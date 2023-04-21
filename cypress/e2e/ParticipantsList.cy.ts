const validEventId = 'aa23ebc9-64af-4d1e-af32-5264ec2ba9bf';
const serverHostUrl = 'http://localhost:3000';

describe('Participants list', () => {
  
  it('Displays a list of participants', () => {
    cy.visit(`/event/${validEventId}/participants`);
    cy.contains('h1', 'Participants');
    cy.contains('th', '#');
    cy.contains('th', 'Username');
    cy.contains('th', 'EHB');
    cy.contains('td', '1');
    cy.contains('td', 'Crown Walker');
    cy.contains('td', '1140');
    cy.get('tbody > tr').should('have.length.at.least', 1);
  });

  it('Displays an error message when no participants are found', () => {
    cy.visit('/event/none/participants');
    cy.contains('p', 'No event found...');
  });

  it('Displays an Error fetching participants for event', () => {
    cy.intercept('GET', `${serverHostUrl}/participants/${validEventId}`, {
      statusCode: 500,
      body: {},
    });
    cy.visit(`/event/${validEventId}/participants`);
    cy.contains('p', 'Error finding participants for event..');
  });
});
