const createTest1 = () => {
    describe('Basic behavior test through the create event screens', () => {
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

        /*
            There's a chance the following test will need to be modified based on API results.

            genre.[genre_id]
            category.[category_id]
        */
        it('Select some categories from genres', async () => { // TODO: change number of selected categories
            await element(by.id('genre.1')).tap();
            await expect(element(by.id('categoryModalView'))).toBeVisible();
            await element(by.id('category.1')).tap();
            await element(by.id('closeModalView')).tap();

            await element(by.id('genre.2')).tap();
            await expect(element(by.id('categoryModalView'))).toBeVisible();
            await element(by.id('category.21')).tap();
            await element(by.id('closeModalView')).tap();

            await element(by.id('genre.3')).tap();
            await expect(element(by.id('categoryModalView'))).toBeVisible();
            await element(by.id('category.38')).tap();
            await element(by.id('closeModalView')).tap();

            await element(by.id('genre.4')).tap();
            await expect(element(by.id('categoryModalView'))).toBeVisible();
            await element(by.id('category.47')).tap();
            await element(by.id('closeModalView')).tap();

            await element(by.id('genre.6')).tap();
            await expect(element(by.id('categoryModalView'))).toBeVisible();
            await element(by.id('category.72')).tap();
            await element(by.id('closeModalView')).tap();

            await element(by.id('genre.5')).tap();
            await expect(element(by.id('categoryModalView'))).toBeVisible();
            await element(by.id('category.60')).tap();
            await element(by.id('closeModalView')).tap();

            await element(by.id('confirmCategories')).tap();
            await expect(element(by.id('selectDestinationsScreenView'))).toBeVisible();
        })

        /*
            There's a chance the following test will need to be modified based on API results.

            destination.[category_id].[destination_id]
            category.[category_id].scrollView -> horizontal scrollview for each category
        */
        it('Select destinations', async () => {
            await element(by.id('destination.1.490')).tap();
            await element(by.id('category.1.scrollView')).scrollTo('right');
            await element(by.id('destination.1.496')).tap();

            await element(by.id('destination.38.587')).tap();
            await element(by.id('category.38.scrollView')).scrollTo('right');
            await element(by.id('destination.38.591')).tap();

            await element(by.id('selectDestinationsMainScroll')).scrollTo('bottom');

            await element(by.id('destination.72.582')).tap();
            await element(by.id('category.72.scrollView')).scrollTo('right');
            await element(by.id('destination.72.586')).tap();

            await element(by.id('destination.60.593')).tap();

            await element(by.id('confirmDestinations')).tap();
        })

        it('Screen should be finalize screen', async () => {
            await expect(element(by.id('finalizeScreenView'))).toBeVisible();
            
            await element(by.id('eventTitleText')).clearText();
            await element(by.id('eventTitleText')).typeText("AutomatedTest1");

            await element(by.id('saveEventButton')).tap();
        })

        it('Screen should be on library screen', async () => {
            await expect(element(by.id('libraryScreenView'))).toBeVisible();
        })
    });
}

export default createTest1;