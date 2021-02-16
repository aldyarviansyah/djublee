module.exports = (sequelize, DataTypes) => {
  const SpesifikasiMesinGalery = sequelize.define(
    'SpesifikasiMesinGalery',
    {
      file: DataTypes.STRING,
      spesifikasiMesinId: DataTypes.INTEGER
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  SpesifikasiMesinGalery.associate = function(models) {
    SpesifikasiMesinGalery.belongsTo(models.SpesifikasiMesin, {
      foreignKey: 'spesifikasiMesinId',
      as: 'spesifikasiMesin',
      onDelete: 'cascade',
      hooks: true,
    });
  };
  return SpesifikasiMesinGalery;
};
