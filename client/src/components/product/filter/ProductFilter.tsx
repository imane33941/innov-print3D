import { useEffect, useState } from "react";
import type { ProductsFilterProps } from "../../../types/product";
import "./ProductFilter.css";
import {
  ArrowDownSquare,
  ArrowUpSquare,
  Box,
  FunnelFill,
  Search,
  XCircle,
} from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router";
import { useProductSearch } from "../../../contexts/ProductSearchContext";

function ProductsFilter({ filters }: ProductsFilterProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { suggestions, resetSearch } = useProductSearch();

  useEffect(() => {
    if (location.pathname === "/products") {
      resetSearch();
    }
  }, [location.pathname, resetSearch]);

  useEffect(() => {
    const resize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const {
    minPrice,
    minPriceChange,
    maxPrice,
    maxPriceChange,
    category,
    categoryChange,
    setSortByPrice,
    sortByPrice,
    productName,
  } = filters;

  const resetFilters = () => {
    filters.productNameChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
    minPriceChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
    maxPriceChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
    categoryChange("");

    setSortByPrice("");
  };

  return (
    <div className="border border-2 shadow-lg rounded-4 p-3 mb-4 background-gradient">
      <h3 className="card-title fs-3 mb-3 d-flex align-items-center gap-2">
        <FunnelFill /> Filtrer
      </h3>

      {isMobile && (
        <div className="text-center mb-3">
          <button
            className="show-filter-btn btn btn-outline-secondary btn-light w-25"
            type="button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <ArrowUpSquare /> : <ArrowDownSquare />}
          </button>
        </div>
      )}

      {(showFilters || !isMobile) && (
        <div className="d-flex flex-wrap align-items-end gap-3">
          <div
            className="flex-grow-1 position-relative"
            style={{ minWidth: "250px" }}
          >
            <label htmlFor="" className="form-label mb-1 fw-bold">
              Rechercher
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Search />
              </span>
              <input
                type="text"
                className="form-control"
                value={productName ?? ""}
                placeholder="Nom du produit..."
                onChange={filters.productNameChange}
              />
              <button
                className="btn text-white search-color fw-semibold"
                type="button"
              >
                Rechercher
              </button>
            </div>

            {suggestions && suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100 shadow-sm mt-1 z-3">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => navigate(`/product/${item.id}`)}
                    onKeyDown={() => navigate(`/product/${item.id}`)}
                  >
                    <Box className="me-2" />
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="" className="form-label mb-1 fw-bold">
              Prix min
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={minPrice ?? ""}
                onChange={minPriceChange}
                min={0}
              />
              <span className="input-group-text fw-bold">€</span>
            </div>
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="" className="form-label mb-1 fw-bold">
              Prix max
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={maxPrice ?? ""}
                onChange={maxPriceChange}
                min={0}
              />
              <span className="input-group-text fw-bold">€</span>
            </div>
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="" className="form-label mb-1 fw-bold">
              Trier
            </label>
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-outline-danger fw-semibold ${sortByPrice === "price-asc" ? "active" : ""}`}
                onClick={() => setSortByPrice("price-asc")}
              >
                ↑ Croissant
              </button>
              <button
                type="button"
                className={`btn btn-outline-danger fw-semibold ${sortByPrice === "price-desc" ? "active" : ""}`}
                onClick={() => setSortByPrice("price-desc")}
              >
                ↓ Décroissant
              </button>
            </div>
          </div>

          <div
            className="d-flex flex-column flex-grow-1"
            style={{ minWidth: "200px" }}
          >
            <label htmlFor="" className="form-label mb-1 fw-bold">
              Catégorie
            </label>
            <select
              className="form-select"
              value={category ?? ""}
              onChange={(e) => categoryChange(e.target.value)}
            >
              <option value="">Toutes</option>
              <option value="1">Figurines</option>
              <option value="2">Objets pratiques</option>
              <option value="3">Jeux</option>
              <option value="4">Divers</option>
            </select>
          </div>

          <div className="ms-auto">
            <button
              className="btn btn-danger mt-3"
              type="button"
              onClick={resetFilters}
            >
              <XCircle className="me-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsFilter;
