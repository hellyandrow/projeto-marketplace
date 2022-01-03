$(document).ready(async function () {
    var currentSelectedImg = null;

    const inputs = getInputs();
    configureForm();

    await fillFormUser();

    async function fillFormUser() {
        try {
            const user = await firebaseDatabase.loadUserData();
            setImageProfile(user);
            inputs.name.val(user.name);
            inputs.email.val(user.email);
            inputs.telephone.val(user.telephone);
            inputs.state.val(user.state);
        } catch (error) {
            UTIL.showToastTreatError(error);
            UTIL.redirectTo(CONSTANTS.SITE.PAGES.HOME);
        }
    }

    function setImageProfile(user) {
        if (user.profile) {
            const imgProfile = document.getElementById('img-profile');
            imgProfile.src = user.profile;
            $("#button-label-image").css("display", "none");
        }
    };

    function configureForm() {
        $("#form-signup").on("submit", async function (event) {
            event.preventDefault();
            UTIL.toggleDisableForm();
            try {
                await editUserDatabase();
                await UTIL.showToast(MESSAGES.GLOBAL.SUCCESSFULLY_UPDATE, ENUMERATIONS.COLORS.SUCCESS);
            } catch (error) {
                UTIL.showToastTreatError(error);
            } finally {
                UTIL.toggleDisableForm();
            }
        });
    }

    async function editUserDatabase() {
        const user = await firebaseDatabase.loadUserData();

        const userData = await getFormData(user);
        const imgData = await getImagesData(user);

        const updateData = Object.assign(userData, imgData);
        const userUid = await firebaseAuth.getUid();
        const ref = `users/${userUid}`;

        await firebaseDatabase.updateData(updateData, ref);
        await setLocalStorage();
    }

    async function getFormData(user) {
        return {
            ...user,
            name: inputs.name.val(),
            telephone: inputs.telephone.val(),
            state: inputs.state.val(),
        };
    }

    function getInputs() {
        return {
            name: $("#inputName"),
            email: $("#inputEmail"),
            telephone: $("#inputTelephone"),
            state: $("#selectState")
        };
    }

    async function setLocalStorage() {
        const userUid = await firebaseAuth.getUid();
        if (userUid == null) {
            throw { code: "USER_NOT_LOGGED" };
        }

        const ref = `users/${userUid}`;
        const data = await firebaseDatabase.readData(ref);
        if (!data) {
            throw { code: "ERROR_ON_LOAD_DATA" };
        }

        localStorage.setItem("userUid", userUid);
        localStorage.setItem("userData", JSON.stringify(data));

    }

    $("#input-profile-pic").on("change", loadImage);

    async function loadImage(event) {
        try {
            if (event.target.files.length === 0) return false;

            if (!/^image\//.test(event.target.files[0].type))
                throw { code: "FILE_SELECTED_MUST_BE_IMAGE" };

            currentSelectedImg = event.target.files[0];

            const imgProfile = document.getElementById('img-profile');
            imgProfile.src = URL.createObjectURL(currentSelectedImg);
            imgProfile.onload = function () {
                URL.revokeObjectURL(imgProfile.src);
            };
            $("#button-label-image").css("display", "none");
        } catch (error) {
            UTIL.showToastTreatError(error);
        }
    }

    async function getImagesData(user) {
        if (!currentSelectedImg) {
            return user.images;
        }

        const metadata = {
            cacheControl: 'public,max-age=300',
            contentType: 'image/jpeg',
            name: "profile-pic"
        };

        const userUid = await firebaseAuth.getUid();
        const refImg = `${userUid}/${metadata.name}`;

        const fullPathImage = await firebaseStorage.upload(refImg, currentSelectedImg, metadata);
        if (!fullPathImage) {
            throw { code: "ERROR_ON_UPLOAD_FILE" };
        }

        if (user.images) {
            user.images.profile = fullPathImage;
        } else {
            user.images = { profile: fullPathImage };
        }

        return user.images;
    }
});
