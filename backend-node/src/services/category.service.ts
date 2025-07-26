import { Category } from '../model/Category';
import { Product } from '../model/Product';
import { CreateCategoryDto } from '../dto/Category.dto';

export class CategoryService {
    static async createCategory(categoryData: CreateCategoryDto) {
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') }
        });

        if (existingCategory) {
            throw new Error('Category with this name already exists');
        }

        const category = new Category(categoryData);
        await category.save();
        return category;
    }

    static async getAllCategories(status?: string) {
        const filter: any = {};
        if (status) {
            filter.status = status;
        }

        return await Category.find(filter).sort({ name: 1 });
    }

    static async updateCategory(id: string, updateData: any) {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }

        if (updateData.name && updateData.name !== category.name) {
            const existingCategory = await Category.findOne({
                name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
                _id: { $ne: id }
            });

            if (existingCategory) {
                throw new Error('Category with this name already exists');
            }
        }

        Object.assign(category, updateData);
        await category.save();
        return category;
    }

    static async deleteCategory(id: string) {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }

        const productsUsingCategory = await Product.countDocuments({ category: id, status: 'active' });
        if (productsUsingCategory > 0) {
            throw new Error('Cannot delete category that is being used by products');
        }

        category.status = 'inactive';
        await category.save();
    }

    static async getCategoryStats() {
        const totalCategories = await Category.countDocuments({ status: 'active' });
        const inactiveCategories = await Category.countDocuments({ status: 'inactive' });

        const categoriesWithProductCount = await Category.aggregate([
            { $match: { status: 'active' } },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'products'
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    productCount: { $size: '$products' }
                }
            },
            { $sort: { productCount: -1 } }
        ]);

        return {
            totalCategories,
            inactiveCategories,
            categoriesWithProductCount
        };
    }
}