$(document).ready(async function () {
    const inputs = getInputs();
    configureForm();

    await fillForm();

    async function fillForm() {
        UTIL.toggleDisableForm();
        try {
            const shop = await shopFacade.getByUserId();
            setBanner(shop);
            inputs.name.val(shop.name);
            inputs.cnpj.val(shop.cnpj);
            inputs.comercialPhone.val(shop.comercialPhone);
            inputs.instagram.val(shop.instagram);
            inputs.facebook.val(shop.facebook);
            inputs.state.val(shop.state);
            inputs.category.val(shop._idCategory);

        } catch (error) {
            UTIL.showToast(UTIL.errorHandler(error));
            UTIL.redirectTo(CONSTANTS.SITE.PAGES.HOME);
        } finally {
            UTIL.toggleDisableForm();
        }
    }

    function configureForm() {
        $("#form-edit-shop").on("submit", async function (event) {
            event.preventDefault();
            UTIL.toggleDisableForm();
            try {
                const shop = await shopFacade.getByUserId();
                const bannerPath = await getBannerShop(shop);

                await shopFacade.update(
                    inputs.name.val(),
                    inputs.cnpj.val(),
                    inputs.comercialPhone.val(),
                    inputs.state.val(),
                    inputs.instagram.val(),
                    inputs.facebook.val(),
                    bannerPath,
                    inputs.category.val()
                );
                await UTIL.showToast(MESSAGES.GLOBAL.SUCCESSFULLY_UPDATE, ENUMERATIONS.COLORS.SUCCESS);
                UTIL.redirectTo(CONSTANTS.SITE.PAGES.MY_SHOP);
            } catch (error) {
                UTIL.showToast(UTIL.errorHandler(error));
            } finally {
                UTIL.toggleDisableForm();
            }
        });
    }

    function setBanner(shop) {
        if (shop.banner != null && shop.banner != "") {
            const imgBanner = document.getElementById('img-banner');
            imgBanner.src = shop.banner;
            $("#button-label-image").css("display", "none");
        }
    };

    function getInputs() {
        return {
            name: $("#inputName"),
            cnpj: $("#inputCnpj"),
            comercialPhone: $("#inputComercialPhone"),
            state: $("#selectState"),
            instagram: $("#inputInstagram"),
            facebook: $("#inputFacebook"),
            category: $("#selectCategory"),
        };
    }

    $("#input-banner-pic").on("change", loadBanner);

    async function loadBanner(event) {
        try {
            if (event.target.files.length === 0) return false;

            if (!/^image\//.test(event.target.files[0].type))
                throw { code: "FILE_SELECTED_MUST_BE_IMAGE" };

            currentSelectedImg = event.target.files[0];

            const imgBanner = document.getElementById('img-banner');
            imgBanner.src = URL.createObjectURL(currentSelectedImg);
            imgBanner.onload = function () {
                URL.revokeObjectURL(imgBanner.src);
            };
            $("#button-label-image").css("display", "none");
        } catch (error) {
            UTIL.showToastTreatError(error);
        }
    }

    async function getBannerShop(shop) {
        if (!currentSelectedImg) {
            return shop.images ? shop.images.banner : null;
        }

        const metadata = {
            cacheControl: 'public,max-age=300',
            contentType: 'image/jpeg',
            name: "banner-pic"
        };

        const refImg = `${shop.id}/${metadata.name}`;

        const fullPathImage = await firebaseStorage.upload(refImg, currentSelectedImg, metadata);
        if (!fullPathImage) {
            throw { code: "ERROR_ON_UPLOAD_FILE" };
        }

        return fullPathImage;
    }
});
