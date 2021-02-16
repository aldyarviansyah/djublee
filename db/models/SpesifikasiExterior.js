module.exports = (sequelize, DataTypes) => {
  const SpesifikasiExterior = sequelize.define(
    'SpesifikasiExterior',
    {
      warna: DataTypes.STRING,
      spionElectric: DataTypes.BOOLEAN,
      spionFolding: DataTypes.BOOLEAN,
      spionLampuSignal: DataTypes.BOOLEAN,
      fogLamp: DataTypes.STRING,
      doorHandle: DataTypes.STRING,
      keylessEntryPintuPenumpang: DataTypes.BOOLEAN,
      keylessEntryBagasi: DataTypes.BOOLEAN,
      sunRoof: DataTypes.STRING,
      tipeCat: DataTypes.STRING,
      headLight: DataTypes.STRING,
      tailLight: DataTypes.STRING,
      signalLight: DataTypes.STRING,
      doorSoftClose: DataTypes.STRING,
      parkingSensor: DataTypes.STRING,
      bentukKnalpot: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  SpesifikasiExterior.associate = models => {
    SpesifikasiExterior.hasMany(models.SpesifikasiExteriorGalery, {
      foreignKey: 'spesifikasiExteriorId',
      as: 'galleries'
    });
  };
  return SpesifikasiExterior;
};