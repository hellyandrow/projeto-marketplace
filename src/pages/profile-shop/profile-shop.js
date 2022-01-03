$(document).ready(function () {
    const shopId = UTIL.getParamUrl(CONSTANTS.URL_PARAMS.SHOP_ID);
    fillProfileShop();
    countAccess();


    function countAccess() {
        shopFacade.updateAccess(shopId);
    }

    async function fillProfileShop() {
        const wrapperDetails = $('#shop-details');
        const wrapperItemsOffered = $('#shop-items-offered');
        const wrapperBanner = document.getElementById('shop-banner');
        const shopName = $('#shop-name');
        const shop = await loadShopProfile();
        const htmlDetails =
            UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.STATE, shop.state) +
            UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.COMERCIAL_PHONE, shop.comercialPhone);
        wrapperDetails.html(htmlDetails);
        wrapperBanner.src = shop.banner != null && shop.banner != "" ? shop.banner : "./src/images/default-shop.jpg";
        shopName.html(shop.name);
        const productHtmlDetails = await domRenderLocal.getHtmlItemsOffered(shop.id);
        wrapperItemsOffered.html(productHtmlDetails);
    }

    async function loadShopProfile() {
        return await shopFacade.getShop(shopId);
    }

    const domRenderLocal = {
        getHtmlBanner: function (imageUrl) {
            return `
                <img src="${imageUrl}" class="w-100 mb-2">
            `;
        },
        getHtmlItemsOffered: async function () {
            let htmlDetails = "";
            const products = await productFacade.getProductList(shopId);
            for (const product of products) {
                htmlDetails += UTIL.domRender.getCardProductDetail(product.name, product.description, product.price, product.image1 ?? product.image2 ?? "./src/images/default-product.jpg");
            }

            return htmlDetails;
        }
    };
});
