// src/controllers/auth.controller.js
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";
import cookieOptions from "../utils/cookieOptions.js";


// register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validasi input
        if (!name || !email || !password) {
            return errorResponse(res, 'Name, email, and password are required', null, 400);
        }

        // Cek jika email sudah digunakan
        const existed = await prisma.user.findUnique({ where: { email } });
        if (existed) return errorResponse(res, 'Email is already in use', null, 400);

        // Hash password sebelum simpan ke DB
        const hashed = await bcrypt.hash(password, 10);

        // Simpan user baru ke db
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed
            }
        });

        return successResponse(res, 'Register Successful', {
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error('Register error:', error);
        return errorResponse(res, 'Registration failed', error.message, 500);
    }
}

// login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return errorResponse(res, 'Email and password are required', null, 400);
        }

        // Cari user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return errorResponse(res, 'Email tidak ditemukan', null, 401);
        }

        // Pastikan password hash ada
        if (!user.password) {
            console.error('User password hash is missing for:', email);
            return errorResponse(res, 'Invalid user data', null, 500);
        }

        // Cocokkan password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return errorResponse(res, 'Password salah', null, 401);
        }

        // Buat JWT Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        
        res.cookie("token", token, cookieOptions(req));

        return successResponse(res, 'Login Successful', {
            userId: user.id,
            email: user.email,
            token: token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(res, 'Login failed', error.message, 500);
    }
}

// logout
export const logout = (req, res) => {
    res.clearCookie("token", {
        ...cookieOptions(req),
        maxAge: undefined,
    });
    return successResponse(res, 'Logout successful');
}