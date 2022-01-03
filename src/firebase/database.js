'use strict';

const firebaseDatabase = (() => {
    const database = firebase.database();

    const readData = (ref = "/") => {
        return new Promise((resolve, reject) => {
            database.ref(ref).on('value', (snapshot) => {
                if (snapshot.val) {
                    resolve({
                        id: snapshot.key,
                        ...snapshot.val()
                    });
                } else {
                    resolve(snapshot);
                }
            }, error => {
                reject(error);
            });
        });
    };

    const writeData = async (data = {}, ref = "/") => {
        return database.ref(ref).set(data);
    };

    const insertWithRandomGuid = async (ref, data) => {
        _checkProps(ref, data);
        return database.ref(ref).push(data).then(snap => snap.key, err => err);
    };

    const updateData = async (data = {}, ref = "/") => {
        return database.ref(ref).update(data);
    };

    const deleteData = async (ref = "/") => {
        return database.ref(ref).delete();
    };

    const loadUserData = () => {
        const userUid = localStorage.getItem("userUid");
        if (!userUid) {
            throw { code: "USER_NOT_LOGGED" };
        }

        const userData = localStorage.getItem("userData");
        if (!userData) {
            throw { code: "ERROR_ON_LOAD_DATA" };
        }
        return JSON.parse(userData);
    };

    const getBy = (ref = "/", by, equalTo) => {
        _checkProps(by, equalTo);
        return new Promise(async (resolve, reject) => {
            database.ref(ref).orderByChild(by).equalTo(equalTo).limitToFirst(1).on('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    resolve({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                resolve(null);
            }, error => {
                reject(error);
            });
        });
    };

    const getByInMemory = async (ref, by, equalTo) => {
        _checkProps(ref, by, equalTo);
        const entities = await list(ref);
        return entities.find(e => e[by]?.toUpperCase() === equalTo?.toUpperCase()) || null;
    };

    const getListBy = (ref = "/", by, equalTo) => {
        _checkProps(by, equalTo);
        return new Promise(async (resolve, reject) => {
            database.ref(ref).orderByChild(by).equalTo(equalTo).on('value', function (snapshot) {
                const list = [];
                snapshot.forEach(function (childSnapshot) {
                    list.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                resolve(list);
            }, error => {
                reject(error);
            });
        });
    };

    const listContains = (ref = "/", by, contains) => {
        return list(ref).then(items => {
            return items.filter(_item => _item[by] && _item[by].toLowerCase().indexOf(contains.toLowerCase()) != -1);
        }, err => err);
    };

    const listByInMemory = async (ref, by, equalTo) => {
        _checkProps(ref, by, equalTo);
        const entities = await list(ref);
        return entities.filter(e => e[by].toString().toLowerCase() === equalTo.toString().toLowerCase());
    };


    const list = (ref) => {
        return new Promise(async (resolve, reject) => {
            database.ref(ref).on('value', function (snapshot) {
                const entities = [];
                snapshot.forEach(function (childSnapshot) {
                    entities.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                resolve(entities);
            }, error => {
                reject(error);
            });
        });
    };


    function _checkProps(...props) {
        props.forEach(p => {
            if (!p) {
                console.error(new Error());
            }
        });
    }
    return {
        readData,
        writeData,
        insertWithRandomGuid,
        updateData,
        deleteData,
        loadUserData,
        getBy,
        getListBy,
        list,
        insertWithRandomGuid,

        listContains,
        getByInMemory,
        listByInMemory,
    };
})();
