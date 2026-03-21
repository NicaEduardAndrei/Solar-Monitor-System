import express from "express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()


router.post("/register", async (req, res) => {
    const { username, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)

    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword
        }
    })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "10s" })
    res.json({ token })
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })


    if (!user) { return res.status(404).send({ message: "User not found" }) }

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    if (!passwordIsValid) { return res.status(404).send({ message: "Invalid password" }) }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "10s" })
    res.json({ token })
})


export default router
