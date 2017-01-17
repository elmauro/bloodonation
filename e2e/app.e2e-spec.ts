import { BloodonationPage } from './app.po';

describe('bloodonation App', function() {
  let page: BloodonationPage;

  beforeEach(() => {
    page = new BloodonationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
