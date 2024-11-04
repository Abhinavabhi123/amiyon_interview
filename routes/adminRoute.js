const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const adminController = require("../controllers/adminController");
const { authenticate } = require("../middleware/authentication");

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
router.get("/getCompany", authenticate, adminController.getCompany);
router.get("/getEmployee", authenticate, adminController.getEmployee);
router.get("/getDashboardData", authenticate, adminController.getDashboardData);

// post methods
router.post(
  "/addCompany",
  authenticate,
  upload.single("logo"),
  adminController.addCompany
);
router.post("/addEmployee", authenticate, adminController.addEmployee);
router.post(
  "/updateCompany",
  authenticate,
  upload.single("logo"),
  adminController.updateCompany
);

// Delete method
router.delete("/deleteCompany", authenticate, adminController.deleteCompany);
router.delete("/deleteEmployee", authenticate, adminController.deleteEmployee);

// put method
router.put(
  "/updateEmployeeDetails",
  authenticate,
  adminController.updateEmployeeDetails
);

module.exports = router;
