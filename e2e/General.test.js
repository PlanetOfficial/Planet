
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

    it('friend group screen should render when tapped on friends tab', async () => {
        await element(by.id('Friends')).tap();
        await expect(element(by.id('friendsScreenView'))).toBeVisible();
    })

    it('library screen should render when tapped on library tab', async () => {
        await element(by.id('Library')).tap();
        await expect(element(by.id('libraryScreenView'))).toBeVisible();
    })
});

describe('Behavior test through the create event screens', () => {
    beforeAll(async () => {
        await device.launchApp({
            permissions: {
                location: 'always',
            },
            newInstance: false,
        });
    });

    it('render map screen after clicking create button', async () => {
        await element(by.id('Create')).tap();
        await expect(element(by.id('mapSelectionScreenView'))).toBeVisible();
    })

    it('search for location', async () => {
        await element(by.id('searchLocationInput')).typeText('Seattle');
        await element(by.label('Seattle, WA, USA')).tap();
    })

    it('go to select categories after map selection', async () => {
        await element(by.id('mapSelectionNext')).tap();
        await expect(element(by.id('selectCategoriesScreenView'))).toBeVisible();
    })

    it('Select some categories from genres', async () => { // TODO: change number of selected categories
        await element(by.id('genre.1')).tap();
        await expect(element(by.id('categoryModalView'))).toBeVisible();

        await element(by.id('category.1')).tap();
        await element(by.id('category.2')).tap();
        await element(by.id('category.3')).tap();

        await element(by.id('closeModalView')).tap();
        await element(by.id('confirmCategories')).tap();

        await element(by.id('destination.1.490')).tap();
    })
});