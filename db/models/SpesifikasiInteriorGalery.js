module.exports = (sequelize, DataTypes) => {
  const SpesifikasiInteriorGalery = sequelize.define(
    'SpesifikasiInteriorGalery',
    {
      file: DataTypes.STRING,
      spesifikasiInteriorId: DataTypes.INTEGER
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  SpesifikasiInteriorGalery.associate = function(models) {
    SpesifikasiInteriorGalery.belongsTo(models.SpesifikasiInterior, {
      foreignKey: { allowNull: false },
      as: 'spesifikasiInterior',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return SpesifikasiInteriorGalery;
};
