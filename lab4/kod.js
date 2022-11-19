let db;
let request = window.indexedDB.open("newDatabase", 1);
request.onerror = function (event) 
	{
        console.log("error: The database is opened failed");
      	};
request.onsuccess = function (event) 
	{
        db = request.result;
        console.log("success: The database " + db + " is opened successfully");
        drawTable();
      	};