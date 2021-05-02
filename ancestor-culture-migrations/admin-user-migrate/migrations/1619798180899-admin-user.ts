import * as mongoose from 'mongoose';
import { MahUserSchema } from 'src/controllers/user/mah-user/schema/mah-user.schema';
import { adminUser } from '../data/admin.data';
import { IUser } from '../interface/user.interface';
/**
 * Make any changes you need to make to the database here
 */
async function up() {
    // Write migration here
    try {
        console.log('Creating Admin User');
        const UserModel = mongoose.model<IUser>('mah-user', MahUserSchema);
        const newAdmin = new UserModel(adminUser);
        const savedUser = await newAdmin.save();
        console.log(`
      Created admin user:
      Name: ${savedUser.firstName} ${savedUser.lastName}
      Email: ${savedUser.email}
      `);
    } catch (err) {
        console.error(err);
        console.log('Failed to create admin. Quiting...');
    }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
    // Write migration here
}

module.exports = { up, down };
