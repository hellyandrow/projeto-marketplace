const categoryShopFacade = (function () {
    const _categoryShopRef = "categories";

    async function getByName(name) {
        try {
            return await firebaseDatabase.getByInMemory(_categoryShopRef, "name", name);
        } catch (error) {
            throw error;
        }
    }
    async function getById(id) {
        return await firebaseDatabase.getByInMemory(_categoryShopRef, "id", id);
    }

    // async function insert(name) {
    //     try {
    //         const id = await firebaseDatabase.insertWithRandomGuid(_categoryShopRef, {
    //             name: name.toCapitalize()
    //         });
    //         return categoryFactory.create({
    //             name, id
    //         })
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async function list() {
        try {
            return CONSTANTS.CATEGORIES.map((c, index) => categoryFactory.create({
                id: index,
                name: c
            }));
        } catch (error) {
            throw error;
        }
    }

    return {
        getByName,
        // insert,
        list,
        getById
    };

})();


