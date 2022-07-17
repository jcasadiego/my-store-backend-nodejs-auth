const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { config } = require('../config/config');
const AuthService =  require('../services/auth.service');

const router = express.Router();
const service = new AuthService();

router.post('/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery',
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const rta = await service.sendMail(email);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
