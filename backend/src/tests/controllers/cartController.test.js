const request = require('supertest');
const app = require('../../app');
const { Cart, CartItem, Product, User } = require('../../models');
const jwt = require('jsonwebtoken');

jest.mock('../../models');
jest.mock('jsonwebtoken');

describe('CartController', () => {
  let user;
  let product;
  let token;
  let cartItem;

  beforeAll(() => {
    user = { id: 1, username: 'testcart', email: 'testcart@example.com', roles: ['user'] };
    product = { id: 1, name: 'Test Product', price: 100 };
    token = 'mocked-token';

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: user.id, roles: ['user'] });
    });

    User.findByPk.mockResolvedValue(user);
    Product.findByPk.mockResolvedValue(product);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('addToCart', () => {
    beforeEach(() => {
      Cart.findOne.mockResolvedValue(null);
      Cart.create.mockResolvedValue({ id: 1, userId: user.id });
      CartItem.findOne.mockResolvedValue(null);
      CartItem.create.mockResolvedValue({ cartId: 1, productId: product.id, quantity: 1 });
    });

    it('should add a product to the cart', async () => {
      const response = await request(app)
        .post('/carts')
        .send({ productId: product.id, quantity: 1 })
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(201);
      expect(response.body.productId).toBe(product.id);
      expect(response.body.quantity).toBe(1);
    });

    it('should return 404 if product does not exist', async () => {
      Product.findByPk.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/carts')
        .send({ productId: 999, quantity: 1 })
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(404);
    });
  });

  describe('getCartItems', () => {
    beforeEach(() => {
      const cartItems = [{ id: 1, cartId: 1, productId: product.id, quantity: 1, Product: product }];
      const cart = { id: 1, userId: user.id, CartItems: cartItems };
      Cart.findOne.mockResolvedValue(cart);
    });

    it('should return cart items for the user', async () => {
      const response = await request(app)
        .get('/carts')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.CartItems.length).toBeGreaterThan(0);
    });

    it('should return empty if user does not have a cart', async () => {
      Cart.findOne.mockResolvedValueOnce(null);

      const response = await request(app)
        .get('/carts')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      Cart.findOne.mockResolvedValue({ id: 1, userId: user.id });
      cartItem = { id: 1, cartId: 1, productId: product.id, quantity: 1, destroy: jest.fn().mockResolvedValue(1) };
      CartItem.findOne.mockResolvedValue(cartItem);
    });

    it('should remove a product from the cart', async () => {
      const response = await request(app)
        .delete(`/carts/${product.id}`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(204);
      expect(cartItem.destroy).toHaveBeenCalled();
    });

    it('should return 404 if cart item does not exist', async () => {
      CartItem.findOne.mockResolvedValueOnce(null);

      const response = await request(app)
        .delete(`/carts/${product.id}`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(404);
    });
  });
});
