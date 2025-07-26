import { Cart, CartItem } from '../model/Cart';
import { Product } from '../model/Product';
import { AddToCartDto, UpdateCartItemDto } from '../dto/Cart.dto';

export class CartService {
    static async getCart(userId: string) {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
            await cart.save();
        }

        return this.populateCartItems(cart);
    }

    static async addToCart(userId: string, { productId, quantity }: AddToCartDto) {
        if (!productId || !quantity || quantity < 1) {
            throw new Error('Product ID and valid quantity are required');
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error('Insufficient stock available');
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (product.stock < newQuantity) {
                throw new Error('Insufficient stock available');
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            const newItem = new CartItem({
                productId,
                quantity,
                price: product.discountPrice || product.price
            });
            cart.items.push(newItem);
        }

        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        return this.populateCartItems(cart);
    }

    static async updateCartItem(userId: string, productId: string, { quantity }: UpdateCartItemDto) {
        if (!quantity || quantity < 1) {
            throw new Error('Valid quantity is required');
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error('Insufficient stock available');
        }

        cart.items[itemIndex].quantity = quantity;
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        return this.populateCartItems(cart);
    }

    static async removeFromCart(userId: string, productId: string) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        return this.populateCartItems(cart);
    }

    static async clearCart(userId: string) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        return cart;
    }

    private static async populateCartItems(cart: any) {
        const populatedItems = [];
        for (const item of cart.items) {
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
                        stock: product.stock
                    }
                });
            }
        }
        return {
            ...cart.toObject(),
            items: populatedItems
        };
    }
}