module.exports = (sequelize, DataTypes) => {
  const SpesifikasiSafetyGalery = sequelize.define(
    'SpesifikasiSafetyGalery',
    {
      file: DataTypes.STRING,
      spesifikasiSafetyId: DataTypes.INTEGER
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  SpesifikasiSafetyGalery.associate = function(models) {
    SpesifikasiSafetyGalery.belongsTo(models.SpesifikasiSafety, {
      foreignKey: { allowNull: false },
      as: 'spesifikasiSafety',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return SpesifikasiSafetyGalery;
};
