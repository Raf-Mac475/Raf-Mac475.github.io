window.indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;

window.IDBTransaction =
        window.IDBTransaction ||
        window.webkitIDBTransaction ||
        window.msIDBTransaction;
      window.IDBKeyRange =
        window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

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
      let request = window.indexedDB.open("newDatabase", 3);

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

function search(event) {
        event.preventDefault();

        let searchInputs = document.getElementById("searchBar").value.split(' ');
        
        drawTable(searchInputs);
      }

      function remove(id) {
        let request = db
          .transaction(["client"], "readwrite")
          .objectStore("client")
          .delete(id);

        request.onsuccess = function (event) {
          console.log(`Client ${id} removed...`);
          drawTable();
        };
      }

function generateTableHead(table, data) {
        let thead = table.createTHead();
        let row = thead.insertRow();

        // Create id column
        let th = document.createElement("th");
        let text = document.createTextNode("id");
        th.appendChild(text);
        row.appendChild(th);

        for (let key of data) {
          let th = document.createElement("th");
          let text = document.createTextNode(key);
          th.appendChild(text);
          row.appendChild(th);
        }
      }

function generateTable(table, filterItems = []) {
        let objectStore = db.transaction("client").objectStore("client");

        objectStore.openCursor().onsuccess = function (event) {
          var cursor = event.target.result;

          if (cursor) {
            console.log(filterItems);
            if (filterItems.length > 0 && filterItems[0] !== "") {
              let exists = false;
              for (let i = 0; i < filterItems.length; i++) {
                const element = filterItems[i];
                
                if (Object.values(cursor.value).includes(element)) {
                  exists = true
                }
              }

              if (!exists) {
                cursor.continue();
                return;
              }
            }

console.log(cursor.value)

            let row = table.insertRow();
            let cell = row.insertCell();
            let text = document.createTextNode(cursor.key);
            cell.appendChild(text);
            for (const [key, value] of Object.entries(cursor.value)) {
              let cell = row.insertCell();
              let text = document.createTextNode(value);
              cell.appendChild(text);
            }

            cell = row.insertCell();
            let removeButton = document.createElement("button");
            removeButton.setAttribute("id", "removeButton" + cursor.key);
            removeButton.setAttribute("onclick", `remove(${cursor.key})`);
            removeButton.innerHTML = "remove";
            cell.appendChild(removeButton);

            cursor.continue();
          } else {
            console.log("No more data");
          }
        };
      }

function drawTable(filterItems) {
        if (document.getElementById("tbody") !== null) {
          document.querySelector("#tbody").remove();
        }

        let table = document.createElement("table");
        table.setAttribute("id", "tbody");
        let data = Object.keys(clientData[0]);
        generateTable(table, filterItems);
        generateTableHead(table, data);
        document.getElementById("tableDiv").appendChild(table);
      }