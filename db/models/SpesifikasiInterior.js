module.exports = (sequelize, DataTypes) => {
  const SpesifikasiInterior = sequelize.define(
    'SpesifikasiInterior',
    {
      jokKulit: DataTypes.STRING,
      powerBagasi: DataTypes.STRING,
      centralLockDriver: DataTypes.BOOLEAN,
      centralLockFrontPassanger: DataTypes.BOOLEAN,
      centralLockRearPassanger: DataTypes.BOOLEAN,
      digitalDashboard: DataTypes.STRING,
      headsUpDisplay: DataTypes.STRING,
      touchScreenDisplayJumlah: DataTypes.STRING,
      touchScreenDisplayUkuran: DataTypes.STRING,
      numberOfVentFront: DataTypes.STRING,
      numberOfVentRear: DataTypes.STRING,
      rearPassangerTv: DataTypes.STRING,
      coolBox: DataTypes.STRING,
      vanityMirror: DataTypes.STRING,
      powerWindow: DataTypes.STRING,
      powerSeat: DataTypes.STRING,
      engineStartStop: DataTypes.STRING,
      centralLockAdjustable: DataTypes.BOOLEAN,
      centralLockCruiseControl: DataTypes.BOOLEAN,
      centralLockAudioControl: DataTypes.BOOLEAN,
      centralLockGearshiftPaddle: DataTypes.BOOLEAN,
      navigation: DataTypes.STRING,
      airConditionerDoubleBlower: DataTypes.STRING,
      airConditionerTouchScreenControl: DataTypes.STRING,
      voiceCommandControl: DataTypes.STRING,
      rearPassangerController: DataTypes.STRING,
      ambienceLightning: DataTypes.STRING,
      foldingTable: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  SpesifikasiInterior.associate = models => {
    SpesifikasiInterior.hasMany(models.SpesifikasiInteriorGalery, {
      foreignKey: 'spesifikasiInteriorId',
      as: 'galleries'
    });
  };
  return SpesifikasiInterior;
};
