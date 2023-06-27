'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clinic.hasMany(Doctor, {
        foreignKey: 'ClinicId'
      });
      Doctor.belongsTo(Clinic);

      Specialization.hasMany(Doctor, {
        foreignKey: 'SpecializationId'
      });
      Doctor.belongsTo(Specialization);
    }
  }
  Doctor.init({
    roleId: DataTypes.STRING,
    Doctor_email: DataTypes.STRING,
    ClinicId: DataTypes.INTEGER,
    SpecializationId: DataTypes.INTEGER,
    Doctor_firstName: DataTypes.STRING,
    Doctor_lastName: DataTypes.STRING,
    Doctor_address: DataTypes.STRING,
    Doctor_age: DataTypes.INTEGER,
    Doctor_phoneNumber: DataTypes.STRING,
    Doctor_gender: DataTypes.INTEGER,
    Doctor_image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};