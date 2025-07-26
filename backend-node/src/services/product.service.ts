import { Product } from '../model/Product';
import { Category } from '../model/Category';
import { CreateProductDto, UpdateProductDto } from '../dto/Product.dto';
import { ProductFilter } from '../types';

export class ProductService {
    static async getAllProducts(filterParams: ProductFilter) {
        const {
            page = 1,
            limit = 12,
            sort = 'createdAt',
            order = 'desc',
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            featured,
            status = 'active'
        } = filterParams;

        const skip = (Number(page) - 1) * Number(limit);
        const filter: any = { status };

        if (search) {
            filter.$text = { $search: search };
        }

        if (category) {
            const categoryDoc = await Category.findOne({ name: category, status: 'active' });
            if (!categoryDoc) {
                return {
                    products: [],
                    total: 0
                };
            }
            filter.category = categoryDoc.name;
        }

        if (brand) {
            filter.brand = brand;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (featured !== undefined) {
            filter.featured = String(featured).toLowerCase() === 'true';
        }

        const sortObj: any = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        const products = await Product.find(filter)
            .populate('category', 'name')
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        return {
            products,
            total
        };
    }

    static async getProductById(id: string) {
        return await Product.findById(id).populate('category', 'name description');
    }

    static async createProduct(productData: CreateProductDto) {
        const category = await Category.findOne({
            name: productData.category,
            status: 'active'
        });

        if (!category) {
            throw new Error('Invalid category selected');
        }

        const product = new Product({
            ...productData,
            category: category.name
        });

        await product.save();
        return product;
    }

    static async updateProduct(id: string, updateData: UpdateProductDto) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        if (updateData.category) {
            const category = await Category.findOne({
                name: updateData.category,
                status: 'active'
            });
            if (!category) {
                throw new Error('Invalid category selected');
            }
            updateData.category = category.name;
        }

        Object.assign(product, updateData);
        await product.save();
        return product;
    }

    static async deleteProduct(id: string) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        product.status = 'inactive';
        await product.save();
    }

    static async getFeaturedProducts(limit: number = 8) {
        return await Product.find({ featured: true, status: 'active' })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    static async getProductsByCategory(categoryName: string, page: number = 1, limit: number = 12, sort: string = 'createdAt', order: string = 'desc') {
        const skip = (Number(page) - 1) * Number(limit);
        const sortObj: any = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        const category = await Category.findOne({ name: categoryName, status: 'active' });
        if (!category) {
            return {
                products: [],
                total: 0
            };
        }

        const products = await Product.find({ category: categoryName, status: 'active' })
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments({ category: categoryName, status: 'active' });

        return {
            products,
            total
        };
    }

    static async searchProducts(query: string, page: number = 1, limit: number = 12) {
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find({
            $text: { $search: query },
            status: 'active'
        })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments({
            $text: { $search: query },
            status: 'active'
        });

        return {
            products,
            total,
            query
        };
    }

    static async getProductStats() {
        const totalProducts = await Product.countDocuments({ status: 'active' });
        const featuredProducts = await Product.countDocuments({ featured: true, status: 'active' });
        const outOfStock = await Product.countDocuments({ stock: 0, status: 'active' });
        const lowStock = await Product.countDocuments({ stock: { $lte: 10, $gt: 0 }, status: 'active' });

        const categories = await Product.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const brands = await Product.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return {
            totalProducts,
            featuredProducts,
            outOfStock,
            lowStock,
            categories,
            brands
        };
    }
}