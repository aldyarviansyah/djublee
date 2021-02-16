module.exports = (sequelize, DataTypes) => {
  const CarSpesifikasi = sequelize.define(
    'CarSpesifikasi',
    {
      carId: DataTypes.INTEGER,
      spesifikasiInteriorId: DataTypes.INTEGER,
      spesifikasiExteriorId: DataTypes.INTEGER,
      spesifikasiMesinId: DataTypes.INTEGER,
      spesifikasiPerformaId: DataTypes.INTEGER,
      spesifikasiDimensiId: DataTypes.INTEGER,
      spesifikasiSafetyId: DataTypes.INTEGER,
      spesifikasiEntertainmentId: DataTypes.INTEGER,

    },
    { timestamps: true, paranoid: true }
  );
  CarSpesifikasi.associate = function(models) {
    CarSpesifikasi.belongsTo(models.Car, {
      foreignKey: "carId",
      as: 'car',
      onDelete: 'cascade'
    });
    CarSpesifikasi.belongsTo(models.SpesifikasiInterior, {
      foreignKey: "spesifikasiInteriorId",
      as: 'spesifikasiInterior'
    });
    CarSpesifikasi.belongsTo(models.SpesifikasiExterior, {
      foreignKey: "spesifikasiExteriorId",
      as: 'spesifikasiExterior'
    });
    CarSpesifikasi.belongsTo(models.SpesifikasiMesin, {
      foreignKey: "spesifikasiMesinId",
      as: 'spesifikasiMesin'
    });
    CarSpesifikasi.belongsTo(models.SpesifikasiPerforma, {
      foreignKey: "spesifikasiPerformaId",
      as: 'spesifikasiPerforma'
    });
    CarSpesifikasi.belongsTo(models.SpesifikasiDimensi, {
      foreignKey: "spesifikasiDimensiId",
      as: 'spesifikasiDimensi'
    });
    CarSpesifikasi.belongsTo(models.SpesifikasiSafety, {
      foreignKey: "spesifikasiSafetyId",
      as: 'spesifikasiSafety'
    });
    CarSpesifikasi.belongsTo(models.SpesifikasiEntertainment, {
      foreignKey: "spesifikasiEntertainmentId",
      as: 'spesifikasiEntertainment'
    });
    CarSpesifikasi.hasMany(models.Berita, {
      foreignKey: "carSpesifikasiId",
      as: 'berita'
    });
    CarSpesifikasi.hasMany(models.Video, {
      foreignKey: "carSpesifikasiId",
      as: 'video'
    });
  };
  CarSpesifikasi.sync();
  return CarSpesifikasi;
};
