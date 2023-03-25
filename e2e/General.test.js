
// for this test to pass, the app should start on the login screen when detox opens
describe('Basic Behavior Test', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: false });
    });

    it('initialize page should be login screen', async () => {
        await expect(element(by.id('loginScreenView'))).toBeVisible();
    });

    it('screen after login screen should be trending screen', async () => {
        const emailInput = element(by.id('emailTextInput'));
        const passwordInput = element(by.id('passwordTextInput'));
        const loginButton = element(by.id('loginButton'));

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(loginButton).toBeVisible();

        await emailInput.typeText('lavindude@gmail.com') // TODO: store these in .env
        await passwordInput.typeText('Password123')
        await loginButton.tap();

        await expect(element(by.id('trendingScreenView'))).toBeVisible();
    });

    it ('friend group screen should render when tapped on friends tab', async () => {
        await element(by.id('Friends')).tap();
        await expect(element(by.id('friendsScreenView'))).toBeVisible();
    })

    it ('library screen should render when tapped on library tab', async () => {
        await element(by.id('Library')).tap();
        await expect(element(by.id('libraryScreenView'))).toBeVisible();
    })
});