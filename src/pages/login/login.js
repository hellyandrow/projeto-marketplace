$(document).ready(function () {

  checkUserAlreadyLogged();

  async function checkUserAlreadyLogged() {
    UTIL.toggleDisableForm();
    try {
      if (await firebaseAuth.getUid()) {
        await setLocalStorage();
        await UTIL.showToast(MESSAGES.GLOBAL.USER_ALREADY_LOGGED, ENUMERATIONS.COLORS.SUCCESS);
        UTIL.redirectTo(CONSTANTS.SITE.PAGES.HOME);
      }
    } catch (error) {
      UTIL.showToast(UTIL.errorHandler(error));
    } finally {
      UTIL.toggleDisableForm();
    }
  }

  $("#checkboxShowHidePassword").on("change", onChangeCheckboxPassword);

  function onChangeCheckboxPassword(event) {
    const checkbox = event.target;
    const isChecked = $(checkbox).is(":checked");
    $("#inputPassword").attr("type", isChecked ? "text" : "password");
  }

  $("#form-login").on("submit", onSubmitFormLogin);

  async function onSubmitFormLogin(event) {
    event.preventDefault();
    UTIL.toggleDisableForm();

    const inputValues = {
      email: $("#inputEmail").val(),
      password: $("#inputPassword").val(),
    };

    try {
      await login(inputValues.email, inputValues.password);
      await setLocalStorage();

      await UTIL.showToast(MESSAGES.GLOBAL.SUCCESSFULLY_LOGIN, ENUMERATIONS.COLORS.SUCCESS);
      UTIL.redirectTo(CONSTANTS.SITE.PAGES.HOME);
    } catch (error) {
      UTIL.showToast(UTIL.errorHandler(error));
    } finally {
      UTIL.toggleDisableForm();
    }
  }

  async function login(email, password) {
    try {
      return await firebaseAuth.loginWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  }

  async function setLocalStorage() {
    try {
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
    } catch (error) {
      throw error;
    }
  }
});
