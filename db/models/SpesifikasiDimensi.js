module.exports = (sequelize, DataTypes) => {
  const SpesifikasiDimensi = sequelize.define(
    'SpesifikasiDimensi',
    {
      lxwxhx: DataTypes.STRING,
      wheelBase: DataTypes.STRING,
      kapasitasBagasi: DataTypes.STRING,
      groundClearance: DataTypes.STRING,
      kapasitasPenumpang: DataTypes.INTEGER,
      jumlahPintu: DataTypes.INTEGER,

    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  SpesifikasiDimensi.associate = models => {
    SpesifikasiDimensi.hasMany(models.SpesifikasiDimensiGalery, {
      foreignKey: 'spesifikasiDimensiId',
      as: 'galleries'
    });
  };
  return SpesifikasiDimensi;
};
