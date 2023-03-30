const tabTest = () => {
    describe('Basic tab test', () => {
        it('friend group screen should render when tapped on friends tab', async () => {
            await element(by.id('Friends')).tap();
            await expect(element(by.id('friendsScreenView'))).toBeVisible();
        })
    
        it('library screen should render when tapped on library tab', async () => {
            await element(by.id('Library')).tap();
            await expect(element(by.id('libraryScreenView'))).toBeVisible();

            await expect(element(by.id('bookmarksList'))).toBeVisible();
            await element(by.id('events')).tap();
            await expect(element(by.id('eventHistoryList'))).toBeVisible();
        })

        it('settings screen should render when tapped on settings tab', async () => {
            await element(by.id('Profile')).tap();
            await expect(element(by.id('profileScreenView'))).toBeVisible();
        })
    })
}

export default tabTest;