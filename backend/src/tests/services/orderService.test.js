const { Order, OrderItem, Product } = require("~models");
const { PAYMENT_METHOD_PAYPAL, PAYMENT_METHOD_STRIPE } = require("~constants/paymentMethod");
const BadRequestError = require("~errors/BadRequestError");
const { createOrder } = require("~services/orderService");

jest.mock("~models", () => ({
    Order: {
        create: jest.fn(),
    },
    OrderItem: {
        bulkCreate: jest.fn(),
    },
    Product: {
        findByPk: jest.fn(),
    },
}));

describe("createOrder", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw BadRequestError if userId is not provided", async () => {
        await expect(createOrder(null, [])).rejects.toThrow(BadRequestError);
        await expect(createOrder(null, [])).rejects.toThrow("User ID is required");
    });

    it("should throw BadRequestError if payment method is invalid", async () => {
        await expect(createOrder(1, [], { paymentMethod: "invalid_method" })).rejects.toThrow(BadRequestError);
        await expect(createOrder(1, [], { paymentMethod: "invalid_method" })).rejects.toThrow("Invalid payment method");
    });

    it("should throw BadRequestError if items array is empty", async () => {
        await expect(createOrder(1, [])).rejects.toThrow(BadRequestError);
        await expect(createOrder(1, [])).rejects.toThrow("Order must have items");
    });

    it("should throw BadRequestError if a product is not found", async () => {
        Product.findByPk.mockResolvedValue(null);
        Order.create.mockResolvedValue({ id: 1 });

        await expect(createOrder(1, [{ productId: 1, quantity: 2 }])).rejects.toThrow(BadRequestError);
        await expect(createOrder(1, [{ productId: 1, quantity: 2 }])).rejects.toThrow("Product with ID 1 not found");
    });

    it("should create an order with valid inputs", async () => {
        const mockProduct = { dataValues: { price: 100 } };
        Product.findByPk.mockResolvedValue(mockProduct);
        Order.create.mockResolvedValue({ id: 1 });
        OrderItem.bulkCreate.mockResolvedValue([]);

        const order = await createOrder(1, [{ productId: 1, quantity: 2 }], { paymentMethod: PAYMENT_METHOD_PAYPAL });

        expect(Order.create).toHaveBeenCalledWith({ userId: 1, paymentMethod: PAYMENT_METHOD_PAYPAL });
        expect(Product.findByPk).toHaveBeenCalledWith(1);
        expect(OrderItem.bulkCreate).toHaveBeenCalledWith([
            {
                orderId: 1,
                productId: 1,
                quantity: 2,
                unitPrice: 100,
                subtotal: 200,
            },
        ]);
        expect(order).toEqual({ id: 1 });
    });

    it("should use default payment method if not provided", async () => {
        const mockProduct = { dataValues: { price: 100 } };
        Product.findByPk.mockResolvedValue(mockProduct);
        Order.create.mockResolvedValue({ id: 1 });
        OrderItem.bulkCreate.mockResolvedValue([]);

        const order = await createOrder(1, [{ productId: 1, quantity: 2 }]);

        expect(Order.create).toHaveBeenCalledWith({ userId: 1, paymentMethod: PAYMENT_METHOD_PAYPAL });
        expect(Product.findByPk).toHaveBeenCalledWith(1);
        expect(OrderItem.bulkCreate).toHaveBeenCalledWith([
            {
                orderId: 1,
                productId: 1,
                quantity: 2,
                unitPrice: 100,
                subtotal: 200,
            },
        ]);
        expect(order).toEqual({ id: 1 });
    });
});
