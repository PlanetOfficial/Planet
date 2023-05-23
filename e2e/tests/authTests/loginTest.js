// for this test to pass, the app should start on the login screen when detox opens
const loginTest = () => {
    describe('Test Login', () => {
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
    })
}

export default loginTest;