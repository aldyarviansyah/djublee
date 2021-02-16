module.exports = (sequelize, DataTypes) => {
  const SpesifikasiDimensiGalery = sequelize.define(
    'SpesifikasiDimensiGalery',
    {
      file: DataTypes.STRING,
      spesifikasiDimensiId: DataTypes.INTEGER
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  SpesifikasiDimensiGalery.associate = function(models) {
    SpesifikasiDimensiGalery.belongsTo(models.SpesifikasiDimensi, {
      foreignKey: 'spesifikasiDimensiId',
      as: 'spesifikasiDimensi',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return SpesifikasiDimensiGalery;
};
