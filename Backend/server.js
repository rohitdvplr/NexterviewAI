  import dotenv from "dotenv";
  dotenv.config();
  import app from "./src/app.js";
  import connectDb from "./src/config/database.js";



  connectDb();


  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });