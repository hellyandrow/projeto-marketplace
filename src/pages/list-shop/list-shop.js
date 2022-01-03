$(document).ready(function () {
    fillShops();
    async function fillShops() {
        const wrapperDetails = $("#shops");
        try {
            const shops = await shopFacade.listByCategory(UTIL.getParamUrl(CONSTANTS.URL_PARAMS.CATEGORY_ID));
            const htmlDetails = shops.reduce((acc, shop) => {
                return acc + UTIL.domRender.getCardShopDetailWithLink(shop.id, shop.name, shop.comercialPhone, shop.image1 ?? shop.image2 ?? "./src/images/default-product.jpg");
            }, '');

            wrapperDetails.html(htmlDetails);
        } catch (error) {
            UTIL.showToast(UTIL.errorHandler(error));
        }
    }

});
