const _shopRef = "shop";
const _shopPropertiesInDatabase = {
    name: "name",
    cnpj: "cnpj",
    comercialPhone: "comercialPhone",
    state: "state",
    instagram: "instagram",
    facebook: "facebook",
    _idUser: "_idUser",
    _idShop: "_idShop",
    _idCategory: "_idCategory",
    banner: "banner",
    access: "access"
};
const shopFacade = {
    insert: async function (name, cnpj, comercialPhone, state, instagram, facebook, categoryName) {
        try {
            let category = await categoryShopFacade.getByName(categoryName);
            if (!category) {
                throw MESSAGES.GLOBAL.CATEGORY_NOT_FOUND;
            }

            const data = {
                [_shopPropertiesInDatabase.name]: name || "-",
                [_shopPropertiesInDatabase.cnpj]: cnpj || "-",
                [_shopPropertiesInDatabase.comercialPhone]: comercialPhone || "-",
                [_shopPropertiesInDatabase.state]: state || "-",
                [_shopPropertiesInDatabase.instagram]: instagram || "-",
                [_shopPropertiesInDatabase.facebook]: facebook || "-",
                [_shopPropertiesInDatabase._idUser]: await getUserId(),
                [_shopPropertiesInDatabase.banner]: "",
                [_shopPropertiesInDatabase._idCategory]: category.id || "",
                [_shopPropertiesInDatabase.access]: 0
            };

            await firebaseDatabase.insertWithRandomGuid(_shopRef, data);
        } catch (error) {
            throw error;
        }
    },

    hasUserShop: async function () {
        try {
            return !!(await firebaseDatabase.getBy(_shopRef, _shopPropertiesInDatabase._idUser, await getUserId()));
        } catch (error) {
            throw error;
        }
    },

    getShop: async function (shopId) {
        try {
            const entity = await firebaseDatabase.readData(`${_shopRef}/${shopId}`);
            const category = await categoryShopFacade.getById(entity[_shopPropertiesInDatabase._idCategory]);
            return { ...entity, category };
        } catch (error) {
            throw error;
        }
    },

    getByUserId: async function () {
        try {
            const entity = await firebaseDatabase.getBy(_shopRef, _shopPropertiesInDatabase._idUser, await getUserId());
            return {
                ...entity,
                incomeCurrentMonth: await calculateIncomeCurrentMonth(),
                incomeLastMonth: await calculateIncomeLastMonth(),
                sales: await calculateSales(),
            };
        } catch (error) {
            throw error;
        }
    },

    list: async function () {
        try {
            const entities = await firebaseDatabase.list(_shopRef);
            return UTIL.orderByStateUser(entities);
        } catch (error) {
            throw error;
        }
    },

    listContain: async function (str) {
        // na verdade isso deveria ser listByName
        try {
            return await firebaseDatabase.listContains(_shopRef, _shopPropertiesInDatabase.name, str);
        } catch (error) {
            throw error;
        }
    },

    listByCategory: async function (categoryId) {
        try {
            const entities = await firebaseDatabase.listByInMemory(_shopRef, _shopPropertiesInDatabase._idCategory, categoryId);
            return UTIL.orderByStateUser(entities);
        } catch (error) {
            throw error;
        }
    },

    update: async function (name, cnpj, comercialPhone, state, instagram, facebook, bannerPath, categoryName, access) {
        try {
            let category = await categoryShopFacade.getByName(categoryName);
            if (!category) {
                throw MESSAGES.GLOBAL.CATEGORY_NOT_FOUND;
            }
            const { id } = await this.getByUserId();
            const data = {
                [_shopPropertiesInDatabase.name]: name || "-",
                [_shopPropertiesInDatabase.cnpj]: cnpj || "-",
                [_shopPropertiesInDatabase.comercialPhone]: comercialPhone || "-",
                [_shopPropertiesInDatabase.state]: state || "-",
                [_shopPropertiesInDatabase.instagram]: instagram || "-",
                [_shopPropertiesInDatabase.facebook]: facebook || "-",
                [_shopPropertiesInDatabase.banner]: bannerPath,
                [_shopPropertiesInDatabase._idCategory]: category.id || "",
                [_shopPropertiesInDatabase.access]: access || 0
            };

            await firebaseDatabase.updateData(data, `${_shopRef}/${id}`);
        } catch (error) {
            throw error;
        }
    },

    updateAccess: async function (id) {
        try {
            const entity = await this.getShop(id);
            const newAccess = (entity.access ?? 0) + 1;
            await firebaseDatabase.updateData({
                access: newAccess
            }, `${_shopRef}/${id}`);
        } catch (error) {
            throw error;
        }
    }

};

async function getUserId() {
    const userUid = await firebaseAuth.getUid();
    if (!userUid) {
        throw { code: "USER_NOT_LOGGED" };
    }
    return userUid;
}

async function calculateIncomeCurrentMonth() {
    return 0;
}
async function calculateIncomeLastMonth() {
    return 0;
}

async function calculateSales() {
    return 0;
}
