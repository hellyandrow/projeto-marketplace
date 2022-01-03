const UTIL = {
  showToastTreatError: async function (message) {
    this.showToast(this.errorHandler(message));
  },

  showToast: async function (
    message = "",
    type = ENUMERATIONS.COLORS.ERROR,
    timeout = 3000
  ) {
    const className = `md-toast-${type}`;

    $("#toast").addClass(className);
    $("#toast").toast("show");
    $("#toastBody").html(message);

    setTimeout(function () {
      $("#toast").toast("hide");
      $("#toast").removeClass(className);
    }, timeout);
  },

  redirectTo: function (page, timeout = 3000) {
    setTimeout(function () {
      window.location.assign(`${page}.html`);
    }, timeout);
  },

  toggleDisableForm: function (idForm) {
    const isDisabled = $("form :input").prop("disabled");
    if (idForm) {
      $(`#${idForm} :input`).prop("disabled", !isDisabled);
      return;
    }
    $("form :input").prop("disabled", !isDisabled);
  },

  errorHandler(error) {
    console.log("error:", error);
    if (error && error.code) {
      return MESSAGES.FIREBASE[error.code]
        ?? MESSAGES.GLOBAL[error.code]
        ?? MESSAGES.GLOBAL.UNKNOWN_ERROR;
    }
    return error ?? MESSAGES.GLOBAL.UNKNOWN_ERROR;
  },

  getParamUrl: function (key) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params[key];
  },

  orderProductsByStateUser: async function (list) {
    const user = await firebaseDatabase.loadUserData();
    const stateUser = user.state?.toUpperCase();
    const onlyitemsStateUser = [];
    const otherItems = [];
    for (const item of list) {
      if (item.shop.state?.toUpperCase() === stateUser) {
        onlyitemsStateUser.push(item);
      } else {
        otherItems.push(item);
      }
    }
    return [...onlyitemsStateUser, ...otherItems];
  },
  orderByStateUser: async function (list) {
    const user = await firebaseDatabase.loadUserData();
    const stateUser = user.state?.toUpperCase();
    const onlyShopsStateUser = [];
    const otherShops = [];
    for (const shop of list) {
      if (shop.state?.toUpperCase() === stateUser) {
        onlyShopsStateUser.push(shop);
      } else {
        otherShops.push(shop);
      }
    }
    return [...onlyShopsStateUser, ...otherShops];
  },

  sendWhatsappMessage: function (phone, text) {
    try {
      const baseURI = this.getWhatsappBaseURL();
      window.open(`${baseURI}?phone=${phone}&text=${text}`, "_blank");
      //const baseURI = `whatsapp:;//send/?1=pt_BR&phone=${phone}&text=${text}`;
      //window.location.assign(baseURI);
    } catch (error) {
      console.log(error);
    }
  },
  getWhatsappBaseURL: function () {
    if (this.isMobile()) {
      return "https://api.whatsapp.com/send";
    }
    return "https://web.whatsapp.com/send";
  },

  isMobile: function () {
    let isMobile = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return isMobile;
  },

  domRender: {
    getHtmlDetail: function (titleDetail, text) {
      return `
            <span class="details__title-details">${titleDetail}:</span>
            <p class="details__text-details">${text}</p>
          `;
    },
    getCardProductDetail: function (name, description, price, image) {
      return `
      <div class="col-md-6 my-1">
          <div class="card-deck">
              <div class="card">
                  <div class="card-body row">
                      <div class="col-md-4 min-img-product-container">
                          <img id="img-banner" width="100%" height="100%" class="img-banner" src="${image}" />
                      </div>
                      <div class="col-md-8">
                          <h5 class="card-title">Nome: ${name}</h5>
                          <p class="card-text">Descrição: ${description}</p>
                          <p class="card-text"><small class="text-muted">Valor: R$ ${price}</small>
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
    },
    getCardProductDetailWithLink: function (id, name, description, price, image) {
      return `
      <a class="col-md-6 my-1" href="${CONSTANTS.SITE.PAGES.PROFILE_PRODUCT}.html?${CONSTANTS.URL_PARAMS.PRODUCT_ID}=${id}">
          <div class="card-deck">
              <div class="card">
                  <div class="card-body row">
                      <div class="col-md-4 min-img-product-container">
                          <img id="img-banner" width="100%" height="100%" class="img-banner" src="${image}" />
                      </div>
                      <div class="col-md-8">
                          <h5 class="card-title">Nome: ${name}</h5>
                          <p class="card-text">Descrição: ${description}</p>
                          <p class="card-text"><small class="text-muted">Valor: R$ ${price}</small>
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </a>`;
    },
    getCardShopDetailWithLink: function (id, name, commercialPhone, image) {
      return `
      <a class="col-md-6 my-1" href="${CONSTANTS.SITE.PAGES.PROFILE_SHOP}.html?${CONSTANTS.URL_PARAMS.SHOP_ID}=${id}">
          <div class="card-deck">
              <div class="card">
                  <div class="card-body row">
                      <div class="col-md-4 min-img-product-container">
                          <img id="img-banner" width="100%" height="100%" class="img-banner" src="${image}" />
                      </div>
                      <div class="col-md-8">
                          <h5 class="card-title">Nome: ${name}</h5>
                          <p class="card-text"><small class="text-muted">Telefone comercial: ${commercialPhone}</small>
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </a>`;
    },
    getHtmlOptionsSelect: function (options, initialOption) {
      const firstOption = `<option selected disabled>${initialOption}</option>`;
      return firstOption + options.reduce((accumulator, option) => `${accumulator}<option value="${option}">${option}</option>`, '');
    },
  },
};
