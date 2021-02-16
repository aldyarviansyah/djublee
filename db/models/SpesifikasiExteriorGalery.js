module.exports = (sequelize, DataTypes) => {
  const SpesifikasiExteriorGalery = sequelize.define(
    'SpesifikasiExteriorGalery',
    {
      file: DataTypes.STRING,
      spesifikasiExteriorId: DataTypes.INTEGER
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  SpesifikasiExteriorGalery.associate = function(models) {
    SpesifikasiExteriorGalery.belongsTo(models.SpesifikasiExterior, {
      foreignKey: { allowNull: false },
      as: 'spesifikasiExterior',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return SpesifikasiExteriorGalery;
};