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
    displayStore();
});

function updateQuantity(newQuantity,itemPurchased) {
    var query = connection.query(
        "UPDATE inventory SET ? WHERE ?",
        [
            {
                quantity: newQuantity
            },
            {
                id: purchase.item
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
        }
    );
}

function displayStore() {

    console.log("~~~~~ Welcome to the Bamazon Pet Shop! ~~~~~ \n");

    var query = connection.query("SELECT * FROM inventory", function (err, res) {
        if (err) throw err;

        // console.log(res[0]);

        for (var i = 0; i < res.length; i++) {

            console.log("Item #" + res[i].id + ": " + res[i].item + " - $ " + res[i].price + " (Qty Available: " + res[i].quantity + ") \n");

        }

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n");

        inquirer.prompt([

            {
                name: "item",
                message: "What is the item # of the product you'd like to buy?",
                type: "input"
            },

            {
                type: "input",
                name: "quantity",
                message: "How many units would you like to purchase?"
            }

        ]).then(function (purchase) {

            var itemPurchased = purchase.item;

            console.log("\n Order Pending: Item #" + itemPurchased + ", Quantity " + purchase.quantity);

            var query = connection.query(
                "SELECT * FROM inventory WHERE ?",
                {
                    id: itemPurchased
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("\n ~~~~~ Stock Check In Progress ~~~~~ \n");

                    var quantityAvailable = res[0].quantity
                    var quantityPurchased = purchase.quantity
                    console.log("Available = " + quantityAvailable + ", Requested = " + quantityPurchased);

                    if (quantityAvailable >= quantityPurchased) {

                        console.log("\n ~~~~~ Store Check Complete ~~~~~ \n");
                        var newQuantity = quantityAvailable - quantityPurchased;
                        console.log("Quantity Remaining = " + newQuantity);
                        console.log("\n ~~~~~ Order Processing ~~~~~ \n");

                        updateQuantity(newQuantity,itemPurchased);

                    } else {
                        console.log("Insufficient Quantity.");
                    }

                }
            )

            connection.end()

        });


    }
    );
}