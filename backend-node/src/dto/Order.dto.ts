export interface CreateOrderDto {
    items: {
        productId: string;
        quantity: number;
    }[];
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
    };
    paymentMethod: 'cash_on_delivery' | 'card' | 'bank_transfer';
    notes?: string;
}

export interface UpdateOrderStatusDto {
    orderStatus?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus?: 'pending' | 'paid' | 'failed';
}