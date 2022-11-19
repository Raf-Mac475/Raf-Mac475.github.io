if (!window.indexedDB) {
        window.alert(
          "Your browser doesn't support a stable version of IndexedDB."
        );
      }

      const clientData = [
        {
          name: "Rafał",
          lastName: "Mackiewicz",
          age: "20",
          email: "Rafal@gmail.com",
        },
        {
          name: "Patryk",
          lastName: "Kowalski",
          age: "30",
          email: "Patryk@gmail.com",
        },
      ];


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

        for (var i in clientData) {
          objectStore.add(clientData[i]);
        }
      };

function add(event) {
        event.preventDefault();

        var formElements = document.getElementById("addForm");

        var request = db
          .transaction(["client"], "readwrite")
          .objectStore("client")
          .add({
            name: formElements[0].value,
            lastName: formElements[1].value,
            age: formElements[2].value,
            email: formElements[3].value,
          });

        request.onsuccess = function (event) {
          console.log("Client added");
          drawTable();
        };

        request.onerror = function (event) {
          alert(
            "Unable to add data\r\ user with that email aready exist in your database! "
          );
        };
      }