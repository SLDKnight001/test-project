import { User } from '../model/User';
import { UpdateUserStatusDto } from '../dto/User.dto';

export class UserService {
    static async getAllUsers(filterParams: any) {
        const {
            page = 1,
            limit = 10,
            sort = 'createdAt',
            order = 'desc',
            search,
            role,
            status = 'active'
        } = filterParams;

        const skip = (Number(page) - 1) * Number(limit);
        const filter: any = {};

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) {
            filter.role = role;
        }

        if (status) {
            filter.status = status;
        }

        const sortObj: any = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        const users = await User.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit));

        const total = await User.countDocuments(filter);

        return {
            users,
            total
        };
    }

    static async getUserById(id: string) {
        return await User.findById(id);
    }

    static async updateUserStatus(id: string, { status }: UpdateUserStatusDto) {
        if (!['active', 'inactive'].includes(status)) {
            throw new Error('Invalid status. Must be active or inactive');
        }

        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        user.status = status;
        await user.save();
        return user;
    }

    static async getUserStats() {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const inactiveUsers = await User.countDocuments({ status: 'inactive' });
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const customerUsers = await User.countDocuments({ role: 'customer' });

        const usersByMonth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            adminUsers,
            customerUsers,
            usersByMonth
        };
    }
}