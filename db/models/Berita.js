module.exports = (sequelize, DataTypes) => {
  const Berita = sequelize.define(
    'Berita',
    {
      file: DataTypes.STRING,
      headline: DataTypes.STRING,
      link: DataTypes.STRING,
      carSpesifikasiId: DataTypes.INTEGER

    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  Berita.associate = function(models) {
    Berita.belongsTo(models.CarSpesifikasi, {
      foreignKey: 'carSpesifikasiId',
      as: 'carSpesifikasi',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return Berita;
};