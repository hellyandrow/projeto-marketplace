'use strict';

$(document).ready(async function () {
    var currentSelectedImgs = [];

    const inputs = getInputs();
    configureForm();

    function configureForm() {
        $("#form-create-shop").on("submit", onSubmitCreate);
        categoryProductFacade.list().then(categories => {
            $('#selectCategoryProduct').html(UTIL.domRender.getHtmlOptionsSelect(categories.map(c => c.name), CONSTANTS.LABELS.SELECT_CATEGORY))
        })
    }

    async function onSubmitCreate(event) {
        event.preventDefault();
        UTIL.toggleDisableForm();
        try {
            validateInputs();

            const product = await insertProduct();
            await updateProductWithImage(product.id, product._idShop, product._idCategory);

            await UTIL.showToast(MESSAGES.GLOBAL.SUCCESSFULLY_UPDATE, ENUMERATIONS.COLORS.SUCCESS);

            UTIL.redirectTo(CONSTANTS.SITE.PAGES.MY_SHOP);
        } catch (error) {
            UTIL.showToast(UTIL.errorHandler(error));
        } finally {
            UTIL.toggleDisableForm();
        }
    }
    function validateInputs() {
        if (getValueCategory() == null) {
            throw CONSTANTS.LABELS.REPORT_PRODUCT_CATEGORY;
        }
    }

    async function insertProduct() {
        const shop = await shopFacade.getByUserId();
        const product = await productFacade.insert(
            shop.id,
            inputs.name.val(),
            inputs.description.val(),
            inputs.price.val(),
            getValueCategory()
        );
        return product
    }

    async function updateProductWithImage(productId, shopId, categoryId) {
        const productImages = await getProductImages(productId);
        await productFacade.update(
            productId,
            shopId,
            inputs.name.val(),
            inputs.description.val(),
            inputs.price.val(),
            productImages[0],
            productImages[1],
            categoryId
        );
    }

    function getValueCategory() {
        return inputs.customCategory.val() || inputs.category.val();
    }

    function getInputs() {
        return {
            name: $("#inputName"),
            description: $("#inputDescription"),
            price: $("#inputPrice"),
            category: $("#selectCategory"),
            customCategory: $("#inputCustomCategory")
        };
    }

    $("#input-picker-image1").on("change", (event) => loadBanner(event, 1));
    $("#input-picker-image2").on("change", (event) => loadBanner(event, 2));

    async function loadBanner(event, ref) {
        try {
            if (event.target.files.length === 0) return false;

            if (!/^image\//.test(event.target.files[0].type))
                throw { code: "FILE_SELECTED_MUST_BE_IMAGE" };

            currentSelectedImgs[ref - 1] = event.target.files[0];

            const imgBanner = document.getElementById(`img-product${ref}`);
            imgBanner.src = URL.createObjectURL(currentSelectedImgs[ref - 1]);
            imgBanner.onload = function () {
                URL.revokeObjectURL(imgBanner.src);
            };
            $(`#button-picker-image${ref}`).css("display", "none");
        } catch (error) {
            UTIL.showToastTreatError(error);
        }
    }

    async function getProductImages(productId) {
        const fullPaths = [];
        if (!currentSelectedImgs) {
            return fullPaths;
        }

        const metadata = {
            cacheControl: 'public,max-age=300',
            contentType: 'image/jpeg',
            name: "image-product"
        };

        for (const [index, image] of currentSelectedImgs.entries()) {

            const refImg = `products/${productId}/${metadata.name}-${index + 1}`;

            const imagePath = await firebaseStorage.upload(refImg, image, metadata);
            if (!imagePath) {
                throw { code: "ERROR_ON_UPLOAD_FILE" };
            }
            fullPaths[index] = imagePath;
        }
        return fullPaths;
    }
});
