$(document).ready(async function () {
    await fillMyProfileFields();
    await fillMyProductsFields();
    configureButtons();

    async function fillMyProfileFields() {
        const wrapperDetails = $("#shop-details");
        try {
            const shop = await shopFacade.getByUserId();
            setImageProfile(shop);
            const htmlDetails =
                (shop.comercialPhone ? UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.COMERCIAL_PHONE, shop.comercialPhone) : "") +
                (shop.instagram ? UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.INSTAGRAM, shop.instagram) : "") +
                (shop.facebook ? UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.FACEBOOK, shop.facebook) : "") +
                (shop.sales ? UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.SALES, shop.sales) : "") +
                (shop.incomeLastMonth ? UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.INCOME_LAST_MONTH, shop.incomeLastMonth) : "") +
                (shop.incomeCurrentMonth ? UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.INCOME_CURRENT_MONTH, shop.incomeCurrentMonth) : "");
            wrapperDetails.html(htmlDetails);
        } catch (error) {
            UTIL.showToast(UTIL.errorHandler(error));
            UTIL.redirectTo(CONSTANTS.SITE.PAGES.LOGIN);
        }
    }

    async function fillMyProductsFields() {
        const wrapperDetails = $("#my-products");
        try {
            let htmlDetails = "";
            const products = await productFacade.getProductList();
            for (const product of products) {
                htmlDetails += UTIL.domRender.getCardProductDetail(product.name, product.description, product.price, product.image1 ?? product.image2 ?? "./src/images/default-product.jpg");
            }

            wrapperDetails.html(htmlDetails);
        } catch (error) {
            UTIL.showToast(UTIL.errorHandler(error));
            UTIL.redirectTo(CONSTANTS.SITE.PAGES.LOGIN);
        }
    }

    async function configureButtons() {
        $('#btn-edit-informations').on('click', function () {
            UTIL.redirectTo(CONSTANTS.SITE.PAGES.EDIT_USER, 0);
        });
    }

    async function setImageProfile(shop) {
        const imgProfile = document.getElementById('img-banner');
        imgProfile.src = shop.banner != null && shop.banner != "" ? shop.banner : "./src/images/default-shop.jpg";
    };
});
