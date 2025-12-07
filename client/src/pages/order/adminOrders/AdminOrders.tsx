import { useEffect, useState } from 'react';
import {
  BellFill,
  Box,
  Building,
  GeoAltFill,
  GlobeAmericasFill,
  PersonFill,
  Receipt,
} from 'react-bootstrap-icons';
import { useAuth } from '../../../contexts/AuthContext';
import type { AdminOrder } from '../../../types/order';
import './AdminOrders.css';
import { useOrdersNotifs } from '../../../contexts/adminOrdersNotifications';
import { StatusIcons, statusClass, statuss } from './AdminOrdersStyles';

const AdminOrders = () => {
  const [adminOrders, setAdimnOrders] = useState<AdminOrder[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetails, setShowDetails] = useState<number[]>([]);

  const { token, currentUser } = useAuth();
  const { unreadOrdersIds, markOrderRead } = useOrdersNotifs();

  useEffect(() => {
    if (!token && currentUser?.role !== 'admin') return;
    const fetchAdminOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/orders?page=${page}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const ordersProducts = await response.json();
        setAdimnOrders(ordersProducts.orders);
        setTotalPages(ordersProducts.pagination.totalPage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdminOrders();
  }, [token, currentUser, page]);

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/order/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      setAdimnOrders((orders) =>
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const btnShowDetails = (orderId: number) => {
    setShowDetails((orderIds) => {
      if (!orderIds.includes(orderId)) {
        markOrderRead(orderId);
        return [...orderIds, orderId];
      }
      orderIds.includes(orderId);
      return orderIds.filter((id) => id !== orderId);
    });
  };

  const OrderRecapHeader = adminOrders.map((order) => ({
    order,
    statusStyle: statusClass(order.status),
    totalArticles: order.products.reduce((acc, p) => acc + p.quantity, 0),
    totalPrice: order.products.reduce(
      (acc, p) => acc + p.quantity * p.unitPrice,
      0,
    ),
  }));

  return (
    <section>
      <div className="d-flex align-items-center justify-content-start p-3 p-md-5 cart-header-title mb-5">
        <h2 className="d-flex align-items-center gap-2 mb-1">
          <Receipt size={28} />
          Gestion des commandes
        </h2>
      </div>
      <div className="container py-4 ">
        {adminOrders.length === 0 ? (
          <p className="text-center fw-semibold">Aucune commande à afficher</p>
        ) : (
          <div className="d-flex flex-column gap-4">
            {OrderRecapHeader.map(
              ({ order, statusStyle, totalArticles, totalPrice }) => (
                <article
                  key={order.orderId}
                  className={`${statusStyle} rounded-3 p-3 shadow-sm border border-secondary`}
                >
                  <div className="border rounded bg-gradient p-4 mb-4 shadow-lg">
                    <div className="row gy-4">
                      <div className="col-12 col-md-5 d-flex flex-column">
                        <h3 className="text-dark mb-3 d-flex align-items-center fs-4">
                          <span>Commande #{order.orderId}</span>
                          {unreadOrdersIds?.includes(order.orderId) && (
                            <span className="rounded-pill bg-danger text-light fs-6 px-3 py-1 ms-3">
                              <BellFill />
                              <small className="ms-2">Non lue</small>
                            </span>
                          )}
                        </h3>
                        <div className="d-flex flex-wrap gap-3 small">
                          <span className="border rounded-pill bg-light text-dark d-flex align-items-center gap-1 px-4 py-2 shadow-sm fw-bold">
                            <Box />
                            {totalArticles}{' '}
                            {totalArticles === 1 ? 'article' : 'articles'}
                          </span>

                          <span className="border rounded-pill bg-info text-dark fw-bold d-flex align-items-center gap-1 px-4 py-2 shadow-sm">
                            {totalPrice.toFixed(2)} €
                          </span>

                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold text-dark">
                              Statut :
                            </span>
                            <span className={`${statusStyle} rounded-4 `}>
                              <StatusIcons status={order.status} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 d-flex flex-column align-self-start">
                        <h4 className="form-label fw-semibold small text-muted fs-6">
                          Adresse de livraison
                        </h4>
                        <div className="small text-muted mb-0 gap-3 gap-md-2 d-flex flex-column">
                          <div className="gap-1 d-flex align-items-center">
                            <PersonFill />
                            <span>
                              {order.firstname} {order.lastname}
                            </span>
                          </div>
                          <div className="gap-1 d-flex align-items-center">
                            <GeoAltFill />
                            <span>{order.street}</span>
                          </div>
                          <div className="gap-1 d-flex align-items-center">
                            <Building />
                            <span>
                              {order.zip_code} {order.city}
                            </span>
                          </div>
                          <div className="gap-1 d-flex align-items-center">
                            <GlobeAmericasFill />
                            <span>{order.country}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-3 d-flex flex-column align-self-start text-md-start">
                        <label
                          htmlFor={`${order.orderId}`}
                          className="form-label fw-semibold small text-muted"
                        >
                          Modifier le statut
                        </label>
                        <select
                          id={`${order.orderId}`}
                          className={`${statusStyle} form-select status-select form-select-sm`}
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.orderId, e.target.value)
                          }
                        >
                          {statuss.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row text-md-center w-100 text-muted mb-3 small">
                    <div className="col-md-4 mb-2 ">
                      <strong>Date :</strong>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Téléphone :</strong> {order.phone}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Email :</strong> {order.email}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => btnShowDetails(order.orderId)}
                    className="fw-semibold px-2 py-1 bg-transparent text-danger border-0"
                  >
                    {showDetails.includes(order.orderId)
                      ? 'Masquer les détails'
                      : 'Afficher les détails'}
                  </button>
                  {showDetails.includes(order.orderId) && (
                    <div className="border-top mt-2">
                      <div className="order-products-scroll">
                        <ul className="row list-unstyled g-3 mt-1">
                          {order.products.map((p) => (
                            <li
                              key={p.productId}
                              className="col-6 col-md-4 col-lg-3 text-center"
                            >
                              <div className="bg-white p-3 rounded shadow-sm h-100">
                                <img
                                  src={`${
                                    import.meta.env.VITE_API_URL
                                  }/uploads/products/${p.image}`}
                                  alt={p.productName}
                                  className="img-fluid rounded mb-2 admin-order-product-img"
                                />
                                <div className="fw-medium small">
                                  <span className="text-dark">
                                    {p.quantity}
                                  </span>{' '}
                                  x{' '}
                                  <span className="text-dark">
                                    {p.productName}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </article>
              ),
            )}
          </div>
        )}
        <div className="d-flex flex-wrap justify-content-center mt-4 gap-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => (page > 1 ? setPage(page - 1) : null)}
            disabled={page === 1}
          >
            <span>&laquo;</span>
          </button>
          <span className="align-self-center fw-semibold text-muted">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => (page < totalPages ? setPage(page + 1) : null)}
            disabled={page === totalPages}
          >
            <span>&raquo;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminOrders;
