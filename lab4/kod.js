let db;
      let request = window.indexedDB.open("newDatabase", 1);

      request.onerror = function (event) {
        console.log("error: The database is opened failed");
      };

      request.onsuccess = function (event) {
        db = request.result;
        console.log("success: The database " + db + " is opened successfully");
        drawTable();
      };

      request.onupgradeneeded = function (event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("client", {
          autoIncrement: true,
        });

        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("lastName", "lastName", { unique: false });
        objectStore.createIndex("age", "age", { unique: false });
        objectStore.createIndex("email", "email", { unique: true });
        objectStore.createIndex("pesel", "pesel", { unique: true });
        objectStore.createIndex("address", "address", { unique: false });
        objectStore.createIndex("phoneNumber", "phoneNumber", { unique: true });

        for (var i in clientData) {
          objectStore.add(clientData[i]);
        }
      };