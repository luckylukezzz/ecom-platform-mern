import { Schema, model} from 'mongoose';

export interface Iuser{
    _id?: string;
    username: string;
    password: string;
    availableMoney: number;
   // purchasedItems:string[];
}

const UserSchema = new Schema<Iuser>({
    username:{type: String , required: true , unique: true},
    password: {type: String , required: true },
    availableMoney: {type: Number , default: 5000},
   // purchasedItems: {type: String , required: true
});

export const UserModel = model<Iuser>("users",UserSchema);