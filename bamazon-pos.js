require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    user: "root",
    password: process.env.SQL_PW,
    database: "pet_dept_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    console.log("~~~~~ Bamazon Pet Department ~~~~~ \n ~~~~~ Hello MANAGER! ~~~~~ \n");

    displayTasks();

});

function displayTasks() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "Manager Tasks: ",
            choices: ["View Inventory", "View Low Inventory", "Update Inventory", "Add New Item", "Exit"]
        }
    ]).then(function (manager) {

        let mgrChoice = manager.action;

        switch (mgrChoice) {
            case "View Inventory":
                console.log("\n Current Stock:");
                viewInventory();
                break;
            case "View Low Inventory":
                console.log("\n Low Stock:");
                viewLowInventory();
                break;
            case "Update Inventory":
                console.log("\n Add Inventory for... ");
                updateInventoryPrompt();
                break;
            case "Add New Item":
                console.log("\n New Item... ");
                addNewPrompt();
                break;
            case "Exit":
                console.log("\n ~~~~~ Exiting Manager Tasks ~~~~~ \n ~~~~~ Goodbye! ~~~~~");
                connection.end();
                break;
            default:
                console.log("Invalid selection!!!!!");
                break;
        }
    })
}

function viewInventory() {

    connection.query("SELECT * FROM inventory", function (err, res) {
        if (err) throw err;

        // console.log(res[0]);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n");

        for (var i = 0; i < res.length; i++) {

            console.log("Item #" + res[i].id + ": " + res[i].category + " - " + res[i].item + " - $" + res[i].price + " (Qty Available: " + res[i].quantity + ") \n");

        }

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n");

        displayTasks();
    }
    );
}

function viewLowInventory() {

    connection.query("SELECT * FROM inventory WHERE quantity < 10", function (err, res) {
        if (err) throw err;

        // console.log(res[0]);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

        for (var i = 0; i < res.length; i++) {

            console.table("Item #" + res[i].id + ": " + res[i].category + " - " + res[i].item + " - $" + res[i].price + " (Qty Available: " + res[i].quantity + ") \n");

        }

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

        displayTasks();
    }
    )

}

function updateInventoryPrompt() {

    inquirer.prompt([
        {
            name: "id",
            type: "prompt",
            message: "Item ID#:"
        },
        {
            name: "quantity",
            type: "prompt",
            message: "Add:"
        }
    ]).then(function (update) {

        // store response for ID into variable
        var updateID = update.id;
        // store response for new quantity into variable
        var addQuantity = update.quantity;

        connection.query(
            "SELECT * FROM inventory WHERE ?", 
            {
                id: updateID
            },
            function (err, res) {
                if (err) throw err; 

                var currentQuantity = res[0].quantity;
                
                newQuantity = parseInt(currentQuantity) + parseInt(addQuantity);

                updateInventory(updateID, newQuantity);
            }
        )

    })

}

function updateInventory(updateID, newQuantity) {

    connection.query(
        "UPDATE inventory SET ? WHERE ?",
        [
            {
                quantity: newQuantity
            },
            {
                id: updateID
            }
        ],
        function (err, res) {
            if (err) throw err;

            console.log("\n" + res.affectedRows + " item updated:");

            // console.log("Item #" + updateID + " - New Quantity = " + newQuantity + "\n");

            displayUpdate(updateID);
        }
    )

}

function displayUpdate(updateID) {

    connection.query(

        "SELECT * FROM inventory WHERE ?", 
        {
            "id": updateID
        },
        function(err, res) {
            if (err) throw err; 
            
            console.log("Item #" + res[0].id + ": " + res[0].item + " - $" + res[0].price + " - New Qty: " + res[0].quantity + " \n");

            displayTasks();
        }

    )

}

function addNewPrompt() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Item Name:"
        },
        {
            name: "category",
            type: "input",
            message: "Category:"
        },
        {
            name: "price",
            type: "input",
            message: "Price: $"
        },
        {
            name: "quantity",
            type: "input",
            message: "Quantity:"
        }
    ]).then(function(newItem) {

        var itemName = newItem.name;
        var itemCategory = newItem.category;
        var itemPrice = newItem.price; 
        var itemQuantity = newItem.quantity;

        addNewToDb(itemName, itemCategory, itemPrice, itemQuantity);

    })

}

function addNewToDb(itemName, itemCategory, itemPrice, itemQuantity) {

    connection.query(

        "INSERT INTO inventory SET ?",
        {
            item: itemName,
            category: itemCategory,
            price: itemPrice,
            quantity: itemQuantity
        },
        function (err, res) {
            if (err) throw err; 

            // console.log(res);

            console.log("\n" + res.affectedRows + " item added:");

            console.log(itemCategory + " - " + itemName + " - $" + itemPrice + " (Qty Available: " + itemQuantity + ") \n");

            displayTasks();

        }
        
    )

}