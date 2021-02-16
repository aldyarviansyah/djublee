module.exports = (sequelize, DataTypes) => {
  const SpesifikasiEntertainmentGalery = sequelize.define(
    'SpesifikasiEntertainmentGalery',
    {
      file: DataTypes.STRING,
      spesifikasiEntertainmentId: DataTypes.INTEGER
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  SpesifikasiEntertainmentGalery.associate = function(models) {
    SpesifikasiEntertainmentGalery.belongsTo(models.SpesifikasiEntertainment, {
      foreignKey: { allowNull: false },
      as: 'spesifikasiEntertainment',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return SpesifikasiEntertainmentGalery;
};