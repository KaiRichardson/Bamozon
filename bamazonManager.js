var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
const { table } = require('table');

var data1;
var data2;
var output1 = [];
var output2 = [];
var item = 0;
var count = 0;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "hellohalo1",
  database: "bamazon_db"
});

manage();

// Asking initial question
function manage() {
  item = 0;
  count = 0;

  inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What action would you like to take?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "exit"]
    }
  ]).then(function (response) {

    switch (response.action) {
      case "View Products for Sale":
        fullInventory();
        break;

      case "View Low Inventory":
        lowInventory();
        break;

      case "Add to Inventory":
        addInventory();
        break;

      case "Add New Product":
        newProduct();
        break;

      case "exit":
        console.log("Ok bye!");
        connection.end();
        break;

      default:
        console.log("Please choose an action");
        manage();
        break;
    }

    // item = parseInt(response.item_id);
    // count = parseInt(response.quantity);
    // // checking if the responce was a number. if not functions will not work
    // if (isNaN(response.item_id || response.quantity)) {

    //   console.log("******************************************");
    //   console.log("Please enter a number for ID and Quantity");
    //   console.log("******************************************");
    //   manage();

    // } else {

    //   //calling DB
    //   connection.query('SELECT * FROM products WHERE item_id = ?', item, function (err, result) {
    //     // if (err) throw err;
    //     //calculations for price and new quantity
    //     var userPrice = result[0].price * count;
    //     var newQuantity = result[0].stock_quantity - count;
    //     var fianlPrice = userPrice.toFixed(2);

    //     // making sure that the amount requested is less then base stock_quantity
    //     if (count <= result[0].stock_quantity) {

    //     } else {

    //       // not enough stock for demand, start over
    //       console.log("\n******************************************");
    //       console.log("All out of that one, please pick a nother item");
    //       console.log("******************************************\n");
    //       manage();
    //     };
    //   });
    // };
  });
};

function fullInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    data1 = [['****All Available Items for Sale****']];
    data2 = [['ID:', 'Product Name:', 'Price:', 'Stock:']];

    // looping through db, outputting items
    for (let i = 0; i < res.length; i++) {
      data2.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
    };

    options1 = {
      columns: {
        0: { alignment: 'center', width: 53 }
      }
    };

    options2 = {
      columns: {
        0: { width: 5 },
        1: { width: 20 },
        2: { width: 10 },
        3: { width: 10 }
      }
    };

    output1 = table(data1, options1);
    output2 = table(data2, options2);

    console.log("\n" + output1 + output2);
    ending();
  });
};

function lowInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    data1 = [['****All items with stock 5 or less****']];
    data2 = [['ID:', 'Product Name:', 'Price:', 'Stock:']];

    // looping through db, outputting items
    for (let i = 0; i < res.length; i++) {
      if (res[i].stock_quantity <= 5) {
        data2.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
      };
    };

    options1 = {
      columns: {
        0: { alignment: 'center', width: 53 }
      }
    };

    options2 = {
      columns: {
        0: { width: 5 },
        1: { width: 20 },
        2: { width: 10 },
        3: { width: 10 }
      }
    };

    output1 = table(data1, options1);
    output2 = table(data2, options2);

    console.log("\n" + output1 + output2);
    ending();
  });
};

// function addInventory() {

//   inquirer.prompt([
//     {
//       type: "input",
//       name: "item_id",
//       message: "What is the ID of the product you would like?"
//     },
//     {
//       type: "input",
//       name: "quantity",
//       message: "How many would you like?"
//     },

//   ]).then(function (response) {


//     //updating DB
//     var dbUpdate = "UPDATE products SET ? WHERE  ?";
//     connection.query(dbUpdate,
//       [
//         {
//           stock_quantity: newQuantity
//         },
//         {
//           item_id: item
//         }
//       ],
//       function (error) {
//         // if (error) throw err;
//         console.log("Your total is: " + fianlPrice);
//         console.log("******************************************");
//       });
//   });
//   ending();
// };

function ending() {
  inquirer.prompt([
    {
      type: "confirm",
      name: "y_n",
      message: "Would you like to take another action?"
    }
  ]).then(function (response) {
    if (response.y_n) {
      manage();
    } else {
      console.log("\n******************************************");
      console.log("Thank you for shopping, Good bye!");
      console.log("******************************************\n");
      connection.end();
    };
  });
};