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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    console.log("~~~~~ Welcome to the Bamazon Pet Shop! ~~~~~ \n");

    displayStore();
});

function displayStore() {

    connection.query("SELECT * FROM inventory", function (err, res) {
        if (err) throw err;

        // console.log(res[0]);

        for (var i = 0; i < res.length; i++) {

            console.log("Item #" + res[i].id + ": " + res[i].item + " - $ " + res[i].price + " (Qty Available: " + res[i].quantity + ") \n");

        }

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n");

        purchasePrompt();
    }
    );
}

function purchasePrompt() {

    inquirer.prompt([
        {
            name: "shop",
            type: "list",
            message: "Would you like to make a purchase?",
            choices: ["Yes, I would!", "No, thanks!"]
        }
    ]).then(function (response) {

        if (response.shop == "Yes, I would!") {
            orderPrompt();

        } else {
            console.log("\n Have a nice day! \n")
            connection.end();
        }

    })

}

function orderPrompt() {

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
    ]).then(function(purchase) {

        var itemPurchased = purchase.item;
        var quantityPurchased = purchase.quantity;

        console.log("\n ~~~~~ Order Pending for ~~~~~ \n\n Item #" + itemPurchased + " - Quantity: " + quantityPurchased + "\n");

        checkAvailability(itemPurchased, quantityPurchased);
    })
}

function checkAvailability(itemPurchased, quantityPurchased) {

    connection.query(
        "SELECT * FROM inventory WHERE ?",
        {
            id: itemPurchased
        },
        function (err, res) {
            if (err) throw err;

            var quantityAvailable = res[0].quantity

            console.log("\n ~~~~~ Checking Availability ~~~~~ \n\n Quantity Available: " + quantityAvailable + "\n");
            // console.log("Requested: " + quantityPurchased);

            if (quantityAvailable >= quantityPurchased) {

                var newQuantity = quantityAvailable - quantityPurchased;
                // console.log("Quantity Remaining: " + newQuantity);

                var total = quantityPurchased * res[0].cost;
                console.log("\n ~~~~~ Order Confirmed ~~~~~ \n\n Order Total: $" + total + "\n")

                updateQuantity(newQuantity, itemPurchased);

            } else {

                console.log("Insufficient Quantity.\n");

                shopAgain();

            }

        }
    )
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

            console.log("\n ~~~~~ Here's what we have in stock: ~~~~~\n");

            displayStore();

        } else {
            console.log("\n Thank you! Come again!\n")
            connection.end();
        }

    })
    
}