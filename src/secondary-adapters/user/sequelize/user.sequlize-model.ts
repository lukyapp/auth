import { DataTypes } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

abstract class UserAttributes {
  declare public readonly id: string;
  declare public readonly email: string;
  declare public readonly password?: string;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt?: Date;
  declare public readonly deletedAt?: Date;
}

abstract class UserCreationAttributes {
  declare public readonly email: string;
  declare public readonly password?: string;
}

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class UserSequelizeModel extends Model<
  UserAttributes,
  UserCreationAttributes
> {
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  })
  declare public readonly id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare public readonly email: string;

  @Column({
    type: DataType.STRING,
  })
  declare public readonly password?: string;
}
