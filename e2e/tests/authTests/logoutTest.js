const logoutTest = () => {
    describe('Test logout', () => {
        beforeAll(async () => {
            await device.launchApp({
                permissions: {
                    location: 'always',
                },
                newInstance: false,
            });
        });
    
        it('switch to profile tab and logout', async () => {
            await element(by.id('Profile')).tap();
            await expect(element(by.id('profileScreenView'))).toBeVisible();

            await element(by.id('headerRightButton')).tap();
            await expect(element(by.id('settingsScreenView'))).toBeVisible();
            
            await element(by.id('logoutButton')).tap();
            await expect(element(by.id('loginScreenView'))).toBeVisible();
        })
    })
}

export default logoutTest;