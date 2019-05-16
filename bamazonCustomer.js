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

function readDB() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    totLength = res.length;

    data1 = [['****All Available Items for Sale****']];
    data2 = [['ID:', 'Product Name:', 'Price:', 'Stock:']];

    // looping through db, outputting items
    for (let i = 0; i < res.length; i++) {
      if (res[i].item_id === item) {

        data2.push([colors.green(res[i].item_id), colors.green(res[i].product_name), colors.green(res[i].price), colors.green(res[i].stock_quantity)]);
      } else {

        data2.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
      }
    };

    options1 = {
      columns: {
        0: {
          alignment: 'center',
          width: 53
        }
      }
    };

    options2 = {
      columns: {
        0: {
          width: 5
        },
        1: {
          width: 20
        },
        2: {
          width: 10
        },
        3: {
          width: 10
        }
      }
    };

    output1 = table(data1, options1);
    output2 = table(data2, options2);

    // console.log('\033[2J');
    console.log("\n" + output1 + output2);

    purchase();

  });
};


readDB();

// Asking initial question
function purchase() {
  item = 0;
  count = 0;

  inquirer.prompt([
    {
      type: "input",
      name: "item_id",
      message: "What is the ID of the product you would like?"
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like?"
    },

  ]).then(function (response) {
    item = parseInt(response.item_id);
    count = parseInt(response.quantity);

    // checking if the responce was a number. if not functions will not work
    if (isNaN(response.item_id || response.quantity)) {

      console.log("******************************************");
      console.log("Please enter a number for ID and Quantity");
      console.log("******************************************");
      purchase();

    } else {

      //calling DB
      connection.query('SELECT * FROM products WHERE item_id = ?', item, function (err, result) {
        // if (err) throw err;
        //calculations for price and new quantity
        var userPrice = result[0].price * count;
        var newQuantity = result[0].stock_quantity - count;
        var fianlPrice = userPrice.toFixed(2);

        // making sure that the amount requested is less then base stock_quantity
        if (count <= result[0].stock_quantity) {

          //updating DB
          var dbUpdate = "UPDATE products SET ? WHERE  ?";
          connection.query(dbUpdate,
            [
              {
                stock_quantity: newQuantity
              },
              {
                item_id: item
              }
            ],
            function (error) {
              // if (error) throw err;
              console.log("Your total is: " + fianlPrice);
              console.log("******************************************");

              inquirer.prompt([
                {
                  type: "confirm",
                  name: "y_n",
                  message: "Would you like to make another purchase?"
                }
              ]).then(function (response) {
                if (response.y_n) {
                  readDB();
                } else {
                  console.log("\n******************************************");
                  console.log("Thank you for shopping, Good bye!");
                  console.log("******************************************\n");
                  connection.end();
                };
              });
            });
        } else {

          // not enough stock for demand, start over
          console.log("\n******************************************");
          console.log("Not enough Stock, please pick another item");
          console.log("******************************************\n");
          purchase();
        };
      });
    };
  });
};