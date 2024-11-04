const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require('dotenv');
dotenv.config()

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.error(error);
  });

  const db={};

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.users = require("./models/userModel.js")(sequelize,DataTypes);
  db.companies = require("./models/companyModel.js")(sequelize,DataTypes);
  db.employee = require("./models/employeeModel.js")(sequelize,DataTypes);

// Establish relationships
  db.companies.hasMany(db.employee, {
    foreignKey: "companyId",
    onDelete: "CASCADE",
  });
  db.employee.belongsTo(db.companies, {
    foreignKey: {
      name: "companyId",
      allowNull: false,
    },
  });



  module.exports = db;