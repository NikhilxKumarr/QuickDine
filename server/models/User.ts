import {Document,model,Schema } from 'mongoose'

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'user' | 'admin'| 'owner';
    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = new Schema<IUser>(
    {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, 
{ timestamps: true }
);

//Remove password while converting to JSON
UserSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret.password;
    return ret;
  },
});

export const UserModel = model<IUser>('User', UserSchema);