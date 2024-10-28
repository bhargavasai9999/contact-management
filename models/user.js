import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

class User extends Model {
  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init({
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', bcrypt.hashSync(value, 10));
    },
  },
}, { sequelize, modelName: 'user' });

export default User;
