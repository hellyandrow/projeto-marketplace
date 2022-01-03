const categoryFactory = (function () {
    const _propertiesInDatabase = ['name', 'id'];

    function create(entity) {
        const invalidProperty = Object.keys(entity).filter(k => !_propertiesInDatabase.includes(k));
        if (invalidProperty.length > 0) {
            console.error("[createCategory] Invalid property: " + invalidProperty);
        }
        return entity;
    }

    return {
        create
    };
})()