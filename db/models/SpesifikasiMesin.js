module.exports = (sequelize, DataTypes) => {
  const SpesifikasiMesin = sequelize.define(
    'SpesifikasiMesin',
    {
      tipe: DataTypes.STRING,
      kapasitasTangki: DataTypes.STRING,
      maxTorque: DataTypes.STRING,
      valvePerCylinder: DataTypes.STRING,
      transmisi: DataTypes.STRING,
      clutch: DataTypes.STRING,
      kapasitasMesin: DataTypes.STRING,
      maxPower: DataTypes.STRING,
      cylinder: DataTypes.STRING,
      turboCharged: DataTypes.STRING,
      gearbox: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  SpesifikasiMesin.associate = models => {
    SpesifikasiMesin.hasMany(models.SpesifikasiMesinGalery, {
      foreignKey: 'spesifikasiMesinId',
      as: 'galleries'
    });
  };
  return SpesifikasiMesin;
};
