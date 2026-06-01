import express from "express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()


router.post("/register", async (req, res) => {
    const { username, email, password } = req.body


    const usernameRegex = /^(?![0-9]+$)[a-zA-Z0-9_. ]{3,20}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/


    if (!username || !usernameRegex.test(username)) {
        return res.status(400).json({
            message: "Invalid username format"
        })
    }

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email"
        })
    }

    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters and include a number"
        })
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (existingUser) {
        return res.status(409).json({
            message: "Email already in use"
        })
    }

    const hashedPassword = bcrypt.hashSync(password, 8)

    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword
        }
    })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.json({ token })
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password){
        return res.status(400).json({
            message: "Email and password required"
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user) { return res.status(404).send({ message: "User not found" }) }

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    if (!passwordIsValid) { return res.status(404).send({ message: "Invalid password" }) }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.json({ token })
})


export default router
