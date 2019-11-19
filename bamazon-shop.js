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

    console.log("~~~~~ Welcome to the Bamazon Pet Shop! ~~~~~\n");

    displayStore();
});

function displayStore() {

    connection.query("SELECT * FROM inventory", function (err, res) {
        if (err) throw err;

        // console.log(res[0]);

        for (var i = 0; i < res.length; i++) {

            console.log("Item #" + res[i].id + ": " + res[i].item + " - $" + res[i].price + " (Qty Available: " + res[i].quantity + ")\n");

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

        if (response.shop === "Yes, I would!") {
            orderPrompt();

        } else {
            console.log("\nGood bye! Have a nice day!\n")
            connection.end();
        }

    })

}

function orderPrompt() {

    inquirer.prompt([
        {
            name: "item",
            message: "What is the item # of the product you'd like to buy?",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (purchase) {

        var itemPurchased = parseInt(purchase.item);
        var quantityPurchased = parseInt(purchase.quantity);

        console.log("\n\n~~~~~ Order Pending for ~~~~~\n\nItem #" + itemPurchased + " - Quantity: " + quantityPurchased);

        if (quantityPurchased == 0) {

            console.log("\nError: Invalid Order Quantity.\n\n");
            shopAgain();

        } else {

            checkAvailability(itemPurchased, quantityPurchased);
        }

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

            if (res.length > 0) {

                var quantityAvailable = res[0].quantity;

                // console.log("Requested: " + quantityPurchased);

                if (quantityAvailable >= quantityPurchased) {

                    // console.log("\n~~~~~ Checking Availability ~~~~~\n");

                    // console.log("Quantity Available: " + quantityAvailable + "\n\n");

                    var newQuantity = quantityAvailable - quantityPurchased;
                    // console.log("Quantity Remaining: " + newQuantity);

                    var itemPrice = res[0].price;
                    // console.log("Quantity Purchased: " + quantityPurchased);
                    // console.log("Price: " + itemPrice);

                    var orderTotal = quantityPurchased * itemPrice;
                    console.log("\n\n~~~~~ Order Confirmed! ~~~~~ \n\n" + res[0].item + " x " + quantityPurchased + " at $" + res[0].price + " each\n\nOrder Total = $" + orderTotal + "\n\n")

                    updateQuantity(newQuantity, itemPurchased);

                } else {

                    console.log("\nError: Insufficient Quantity - Sorry, We only have " + quantityAvailable + " available.\n\n");

                    shopAgain();
                }

            } else {

                console.log("\nError: Invalid Item ID# - Please choose a valid Item ID#.\n\n");

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
            message: "What would you like to do next?",
            type: "list",
            choices: ["Place Another Order", "View Store", "Leave"]
        },

    ]).then(function (response) {

        if (response.nextstep === "View Store") {

            console.log("\n~~~~~ Here's what we have in stock: ~~~~~\n");

            displayStore();

        } else if (response.nextstep === "Place Another Order") {

            orderPrompt();

        } else {
            console.log("\nThank you! Come again!\n");
            connection.end();
        }

    })

}