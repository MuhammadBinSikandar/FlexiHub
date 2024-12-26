import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createError from '../utils/createError.js';


const register = async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    next(err)
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not Found"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong password or username"));

    const token = jwt.sign({
      id: user._id,
      isSeller: user.isSeller,
    },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info)
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    sameSite: "None",
    secure: true,
  })
  .status(200)
  .send("Logged out");
};

export { register, login, logout };
