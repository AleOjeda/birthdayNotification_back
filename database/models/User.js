module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "users",
      underscored: true,
    }
  );

  return User;
};
