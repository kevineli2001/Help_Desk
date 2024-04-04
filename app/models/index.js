const db = require('../database/config')
const Sequelize = require('sequelize')

const Role = db.define(
  'Role',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  { 
    timestamps: false
  } 
)

const UserStatus = db.define(
  'UserStatus',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  { 
    timestamps: false
  }
)

const User = db.define(
  'User',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id'
      }
    },
    statusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: UserStatus,
        key: 'id'
      }
    },
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING, 
    },
  },
  { 
    timestamps: false
  }
)

const Category = db.define(
  'Category',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    timestamps: false
  }
)

const Provider = db.define(
  'Provider',
  {
    ruc: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    telephone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  { 
    timestamps: false
  }
)

const Invoice = db.define(
  'Invoice',
  {
    code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    providerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Provider,
        key: 'id'
      }
    },
    observation: {
      type: Sequelize.STRING,
      allowNull: false
    },
    date: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    timestamps: false
  }
)

const Inventory = db.define(
  'Inventory',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    quantity: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    damaged: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    invoiceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Invoice,
        key: 'id'
      }
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id'
      }
    }
  },
  { 
    timestamps: false
  }
)

const Image = db.define(
  'Image',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    inventoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Inventory,
        key: 'id'
      }
    },
  },
  { 
    timestamps: false
  } 
)

const DamagedImage = db.define(
  'DamagedImage',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    inventoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Inventory,
        key: 'id'
      }
    },
  },
  { 
    timestamps: false
  } 
)

// Añadimos las relaciones entre las tablas 
Invoice.hasMany(Inventory, {foreignKey: 'invoiceId'})
Inventory.belongsTo(Invoice, {foreignKey: 'invoiceId'})

Category.hasMany(Inventory, {foreignKey: 'categoryId'})
Inventory.belongsTo(Category, {foreignKey: 'categoryId'})

// Define las asociaciones (las relaciones entre los modelos)
Provider.hasMany(Invoice, { foreignKey: 'providerId' })
Invoice.belongsTo(Provider, { foreignKey: 'providerId' })

// Creamos la relacion con el inventario
Inventory.hasMany(Image, {foreignKey: 'inventoryId'})
Image.belongsTo(Inventory, {foreignKey: 'inventoryId'})

// Añadimos las relaciones entre las tablas
Role.hasMany(User, {foreignKey: 'roleId'})
User.belongsTo(Role, {foreignKey: 'roleId'})

UserStatus.hasMany(User, {foreignKey: 'statusId'})
User.belongsTo(UserStatus, {foreignKey: 'statusId'})

// Creamos la relacion con el inventario
Inventory.hasMany(DamagedImage, {foreignKey: 'inventoryId'})
DamagedImage.belongsTo(Inventory, {foreignKey: 'inventoryId'})

module.exports = {
  User,
  UserStatus,
  Role,
  Category,
  Inventory,
  Invoice,
  Provider,
  Image,
  DamagedImage
}