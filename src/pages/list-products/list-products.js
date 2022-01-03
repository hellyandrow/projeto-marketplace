$(document).ready(function () {
    fillProducts();
    async function fillProducts() {
        const wrapperDetails = $("#products");
        try {
            const products = await productFacade.listByCategory(UTIL.getParamUrl(CONSTANTS.URL_PARAMS.CATEGORY_ID));
            const htmlDetails = products.reduce((acc, product) => {
                return acc + UTIL.domRender.getCardProductDetailWithLink(product.id, product.name, product.description, product.price, product.image1 ?? product.image2 ?? "./src/images/default-product.jpg");
            }, '')

            wrapperDetails.html(htmlDetails);
        } catch (error) {
            UTIL.showToast(UTIL.errorHandler(error));
        }
    }

});
