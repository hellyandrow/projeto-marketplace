'use strict';

const firebaseStorage = (() => {
    const storage = firebase.storage();

    const getFile = async (ref = "/") => {
        return await new Promise((resolve, reject) => {
            storage.ref(ref).getDownloadURL()
                .then((url) => {
                    resolve(url);
                }).catch(error => {
                    reject(error);
                });
        });
    };

    const upload = async (ref = "/", file, metadata = {}) => {
        try {
            const storageRef = await storage.ref(ref).put(file, metadata);
            if (storageRef.state != 'success') {
                throw { code: "ERROR_ON_UPLOAD_FILE" };
            }
            return await getFile(ref);
        } catch (error) {
            throw error;
        }
    };


    return {
        getFile,
        upload
    };
})();
