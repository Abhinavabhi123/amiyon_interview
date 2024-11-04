const db = require("../database");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fs = require("fs");
const { where } = require("sequelize");

const User = db.users;
const Company = db.companies;
const Employee = db.employee;

// user authentication
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ isSuccess: false, message: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ isSuccess: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user?.id, email: user?.email, password: user?.password },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      isSuccess: true,
      message: "Login successful",
      userId: user.id,
      token,
    });
  } catch (error) {
    console.error(error);
  }
};

const addCompany = async (req, res) => {
  try {
    let logoPath = "";
    let modifiedPath = "";
    if (req.file) {
      logoPath = req.file.path.replace(/\\/g, "/").split("/");
      modifiedPath = `${logoPath[0]}/${logoPath[logoPath.length - 1]}`;
    } else {
      modifiedPath = "";
    }
    if (req.body) {
      const { name, email, website } = req.body;
      await Company.create({
        name,
        email,
        logo: modifiedPath,
        website,
      }).then(() => {
        return res.status(200).json({
          isSuccess: true,
          message: "Company added successfully!",
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const getCompany = async (req, res) => {
  try {
    await Company.findAll({
      attributes: ["id", "name", "email", "logo", "website"],
    }).then((response) => {
      return res.status(200).send({ isSuccess: true, companyData: response });
    });
  } catch (error) {
    console.error(error);
  }
};

const deleteImageFromServer = (response) => {
  const segment = response.logo.split("/");
  const fullPath = `${segment[0]}\\app\\public\\${segment[segment.length - 1]}`;
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    console.log("File deleted successfully");
  });
};

const deleteCompany = async (req, res) => {
  try {
    const { companyid } = req.headers;
    if (!companyid) {
      return res.status(400).send({
        isSuccess: false,
        message: "Company id is missing",
      });
    }
    // for removing image from the server
    await Company.findOne({
      where: {
        id: companyid,
      },
    }).then((response) => {
      deleteImageFromServer(response);
    });

    await Company.destroy({
      where: {
        id: companyid,
      },
    }).then(() => {
      res.status(200).send({
        isSuccess: true,
        message: "Company removed successfully",
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// update company details
const updateCompany = async (req, res) => {
  try {
    if (req.body) {
      const { id, name, email, website } = req.body;
      console.log(req.file, "file");

      let logoPath = "";
      let modifiedPath = "";
      if (req.file) {
        logoPath = req.file.path.replace(/\\/g, "/").split("/");
        modifiedPath = `${logoPath[0]}/${logoPath[logoPath.length - 1]}`;
        await Company.findOne({ where: { id } })
          .then((response) => {
            deleteImageFromServer(response);
          })
          .then(async () => {
            await Company.update(
              { email, name, website, logo: modifiedPath },
              {
                where: { id },
              }
            ).then(() => {
              res.status(200).send({
                isSuccess: true,
                message: "Company details updated successfully",
              });
            });
          });
      } else {
        await Company.update(
          { email, name, website },
          {
            where: { id },
          }
        ).then(() => {
          res.status(200).send({
            isSuccess: true,
            message: "Company details updated successfully",
          });
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// Function for add new employee
const addEmployee = async (req, res) => {
  try {
    if (req.body) {
      const { firstName, lastName, email, company, phone } = req.body;
      console.log(req.body);
      await Employee.create({
        firstName,
        lastName,
        email,
        phone,
        companyId: company,
      }).then((response) => {
        return res.status(200).send({
          isSuccess: true,
          message: "New Employee added successfully",
        });
      });
    }
    // return res.status(402).send({isSuccess:false,message:"Missing field data"})
  } catch (error) {
    console.error(error);
  }
};

// fetch employee data
const getEmployee = async (req, res) => {
  try {
    await Employee.findAll().then((response) => {
      return res.status(200).send({
        isSuccess: true,
        message: "Employee data fetched successfully",
        employeeData: response,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// delete employee
const deleteEmployee = async (req, res) => {
  try {
    if (!req.headers) {
      return res
        .status(403)
        .send({ isSuccess: false, message: "Header Values are missing" });
    }
    const { id } = req.headers;
    if (!id) {
      return res
        .status(403)
        .send({ isSuccess: false, message: "Missing employee id" });
    }
    await Employee.destroy({ where: { id } }).then(() => {
      res
        .status(200)
        .send({ isSuccess: true, message: "Employee removed successfully" });
    });
  } catch (error) {
    console.error(error);
  }
};

// update employee details
const updateEmployeeDetails = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(403)
        .send({ isSuccess: false, message: "Missing field values" });
    }
    const { id, firstName, lastName, email, phone, company } = req.body;
    await Employee.update(
      { firstName, lastName, email, phone, company },
      { where: { id } }
    ).then(() => {
      res.status(200).send({
        isSuccess: true,
        message: "Employee details updated successfully",
      });
    });
  } catch (error) {
    console.error(error);
  }
};

//fetching dashboard data
const getDashboardData = async (req, res) => {
  try {
    const employeeCount = await db.employee.count();
    const companyCount = await db.companies.count();

    res.status(200).send({
      isSuccess: true,
      message: "Fetched dashboard data",
      details: {
        employeeCount,
        companyCount,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  adminLogin,
  addCompany,
  getCompany,
  deleteCompany,
  updateCompany,
  addEmployee,
  getEmployee,
  deleteEmployee,
  updateEmployeeDetails,
  getDashboardData,
};
