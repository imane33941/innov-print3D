import { useCallback, useEffect, useState } from 'react';
import { CartFill, CartX, Dash, Plus, Trash } from 'react-bootstrap-icons';
import './CartList.css';
import { ReadMore } from '../../components/ReadMore';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useOrdersNotifs } from '../../contexts/adminOrdersNotifications';
import type { Message } from '../../types/cart';

function CartList() {
  const { cartProducts, fetchCart, updateQuantity, deleteProduct } = useCart();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const { currentUser, token } = useAuth();
  const userId = currentUser?.id;
  const { fetchUnreadOrders } = useOrdersNotifs();

  let totalSelectedPrice = 0;
  for (const product of cartProducts) {
    if (selectedProducts.includes(product.productId)) {
      totalSelectedPrice += product.price * product.quantity;
    }
  }

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      setSelectedProducts(cartProducts.map((p) => p.productId));
    }
  }, [cartProducts]);

  const checkProduct = (productId: number) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const createAnOrder = useCallback(async () => {
    setMessage(null);

    try {
      const productToOrder = cartProducts.filter((p) =>
        selectedProducts.includes(p.productId),
      );

      const checkoutSessionResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/users/${userId}/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            totalAmount: totalSelectedPrice,
            successUrl: `http://localhost:3000/order/${userId}/paymentsuccess`,
            cancelUrl: `http://localhost:3000/order/${userId}/paymentfail`,
            products: productToOrder,
          }),
        },
      );
      fetchCart();
      fetchUnreadOrders();
      const { url } = await checkoutSessionResponse.json();
      window.location.href = url;
    } catch (error) {
      console.error('Erreur lors de la création de commande:', error);
      setMessage({
        text: 'Erreur lors de la création de la commande. Veuillez réessayer.',
      });
    }
  }, [
    userId,
    token,
    cartProducts,
    selectedProducts,
    totalSelectedPrice,
    fetchUnreadOrders,
    fetchCart,
  ]);

  return (
    <section className="d-flex flex-column">
      <header className="d-flex align-items-center justify-content-start p-3 p-md-5 cart-header-title">
        <h3 className="d-flex align-items-center gap-2 mb-1">
          <CartFill size={28} />
          Mon Panier
          <span className="text-muted fs-6 mt-2">
            ({cartProducts.length} article{cartProducts.length > 1 ? 's' : ''})
          </span>
        </h3>
      </header>
      <main className="container py-4 flex-grow-1">
        {message ? (
          <p>{message.text}</p>
        ) : (
          <div>
            {cartProducts.length > 0 && (
              <div className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between mb-3">
                <span className="text-muted">
                  {selectedProducts.length === 0
                    ? 'Aucun article sélectionné.'
                    : selectedProducts.length === cartProducts.length
                    ? 'Tous les articles sont sélectionnés.'
                    : `${selectedProducts.length} article${
                        selectedProducts.length > 1 ? 's' : ''
                      } sélectionné${selectedProducts.length > 1 ? 's' : ''}.`}
                </span>
                {selectedProducts.length === cartProducts.length ? (
                  <button
                    type="button"
                    className="btn btn-link p-0 text-danger d-flex justify-content-start"
                    onClick={() => setSelectedProducts([])}
                  >
                    Désélectionner tous les articles
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn p-0 d-flex justify-content-start text-dart text-decoration-underline"
                    onClick={() =>
                      setSelectedProducts(cartProducts.map((p) => p.productId))
                    }
                  >
                    Sélectionner tous les articles
                  </button>
                )}
              </div>
            )}
            {cartProducts.length === 0 ? (
              <div className="d-flex flex-column justify-content-center align-items-center text-muted">
                <CartX size={90} className="mb-3" />
                <h4>Votre panier est vide</h4>
              </div>
            ) : (
              <article className="list-group border-5 rounded">
                {cartProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="flex-column list-group-item flex-md-row d-flex align-items-stretch gap-3 gap-md-2 p-3 "
                  >
                    <label className="w-100 d-flex justify-content-center align-items-center gap-4 cart-container">
                      <input
                        type="checkbox"
                        role="button"
                        className="form-check-input border-dark "
                        onChange={() => checkProduct(product.productId)}
                        checked={selectedProducts.includes(product.productId)}
                      />
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL
                        }/uploads/products/${product.images?.[0]}`}
                        alt={`ìmage ${product.productName}`}
                        className="object-fit-cover rounded-2 w-75 h-100"
                      />
                    </label>
                    <div className="flex-grow-1 w-100">
                      <h4 className="mb-1">{product.productName}</h4>
                      <div className="my-2 ">
                        <small className="badge bg-secondary py-1">
                          {product.categoryName}
                        </small>
                      </div>
                      <ReadMore text={product.description} maxLength={100} />
                      <div className="d-flex align-items-center gap-2">
                        <small className="me-2 mb-0 fw-semibold">
                          Quantité :
                        </small>
                        {product.quantity > 1 ? (
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm p-1"
                            aria-label="décrémenter la quantité"
                            onClick={() =>
                              updateQuantity(
                                product.productId,
                                product.quantity - 1,
                              )
                            }
                          >
                            <Dash size={20} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1"
                            onClick={() => deleteProduct(product.productId)}
                            aria-label="supprimer le produit"
                          >
                            <Trash size={20} aria-hidden="true" />
                          </button>
                        )}
                        <span className="fs-5">{product.quantity}</span>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm p-1"
                          aria-label="incrémenter la quantité"
                          onClick={() =>
                            updateQuantity(
                              product.productId,
                              product.quantity + 1,
                            )
                          }
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center justify-content-md-end w-100">
                      <div className="text-end">
                        <div className="fw-bold fs-5">
                          <h5 className="mb-1">
                            <span className="small fw-bold">
                              {product.price}€
                            </span>
                            <span className="text-muted small ms-1">
                              / unité
                            </span>
                          </h5>
                        </div>
                        <div className="text-muted small text-start text-md-center">
                          Total: {(product.price * product.quantity).toFixed(2)}{' '}
                          €
                        </div>
                      </div>
                      {product.quantity > 1 ? (
                        <button
                          type="button"
                          className="d-flex d-md-flex btn btn-link text-danger p-0 ms-3"
                          onClick={() => deleteProduct(product.productId)}
                          aria-label="supprimer le produit"
                        >
                          <Trash size={24} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="d-none d-md-flex btn btn-link text-danger p-0 ms-3"
                          onClick={() => deleteProduct(product.productId)}
                          aria-label="supprimer le produit"
                        >
                          <Trash size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </article>
            )}

            {cartProducts.length > 0 && (
              <div className="z-10 border-top bg-white py-3 px-4 d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center sticky-bottom shadow-sm">
                <h5 className="mb-0 text-dark fw-bold">
                  Total sélectionné : {totalSelectedPrice.toFixed(2)} €
                </h5>
                <button
                  type="button"
                  className="btn px-4 py-2 fw-semibold btn-danger confirmed-cart-btn"
                  disabled={totalSelectedPrice === 0}
                  onClick={createAnOrder}
                >
                  Passer la commande
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </section>
  );
}

export default CartList;
