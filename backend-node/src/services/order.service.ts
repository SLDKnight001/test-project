import { Order } from '../model/Order';
import { Cart } from '../model/Cart';
import { Product } from '../model/Product';
import { User } from '../model/User';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/Order.dto';
import { EmailUtil } from '../utils/email';

export class OrderService {
    static async createOrder(userId: string, orderData: CreateOrderDto) {
        // Validate order items
        if (!orderData.items || orderData.items.length === 0) {
            throw new Error('Order items are required');
        }

        let totalAmount = 0;
        const orderItems = [];

        // Validate each item and calculate total
        for (const item of orderData.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }

            const itemPrice = product.discountPrice || product.price;
            const itemTotal = itemPrice * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: itemPrice,
                totalPrice: itemTotal
            });

            // Update product stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = new Order({
            userId,
            items: orderItems,
            totalAmount,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod,
            notes: orderData.notes
        });

        await order.save();

        // Set orderId for items (after save when _id is available)
        order.items = order.items.map(item => ({
            ...item.toObject(),
            orderId: order._id.toString()
        }));
        await order.save();

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { userId },
            { items: [], totalAmount: 0 }
        );

        // Populate order details
        const populatedOrder = await this.getPopulatedOrder(order._id.toString());

        // Send order confirmation email
        try {
            const user = await User.findById(userId);
            if (user && user.email) {
                await EmailUtil.sendOrderConfirmation(
                    user.email,
                    order.orderNumber,
                    order.totalAmount
                );
            }
        } catch (error) {
            console.error('Failed to send order confirmation email:', error);
        }

        return populatedOrder;
    }

    static async getOrders(filter: any, sort: any, skip: number, limit: number) {
        const orders = await Order.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Populate order details
        const populatedOrders = [];
        for (const orderDoc of orders) {
            const populatedOrder = await this.getPopulatedOrder(orderDoc._id.toString());
            populatedOrders.push(populatedOrder);
        }

        const total = await Order.countDocuments(filter);

        return {
            orders: populatedOrders,
            total
        };
    }

    static async getOrderById(id: string) {
        return await this.getPopulatedOrder(id);
    }

    static async getUserOrders(userId: string, filter: any, sort: any, skip: number, limit: number) {
        const userFilter = { userId, ...filter };
        return await this.getOrders(userFilter, sort, skip, limit);
    }

    static async updateOrderStatus(id: string, updateData: UpdateOrderStatusDto) {
        const order = await Order.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        if (updateData.orderStatus) {
            order.orderStatus = updateData.orderStatus;
        }

        if (updateData.paymentStatus) {
            order.paymentStatus = updateData.paymentStatus;
        }

        await order.save();
        return await this.getPopulatedOrder(order._id.toString());
    }

    static async getOrderStats() {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const confirmedOrders = await Order.countDocuments({ orderStatus: 'confirmed' });
        const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        return {
            totalOrders,
            pendingOrders,
            confirmedOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            monthlyRevenue
        };
    }

    private static async getPopulatedOrder(orderId: string) {
        const order = await Order.findById(orderId);
        if (!order) return null;

        const user = await User.findById(order.userId);
        const populatedItems = [];

        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                populatedItems.push({
                    ...item.toObject(),
                    product: {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        discountPrice: product.discountPrice,
                        images: product.images,
                        brand: product.brand
                    }
                });
            }
        }

        return {
            ...order.toObject(),
            user: user ? {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            } : null,
            items: populatedItems
        };
    }
}