import { User } from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        await user.save();
        generateJWTToken(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        return res.status(201).json({
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined, // Exclude password from the response
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isVerified = user.isVerified; // Use the correct field name
        if (!isVerified) {
            return res.status(400).json({ success: false, message: "Email not verified" });
        }

        generateJWTToken(res, user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = (req, res) => {
    res.send("logout route");
};
