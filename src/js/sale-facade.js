const saleFacade = (function () {
    const _saleRef = "sale";
    const _salePropertiesInDatabase = {
        _idUser: "_idUser",
        _idShop: "_idShop",
        _idProduct: "_idProduct",
        sale_status: "sale_status",
        quantity: "quantity",
        unitaryPrice: "unitaryPrice",
    };

    const insert = async function (_idShop, _idUser, _idProduct, quantity, unitaryPrice) {
        try {
            const data = {
                [_salePropertiesInDatabase._idShop]: _idShop,
                [_salePropertiesInDatabase._idUser]: _idUser,
                [_salePropertiesInDatabase._idProduct]: _idProduct,
                [_salePropertiesInDatabase.sale_status]: 1,
                [_salePropertiesInDatabase.quantity]: quantity,
                [_salePropertiesInDatabase.unitaryPrice]: unitaryPrice,
            };
            const id = await firebaseDatabase.insertWithRandomGuid(_saleRef, data);
            return {
                id, ...data
            };
        } catch (error) {
            throw error;
        }
    };

    return {
        insert
    };
})()