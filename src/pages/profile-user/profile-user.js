$(document).ready(async function () {
  await fillProfileUser();
  configureButtons();

  async function fillProfileUser() {
    const wrapperDetails = $("#user-details");
    try {
      const user = await loadUserData();
      setImageProfile(user);
      const htmlDetails =
        UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.NAME, user.name) +
        UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.TELEPHONE, user.telephone) +
        UTIL.domRender.getHtmlDetail(CONSTANTS.LABELS.EMAIL, user.email);
      wrapperDetails.html(htmlDetails);
    } catch (error) {
      UTIL.showToast(UTIL.errorHandler(error));
      UTIL.redirectTo(CONSTANTS.SITE.PAGES.LOGIN);
    }
  }

  async function configureButtons() {
    try {
      $('#btn-edit-informations').on('click', function () {
        UTIL.redirectTo(CONSTANTS.SITE.PAGES.EDIT_USER, 0);
      });

      const has = await hasShopUser();
      if (has) {
        $('.btn-shop').html(CONSTANTS.LABELS.MY_SHOP);
        $('.btn-shop').attr('href', CONSTANTS.SITE.PAGES.MY_SHOP + ".html");
      }
    } catch (error) {
      UTIL.showToast(UTIL.errorHandler(error));
      UTIL.redirectTo(CONSTANTS.SITE.PAGES.LOGIN);
    }
  }

  async function hasShopUser() {
    try {
      return await shopFacade.hasUserShop();
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      return await firebaseDatabase.loadUserData();
    } catch (error) {
      throw error;
    }
  }

  async function setImageProfile(user) {
    const imgProfile = document.getElementById('img-profile');
    let userProfileImg = "./src/images/default-avatar.jpg";
    imgProfile.src = user.profile ?? userProfileImg;
  };
});
