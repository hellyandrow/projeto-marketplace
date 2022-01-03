const firebaseAuth = (() => {
    const auth = firebase.auth();

    const getUid = async () => {
        return await new Promise((resolve, reject) => {
            auth.onAuthStateChanged((user) => {
                resolve(user?.uid);
            }, (error) => {
                throw reject(error);
            });
        });
    };

    const createLoginUsingEmailAndPassword = async (email, password) => {
        return await auth.createUserWithEmailAndPassword(email, password);
    };

    const loginWithEmailAndPassword = async (email, password) => {
        return await auth.signInWithEmailAndPassword(email, password);
    };

    const signOut = async () => {
        return await auth.signOut();
    };

    return {
        getUid,
        createLoginUsingEmailAndPassword,
        loginWithEmailAndPassword,
        signOut
    };
})()