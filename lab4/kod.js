let db;
let dbReq = indexedDB.open("newDatabase", 1);

dbReq.onupgradeneeded = function (event) {
    db = event.target.result;

    let clients = db.createObjectStore('clients', { autoIncrement: true });
}