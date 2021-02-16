module.exports = (sequelize, DataTypes) => {
  const SpesifikasiSafety = sequelize.define(
    'SpesifikasiSafety',
    {
      seatBelts: DataTypes.STRING,
      airbagDriver: DataTypes.STRING,
      airbagFrontPassanger: DataTypes.STRING,
      airbagRearPassanger: DataTypes.STRING,
      electronicStabilityControl: DataTypes.STRING,
      rearCrossTrafficControl: DataTypes.STRING,
      forwardCollisionWarning: DataTypes.STRING,
      blindSpotWarning: DataTypes.STRING,
      nightVision: DataTypes.STRING,
      engineImmobilizer: DataTypes.STRING,
      seatBeltsReminder: DataTypes.STRING,
      childSafetyLock: DataTypes.STRING,
      abs: DataTypes.STRING,
      automaticEmergencyBrake: DataTypes.STRING,
      adaptiveCruiseControl: DataTypes.STRING,
      laneDepartureWarningAndAssist: DataTypes.STRING,
      autonomusDriving: DataTypes.STRING,
      antiTheftAlarm: DataTypes.STRING,
      crashTestRating: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  SpesifikasiSafety.associate = models => {
    SpesifikasiSafety.hasMany(models.SpesifikasiSafetyGalery, {
      foreignKey: 'spesifikasiSafetyId',
      as: 'galleries'
    });
  };
  return SpesifikasiSafety;
};
