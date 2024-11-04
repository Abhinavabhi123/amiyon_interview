  const express = require("express");
  const dotenv = require("dotenv");
  const cors = require("cors");
  const morgan = require('morgan');
  const path = require("path");

  const db = require("./database");
  const adminRoutes = require("./routes/adminRoute");

  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 3000;

  // middleware
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"))
  app.use('/storage', express.static(path.join(__dirname, 'storage/app/public')));

  db.sequelize.sync({ force: false }).then(() => {
    console.log(`re-sync done ! `);
  });


  app.get("/",(req,res)=>{
      res.json({message:"success"})
  })

  app.use("/admin",adminRoutes)
  app.listen(PORT, () => console.log(`Server is running at port ${PORT}⚡`));
