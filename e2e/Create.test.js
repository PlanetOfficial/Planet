describe('Behavior test through the create event screens', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: false });
    });

    it ('render map screen after clicking create button', async () => {
        await element(by.id('Create')).tap();
        await expect(element(by.id('mapSelectionScreenView'))).toBeVisible();
    })
});