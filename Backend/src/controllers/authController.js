import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import JsonWebToken  from "jsonwebtoken";
import tokenBlackListModel from "../model/blackListModel.js";

async function registerUser(req, res) {
    console.log("REQ BODY:", req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

    const token = JsonWebToken.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(201).json({ message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
     });


}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = JsonWebToken.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.cookie("token", token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
}

async function logoutUser(req, res) {
    const token = req.cookies.token;
    if(token){
        await tokenBlackListModel.create({ token });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });

}


async function getMe(req, res) {
    const user = await userModel.findById(req.user.id);
    
    res.status(200).json({
        message: "User fetched successfully", 
        user: {
        id: user._id,
        username: user.username,
        email: user.email,
    } });
} 

export default { registerUser , loginUser , logoutUser , getMe};
 
