'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.API_SECRET || 'secretthing';

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'writer', 'editor', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    token: {
      type: DataTypes.VIRTUAL,
    },
    actions: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['read'],
          writer: ['read', 'create'],
          editor: ['read', 'create', 'update'],
          admin: ['read', 'create', 'update', 'delete'],
        }
        return acl[this.role];
      }
    }
  });

  model.beforeCreate = async function (password) {
    let hash = await bcrypt.hash(password, 10);
    this.password = hash;
  }

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      let newToken = jwt.sign({ username: user.username }, SECRET, { expiresIn: '15m' });
      user.token = newToken;
      return user
    } else {
      throw new Error('Invalid username or password');
    }
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = this.findOne({ where: { username: parsedToken.username } });
      if (user) {
        return user;
      }
    } catch (e) {
      throw new Error(e.message)
    }
  };
  return model;
}

module.exports = userModel;
