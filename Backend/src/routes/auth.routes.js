const express = require("express")
const router = express.Router()
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

/**
 * POST/api/auth/register
 */
router.post("/register", authController.userRegister)

/**
 * POST/api/auth/login
 */
router.post("/login", authController.userLogin)

/**
 * GET/api/auth/logout
 */
router.get("/logout", authController.userLogout)

/**
 * GET/api/auth/get-me
 */
router.get("/get-me", authMiddleware.authUser, authController.getMe)

module.exports = router