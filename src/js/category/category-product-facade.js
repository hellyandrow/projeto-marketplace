const categoryProductFacade = (function () {
    const _categoryProductRef = "categoryProduct";

    async function getByName(name) {
        try {
            const entity = await firebaseDatabase.getByInMemory(_categoryProductRef, "name", name);
            if (entity) {
                return categoryFactory.create(entity);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    async function insert(name) {
        try {
            const id = await firebaseDatabase.insertWithRandomGuid(_categoryProductRef, {
                name: name.toCapitalize()
            });
            return categoryFactory.create({
                name, id
            })
        } catch (error) {
            throw error;
        }
    }

    async function list() {
        try {
            return await firebaseDatabase.list(_categoryProductRef);
        } catch (error) {
            throw error;
        }
    }

    return {
        getByName,
        insert,
        list
    }

})()


