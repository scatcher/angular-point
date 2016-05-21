import { AngularPointPage } from './app.po';

describe('angular-point App', function() {
  let page: AngularPointPage;

  beforeEach(() => {
    page = new AngularPointPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('angular-point works!');
  });
});
