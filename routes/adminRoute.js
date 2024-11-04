const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const adminController = require("../controllers/adminController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./storage/app/public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
// get methods
router.get("/login", adminController.adminLogin);
router.get("/getCompany", adminController.getCompany);
router.get("/getEmployee",adminController.getEmployee);
router.get("/getDashboardData",adminController.getDashboardData)
// post methods
router.post("/addCompany", upload.single("logo"), adminController.addCompany);
router.post("/addEmployee", adminController.addEmployee);
// Delete method
router.delete("/deleteCompany", adminController.deleteCompany);
router.delete("/deleteEmployee",adminController.deleteEmployee)
// put method
router.post(
  "/updateCompany",
  upload.single("logo"),
  adminController.updateCompany
);
router.put("/updateEmployeeDetails",adminController.updateEmployeeDetails)

module.exports = router;
