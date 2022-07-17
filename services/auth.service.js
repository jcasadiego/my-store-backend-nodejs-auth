const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('../config/config');
const UserService = require('./user.service');

const service = new UserService();

class AuthService {

  async getUser(email, password){
    const user = await service.findByEmail(email);
      if(!user){
        throw boom.unauthorized();
      };
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        throw boom.unauthorized();
      }
      delete user.dataValues.password;
      return user;
  }

  signToken(user){
      const payload = {
        sub: user.id,
        role: user.role
      };
      const token = jwt.sign(payload, config.jwtSecret);
      res.json({
        user,
        token
      });
  }

  async sendMail(infoMail){
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true, // true for 465, false for other ports
      port: 465,
      auth: {
          user: `${config.emailAdmin}`,
          pass: `${config.passAdmin}`
      },
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }

  async sendRecovery(email){
    const user = await service.findByEmail(email);
    if(!user){
      throw boom.unauthorized();
    };
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
    const link = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const mail = {
      from: `"Jose Casadiego" <${config.emailAdmin}>`, // sender address
      to: `${user.email}`, // list of receivers
      subject: "Email para recuperar contraseña", // Subject line
      text: "Hola Jose", // plain text body
      html: `<b>Ingresa a este link => ${link}</b>`, // html body
    }
    const rta = await this.sendMail(mail);
    return rta;
  }
}

module.exports = AuthService;
