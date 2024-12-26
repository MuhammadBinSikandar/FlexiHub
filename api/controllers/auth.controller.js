import User from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


const register = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 5);
    console.log(hashedPassword)

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404)
      .send("User not found")

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isCorrect) return res.status(400)
      .send("Wrong password or username")

    const token = jwt.sign({
      id:user._id,
      isSeller:user.isSeller,
    },
    process.env.JWT_KEY
  );
    

    const {password, ...info}=user._doc
    res
    .cookie("accessToken",token,{
      httpOnly:true,
    })
    .status(200)
    .send(info)
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const logout = async (req, res) => {
  // TODO: Implement logout functionality
  res.status(200).send("Logout endpoint not implemented yet");
};

// Export all functions
export { register, login, logout };
