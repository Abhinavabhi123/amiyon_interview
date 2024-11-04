module.exports=(sequelize, DataTypes)=>{
    const Employee = sequelize.define("employee",{
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING,
            validate: {
                isNumeric: true,
            },
        },
        // companyId:{
        //     type:DataTypes.INTEGER,
        //     references: {
        //         model: 'companies', 
        //         key: 'id',          
        //     },
        // }
    })
    // Employee.associate = (models) => {
    //     Employee.belongsTo(models.company, {
    //         foreignKey: 'companyId',
    //         as: 'company',
    //     });
    // };
    return Employee
}