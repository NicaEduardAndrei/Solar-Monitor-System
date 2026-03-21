import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    console.log(req.headers.authorization)
    const token = req.headers["authorization"]

    if(!token) {return res.status(401).json({message: "No token provided"})}

    jwt.verify(token , process.env.JWT_SECRET, (err,decoded)=>{
        console.log(decoded)
        if (err) {return res.status(401).json({message: "Invalid token"})}

        req.userId = decoded.id
        next()
    })
}


export default authMiddleware