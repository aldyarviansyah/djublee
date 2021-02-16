module.exports = (sequelize, DataTypes) => {
  const SpesifikasiPerforma = sequelize.define(
    'SpesifikasiPerforma',
    {
      akselerasi: DataTypes.STRING,
      mile: DataTypes.STRING,
      tipeBahanBakar: DataTypes.STRING,
      konsumsiBahanBakarTol: DataTypes.STRING,
      topSpeed: DataTypes.STRING,
      breaking: DataTypes.STRING,
      konsumsiBahanBakarNormal: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  SpesifikasiPerforma.associate = models => {
    SpesifikasiPerforma.hasMany(models.SpesifikasiPerformaGalery, {
      foreignKey: 'spesifikasiPerformaId',
      as: 'galleries'
    });
  };
  return SpesifikasiPerforma;
};
