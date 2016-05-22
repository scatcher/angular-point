export class AngularPointPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('angular-point-app h1')).getText();
  }
}
