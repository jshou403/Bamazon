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

    console.log("~~~~~ Welcome to the Bamazon Pet Shop! ~~~~~ \n");

    shopPrompt();
});

function shopPrompt(){
    inquirer.prompt([
        {
            name: "shop",
            type: "list",
            message: "Do you want to buy something?",
            choices: ["Yes, I want to shop!","No, thanks!"]
        }
    ]).then(function(response){

        if (response.shop == "Yes, I want to shop!") {
            displayStore();

        } else {
            console.log("\n Have a nice day! \n")
            connection.end();
        }

    })
}

function updateQuantity(newQuantity, itemPurchased) {
    connection.query(
        "UPDATE inventory SET ? WHERE ?",
        [
            {
                quantity: newQuantity
            },
            {
                id: itemPurchased
            }
        ],
        function (err, res) {
            if (err) throw err;

            // console.log(res.affectedRows + " products updated!\n");
            shopAgain();
        }
    );
}

function shopAgain() {

    inquirer.prompt([
        {
            name: "nextstep",
            message: "Want to shop again?",
            type: "list",
            choices: ["Yes, please!", "No thanks!"]
        },

    ]).then(function (response) {

        if (response.nextstep == "Yes, please!") {

            displayStore();

        } else {
            console.log("\n Thank you! Come again!\n")
            connection.end();
        }

    }
    )
}

function displayStore() {

    console.log("\n ~~~~~ Here's what we have in stock: ~~~~~\n");

    connection.query("SELECT * FROM inventory", function (err, res) {
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
            var quantityPurchased = purchase.quantity;

            console.log("\n ~~~~~ Order Pending for ~~~~~ \n Item #" + itemPurchased + " - Quantity " + quantityPurchased);

            connection.query(
                "SELECT * FROM inventory WHERE ?",
                {
                    id: itemPurchased
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("\n ~~~~~ Checking Availability ~~~~~ \n");

                    var quantityAvailable = res[0].quantity
                    console.log("Quantity Available: " + quantityAvailable);
                    // console.log("Requested: " + quantityPurchased);

                    if (quantityAvailable >= quantityPurchased) {

                        var newQuantity = quantityAvailable - quantityPurchased;
                        // console.log("Quantity Remaining: " + newQuantity);

                        var total = quantityPurchased * res[0].cost;
                        console.log("\n ~~~~~ Order Confirmed ~~~~~ \n + Total Cost: " + total)

                        updateQuantity(newQuantity, itemPurchased);

                    } else {

                        console.log("Insufficient Quantity.");

                        shopAgain();

                    }

                }
            )
        });
    }
    );
}