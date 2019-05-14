var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
const { table } = require('table');

var data1;
var data2;
var output1 = [];
var output2 = [];
var count = 0;
var item = 0;


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

    data1 = [
      ['****All Available Items for Sale****'],
    ];
    data2 = [
      ['ID:', 'Product Name:', 'Price:', 'Stock:'],
    ];

    // looping through db, outputting items
    for (let i = 0; i < res.length; i++) {
      if (res[i].item_id === item) {

        data2.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity].green);
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

    console.log('\033[2J');
    console.log("\n" + output1 + output2);


    // connection.end();
  });
};

selection();


// Asking initial question
function selection() {

  readDB();
  inquirer.prompt([
    {
      type: "input",
      name: "item_id",
      message: "What is the ID of the product you would like?"
    }
  ]).then(function (response) {
    item = parseInt(response.item_id);
    readDB();
    connection.query("SELECT product_name FROM bamazon_db WHERE ?", { item_id: response.item_id }, function (err, res) {
      console.log("You chose: " + res[0].product_name);
      inquirer.prompt([
        {
          type: "confirm",
          name: "y_n",
          message: "You chose: " + res[0].product_name + ", is this correct?"
        }
      ]).then(function (response) {
        item = parseInt(response.item_id);
        readDB();
        connection.query("SELECT product_name FROM bamazon_db WHERE ?", { item_id: response.item_id }, function (err, res) {
          console.log("You chose: " + res[0].product_name);
          runSearch();
        });
      });
    
      runSearch();
    });
  });

  readDB();
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
    }
  ]).then(function (response) {
    count = parseInt(response.quantity);
    item = parseInt(response.item_id);
    quantityCheck(response);

  });
};

function quantityCheck(res) {
  if (res.stock_quantity <= 0) {
    console.log("Insufficient quantity!");
    selection();

  } else {
    header = [
      ['****Chosen Item****'],
    ];


    console.log(res);
    dbUpdate(res);
  };
};

function dbUpdate(res) {
  var newSet = parseInt(res[0].stock_quantity) - count;
  // var sql = "UPDATE customers SET ? WHERE item_id =" + result.item_id, {stock_quantity: newSet};
  // connection.query(sql, function(err, res) {
  //   if (err) throw err;
  //   header = [
  //     ['****Updated Item****'],
  //   ];
  //   console.log(result.affectedRows + " record(s) updated");
  //   }
  // );

  // console.log(newSet);
  // console.log(res);
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newSet
      },
      {
        item_id: res[0].item_id
      }
    ],
    function (err, res) {
      // console.log(res);
      console.log(res.affectedRows + " products updated!\n");
      header = [
        ['****Updated Item****'],
      ];

    }
  );

  // logs the actual query being run
  console.log(query.sql);


}