module.exports = (sequelize, DataTypes) => {
  const SpesifikasiEntertainment = sequelize.define(
    'SpesifikasiEntertainment',
    {
      usbAndAux: DataTypes.STRING,
      bluetooth: DataTypes.STRING,
      androidAuto: DataTypes.STRING,
      appleCarPlay: DataTypes.STRING,
      speakerBrand: DataTypes.STRING,
      speakerFront: DataTypes.STRING,
      speakerRear: DataTypes.STRING,
      radioCdDvd: DataTypes.STRING,
      rearTvDisplay: DataTypes.STRING,
      rearPassangerController: DataTypes.STRING,
      headLight: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  SpesifikasiEntertainment.associate = models => {
    SpesifikasiEntertainment.hasMany(models.SpesifikasiEntertainmentGalery, {
      foreignKey: 'spesifikasiEntertainmentId',
      as: 'galleries'
    });
  };
  return SpesifikasiEntertainment;
};