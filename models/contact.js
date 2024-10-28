import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import moment from 'moment-timezone';

class Contact extends Model {
  getCreatedAtInUserTimezone() {
    const timezone = this.getDataValue('timezone');
    const createdAt = this.getDataValue('createdAt');
    return timezone && createdAt
      ? moment(createdAt).tz(timezone).format('YYYY-MM-DD HH:mm:ss')
      : createdAt;
  }
}

Contact.init({
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: { isEmail: true },
  },
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  timezone: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  createdAtUserTimezone: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getCreatedAtInUserTimezone();
    }
  },
}, {
  sequelize,
  modelName: 'contact',
  timestamps: true,
});

export default Contact;
