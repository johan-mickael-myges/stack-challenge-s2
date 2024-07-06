const { Cart, CartItem, Product, User } = require('../models');

exports.addToCart = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log request body
        const { productId, userId = 1, quantity } = req.body;

        // Find the product by its ID
        const product = await Product.findByPk(productId);

        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            cart = await Cart.create({ userId });
        }

        // Check if the product is already in the cart
        let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id } });

        if (cartItem) {
            // Update the quantity if the product is already in the cart
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Add the product to the cart with the specified quantity
            cartItem = await CartItem.create({ cartId: cart.id, productId: product.id, quantity });
        }

        console.log(`Added product ${productId} to cart for user ${userId} with quantity ${quantity}`);
        return res.status(200).json({ message: 'Product added to cart', cartItem });
    } catch (error) {
        console.error('Error adding product to carttttt:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verify that the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, include: [Product] }] });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

