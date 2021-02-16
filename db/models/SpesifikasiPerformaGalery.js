module.exports = (sequelize, DataTypes) => {
  const SpesifikasiPerformaGalery = sequelize.define(
    'SpesifikasiPerformaGalery',
    {
      file: DataTypes.STRING,
      spesifikasiPerformaId: DataTypes.INTEGER
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  SpesifikasiPerformaGalery.associate = function(models) {
    SpesifikasiPerformaGalery.belongsTo(models.SpesifikasiPerforma, {
      foreignKey: { allowNull: false },
      as: 'spesifikasiPerforma',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return SpesifikasiPerformaGalery;
};
