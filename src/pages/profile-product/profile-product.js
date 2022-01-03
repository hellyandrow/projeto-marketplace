$(document).ready(async function () {
    var product = {};
    var shop = {};
    var userId = {};

    await loadEntities();
    await fillProfileProduct();
    setWhatsappFields();

    async function loadEntities() {
        try {
            product = await loadProductProfile(getParamUrl(CONSTANTS.URL_PARAMS.PRODUCT_ID));
            shop = await shopFacade.getShop(product._idShop);
            userId = await firebaseAuth.getUid();
        } catch (error) {
            UTIL.showToast(UTIL.errorHandler(error));
            UTIL.redirectTo(CONSTANTS.SITE.PAGES.LOGIN);
        }
    }

    async function fillProfileProduct() {
        const wrapperDetails = $("#product-details");
        try {
            setProductImage(product);
            const htmlDetails =
                UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.NAME, product.name) +
                UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.PRICE, "R$ " + product.price) +
                UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.DESCRIPTION, product.description);
            wrapperDetails.html(htmlDetails);
        } catch (error) {
            UTIL.showToast(UTIL.errorHandler(error));
            UTIL.redirectTo(CONSTANTS.SITE.PAGES.LOGIN);
        }
    }

    async function loadProductProfile(productId) {
        return await productFacade.getProduct(productId);
    }

    $("#checkboxSendWhatsapp").on("change", setWhatsappFields);

    function setWhatsappFields() {
        const sendWhatsappIsChecked = $("#checkboxSendWhatsapp").is(':checked');
        if (sendWhatsappIsChecked) {
            $("#message").attr("required", true);
            $("#messageInput").show();
        } else {
            $("#message").attr("required", false);
            $("#messageInput").hide();
        }
    }

    $("#quantity").on("change", setModalValues);

    function setModalValues() {
        const quantity = $("#quantity").val();
        if (quantity && quantity > 0) {
            const finalValue = (parseInt(quantity) * (product.price ? parseFloat(product.price) : 0)) ?? 0;
            $("#final-value").val(`R$ ${finalValue}`);
            const message = `Olá, estou interessado no seu produto '${product.name}'. Gostaria de fazer o pedido de ${quantity} unidade(s)!`;
            $("#message").val(message);
        }
    }

    function getParamUrl(param) {
        const params = new URLSearchParams(window.location.search);
        return params.get(param);
    }

    async function setProductImage(product) {
        const imgProduct = document.getElementById('img-product');
        imgProduct.src = product.image1 ?? product.image2 ?? "./src/images/default-product.jpg";
    };

    $("#form-request-product-sale").on("submit", async function (event) {
        event.preventDefault();
        UTIL.toggleDisableForm();
        try {
            const quantity = $("#quantity").val() ?? 0;
            await saleFacade.insert(shop.id, userId, product.id, quantity, product.price);

            const sendWhatsappIsChecked = $("#checkboxSendWhatsapp").is(':checked');
            if (sendWhatsappIsChecked) {
                const message = $("#message").val();
                UTIL.sendWhatsappMessage(shop.comercialPhone, message);
            }
            UTIL.toggleDisableForm();
            $('#form-request-product-sale').trigger("reset");
            $('#close-modal').click();
            setWhatsappFields();
            await UTIL.showToast(MESSAGES.GLOBAL.SUCCESSFULLY_SALE_CREATED, ENUMERATIONS.COLORS.SUCCESS);
        } catch (error) {
            UTIL.showToastTreatError(error);
        }
    });
});
