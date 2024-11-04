
module.exports=(sequelize, DataTypes)=>{
    const Company = sequelize.define("company",{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
        },
        logo:{
            type:DataTypes.STRING,
        },
        website:{
            type:DataTypes.STRING,
        },
    })
    return Company
}