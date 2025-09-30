import { useState } from "react";
import { toast } from "react-toastify";
import AddProduct from "../../../components/product/adminManagement/addProduct/Addproduct";
import { useProductSearch } from "../../../contexts/ProductSearchContext";
import type { ProductType } from "../../../types/product";
import "./ProductsManagement.css";
import { Box, Pencil, ShieldLockFill, StarFill, Trash, Trash2Fill } from "react-bootstrap-icons";
import ModifyOrDeleteProduct from "../../../components/product/adminManagement/modifyOrDeleteProduct/ModifyOrDeleteProduct";
import { useAuth } from "../../../contexts/AuthContext";

function Admin() {
  const { productName, suggestions, fetchSuggestions } = useProductSearch();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const { token } = useAuth();
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    fetchSuggestions(value);
  };

  const { products } = useProductSearch()

  const fetchProductDetails = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedProduct(data);
      })
      .catch((err) => console.error(err));
  };

  const searchBar = {
    productName,
    suggestions,
    productNameChange: onSearchInputChange,
  };

  const newProduct: ProductType = {
    id: -1,
    name: "",
    description: "",
    price: 0,
    category_id: 0,
    images: [],
    trend_product: "",
  };

  const deleteProduct = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/product/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        toast.success("Produit supprimé !");
        setSelectedProduct(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-start p-3 p-md-5 cart-header-title mb-4">
        <h2 className="d-flex align-items-center gap-2 mb-1">
          <ShieldLockFill size={28} />
          Tableau de bord produits
        </h2>
      </div>
      {/* Statistiques globales */}
      <div className="container my-5">
        {/* Dashboard Header */}
        <div className="mb-4">
          <p className="text-muted">Visualisez vos statistiques et gérez vos produits</p>
        </div>

        {/* Panels statistiques */}
        <div className="row g-4">

          {/* Total produits */}
          <div className="col-lg-3 col-md-4">
            <div className="card shadow-sm rounded-5 p-3 d-flex flex-row align-items-center gap-4"
              style={{ backgroundColor: "#4e73df", color: "#fff" }}>
              <Box size={32} />
              <div>
                <h6 className="fw-bold">Total produits</h6>
                <p className="display-6 fw-bold mb-0">{products.length}</p>
              </div>
            </div>
          </div>

          {/* Produits tendances */}
          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm rounded-5 p-3 d-flex flex-row align-items-center gap-4"
              style={{ backgroundColor: "#1cc88a", color: "#fff" }}>
              <StarFill size={32} />
              <div>
                <h6 className="fw-bold">Produits tendances</h6>
                <p className="display-6 fw-bold mb-0">
                  {products.filter(p => p.trend_product && p.trend_product !== "Aucun").length}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques par catégorie */}
          {[...new Set(products.map(p => p.category_name))].map(category => (
            <div key={category} className="col-md-6 col-lg-3">
              <div className="card shadow-sm rounded-5 p-3 d-flex flex-row align-items-center gap-3">
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={products.find(p => p.category_name === category)?.images[0]
                      ? `${import.meta.env.VITE_API_URL}/uploads/products/${products.find(p => p.category_name === category)?.images[0]}`
                      : "https://via.placeholder.com/60"}
                    alt={category}
                    className="rounded-circle"
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{category}</h6>
                  <p className="mb-0 text-muted">
                    {products.filter(p => p.category_name === category).length} produits
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Ajouter un produit */}
          <div className="col-lg-6 col-md-6">
            <div className="card shadow-sm rounded-5  text-center d-flex flex-column justify-content-center align-items-center"
              style={{ backgroundColor: "#f6c23e" }}>
              <h6 className="fw-bold mt-2">Ajouter un produit</h6>
              <AddProduct
                productDetails={newProduct}
                onSubmit={(formData) => {
                  return fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                  })
                    .then(async (res) => {
                      if (!res.ok) {
                        const data = await res.json();
                        data?.validationErrors?.forEach((err: any) => toast.error(err.message));
                        return { success: false };
                      }
                      return { success: true };
                    })
                    .then((result) => {
                      if (result.success) toast.success("Produit créé !");
                      return result;
                    })
                    .catch((err) => {
                      console.error(err);
                      return { success: false };
                    });
                }}
              />
            </div>
          </div>

        </div>
      </div>




      <div className="container my-5">
        <h4 className="fw-bold mb-4 text-center">Produits existants</h4>
        <ModifyOrDeleteProduct
          searchBar={searchBar}
          productDetails={selectedProduct || newProduct}
          onFetchProductDetails={fetchProductDetails}
          onSubmit={(formData, productId) => {
            fetch(`${import.meta.env.VITE_API_URL}/api/product/${productId}`, {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            })
              .then(async (response) => {
                if (!response.ok) {
                  const errorData = await response.json();

                  if (
                    errorData?.validationErrors &&
                    Array.isArray(errorData.validationErrors)
                  ) {
                    for (const err of errorData.validationErrors) {
                      toast.error(err.message);
                    }
                  } else {
                    toast.error("Erreur lors de la modification du produit");
                  }

                  throw new Error("Erreur validation produit");
                }

                return response.json();
              })
              .then(() => {
                toast.success("Produit modifié !");
              })
              .catch((err) => {
                console.error(err);
              });
          }}
          onDelete={(productId) => deleteProduct(productId)}
        />


        {products.length === 0 ? (
          <p className="text-muted text-center">Aucun produit trouvé.</p>
        ) : (
          <div className="row g-4">
            {products.map((prod) => (
              <div key={prod.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card rounded-4 shadow-sm overflow-hidden position-relative product-card">

                  {/* Image */}
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/products/${prod.images[0]}`}
                    alt={prod.name}
                    className="card-img-top product-img"
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                  />

                  {/* Overlay infos */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3 overlay">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="text-white fw-bold mb-0">{prod.name}</h6>
                      {prod.trend_product && prod.trend_product !== "Aucun" && (

                        <span className="badge bg-success position-absolute top-0 end-0 m-2">Tendance</span>

                      )}
                    </div>
                    <p className="text-white fw-bold mb-1">{prod.price} €</p>
                    <span className="badge bg-secondary position-absolute top-0 start-0 m-2">{prod.category_name}</span>
                  </div>

                  {/* Actions au hover */}
                  <div className="position-absolute top-50 start-50 translate-middle d-flex gap-2 action-buttons">
                    <button type="button"
                      className="btn btn-sm btn-light d-flex align-items-center gap-1"
                      onClick={() => setSelectedProduct(prod)}
                    >
                      <Pencil size={20} />
                    </button>
                    <button type="button"
                      className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                      onClick={() => deleteProduct(prod.id)}
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Composant ModifyOrDeleteProduct en modal */}

      </div>

      {/* CSS additionnel */}
      <style>
        {`
  .product-card {
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
  }

  .product-card:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 25px rgba(0,0,0,0.2);
  }

  .product-card .overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.65), transparent);
    transition: background 0.3s;
  }

  .product-card:hover .overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  }

  .product-card .action-buttons {
    opacity: 0;
    transition: opacity 0.3s;
  }

  .product-card:hover .action-buttons {
    opacity: 1;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }
`}
      </style>




    </>

  );
}
export default Admin;
