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

function endDbConnection() {
    connection.end();
}

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
                console.log("\n Low In Stock:");
                viewLowInventory();
                break;
            case "Update Inventory":
                console.log("\n Update Inventory SELECTED!!!");
                break;
            case "Add New Item":
                console.log("\n Add New Item SELECTED!!!");
                break;
            case "Exit":
                console.log("\n ~~~~~ Exiting Manager Tasks ~~~~~ \n ~~~~~ Goodbye! ~~~~~");
                endDbConnection();
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

            console.table("Item #" + res[i].id + ": " + res[i].item + " - $" + res[i].price + " (Qty Available: " + res[i].quantity + ") \n");

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

            console.table("Item #" + res[i].id + ": " + res[i].item + " - $" + res[i].price + " (Qty Available: " + res[i].quantity + ") \n");

        }

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

        displayTasks();
    }
    )

}