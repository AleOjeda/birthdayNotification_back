module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING },
      birthday: { type: DataTypes.DATE },
      email: { type: DataTypes.STRING, unique: true },
      phone: { type: DataTypes.STRING, unique: true },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "customers",
      underscored: true,
    }
  );

  return Customer;
};
