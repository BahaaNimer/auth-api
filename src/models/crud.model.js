'use strict';

const userModel = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
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
    }
  });

  user.beforeCreate = async function (password) {
    let hash = await bcrypt.hash(password, 10);
    this.password = hash;
  }

  user.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      let newToken = jwt.sign({ username: user.username }, SECRET, { expiresIn: '15m' });
      user.token = newToken;
      return user
    } else {
      throw new Error('Invalid username or password');
    }
  }

  user.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      return this.findOne({ where: { username: parsedToken.username } });
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  return user;
}