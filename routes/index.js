const { authenticate } = require('../auth');
const { authController } = require('../controllers');

const routes = require('express').Router();

routes.post("/auth/google/callback",authController.googleAuth)
routes.post("/auth/sign-in",authController.signIn)
routes.post("/auth/sign-up",authController.signUp)
routes.get("/auth/getUser",authenticate,authController.getUser)

module.exports = routes;