const { Cart, CartItem, Product } = require('~models');

// Placeholder user ID for development mode
const placeholderUserId = 1;

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.query);
    const { productId, quantity } = req.body;
    const userId = placeholderUserId;

    console.log(`Add to Cart: userId=${userId}, productId=${productId}, quantity=${quantity}`);
    // Find or create a cart for the user
    let cart = await Cart.findOne({
        where: { userId },
    });
    console.log(cart);
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // Create or update the cart item
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity
      });
    }

    res.json(cartItem);
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get cart items for the user
exports.getCart = async (req, res) => {
  try {
    const userId = placeholderUserId;

    // Find the cart for the user
    const cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, include: [Product] }] });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart.CartItems);
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    // Delete the cart item
    await CartItem.destroy({ where: { id: cartItemId } });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    // Find the cart item
    let cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Update the quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res.status(500).json({ error: error.message });
  }
};
