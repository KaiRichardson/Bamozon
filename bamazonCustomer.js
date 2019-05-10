var mysql = require("mysql");
var inquirer = require("inquirer");
const { table } = require('table');

let data, output;

data = [
  ['0A', '0B', '0C'],
  ['1A', '1B', '1C'],
  ['2A', '2B', '2C']
];

output = table(data);

console.log(output);

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "hellohalo1",
  database: "bamazon_db"
});

function readDB() {
  console.log("All Available Items for Sale\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    data = [
      ['ID', 'Product Name', 'Price', 'Stock'],
    ];

    for (let i = 0; i < res.length; i++) {
      data.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
    };

    output = table(data);

    console.log(output);

    // console.log(res);
    connection.end();
  });
};


function selection() {


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

    // After the prompt, store the user's response in a variable called location.
  ]).then(function (response) {

    var adr = response.item_id;
    var sql = 'SELECT * FROM customers WHERE address = ' + mysql.escape(adr);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
    });

  });

};

readDB();
selection();