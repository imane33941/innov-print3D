import { useState, useRef } from "react";
import type { AddProductProps } from "../../../../types/product";
import { Download, PlusCircle } from "react-bootstrap-icons";

function AddProduct({ productDetails, onSubmit }: AddProductProps) {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<(File | undefined)[]>([undefined, undefined, undefined]);
  const [name, setName] = useState(productDetails.name || "");
  const [price, setPrice] = useState(productDetails.price || "");
  const [description, setDescription] = useState(productDetails.description || "");
  const [category, setCategory] = useState(productDetails.category_id || null);
  const [trendProduct, setTrendProduct] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleOnChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files ? e.target.files[0] : undefined;
    setFiles(newFiles);
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    for (const file of files) {
      if (file) {
        formData.append("images", file);
      }
    }
    formData.set("name", name);
    formData.set("price", String(price));
    formData.set("description", description);
    if (category !== null) formData.set("category_id", String(category));
    if (trendProduct.trim() !== "") formData.set("trend_product", trendProduct);


    onSubmit(formData).then((res) => {
      if (res?.success) {
        formRef.current?.reset();
        setFiles([undefined, undefined, undefined]);
        setCategory(null);
        setTrendProduct("");
        setStep(1);
        setName("");
        setPrice("");
        setDescription("");
        handleCloseModal();
      }
    });
  };

  const renderFormSteps = () => (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* Progress Bar */}
      <div className="progress mb-4" style={{ height: 8, borderRadius: 5 }}>
        <div
          className="progress-bar bg-primary"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Step Indicator */}
      <h6 className="mb-3 fw-bold">
        Étape {step} / 3
      </h6>

      {/* Step 1: Images */}
      {step === 1 && (
        <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
          {files.map((file, i) => (
            <div
              key={i}
              className="card border-2 rounded-3 shadow-sm d-flex justify-content-center align-items-center"
              style={{
                width: 120,
                height: 120,
                cursor: "pointer",
                backgroundColor: "#ffffff",
                transition: "transform 0.2s",
              }}
            >
              <input
                type="file"
                id={`file-${i}`}
                className="d-none"
                onChange={handleOnChange(i)}
              />
              <label
                htmlFor={`file-${i}`}
                className="w-100 h-100 d-flex justify-content-center align-items-center"
              >
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Download size={35} className="text-secondary" />
                )}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Product Info */}
      {step === 2 && (
        <div className="border rounded-4 background-gradient p-3 shadow-sm mb-2">
          <div className="mb-3">
            <label htmlFor="" className="form-label fw-bold">Nom</label>
            <input
              type="text"
              className="form-control form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label fw-bold">Prix</label>
            <input
              type="number"
              className="form-control form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label fw-bold">Description</label>
            <textarea
              className="form-control form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {/* Step 3: Category & Trend */}
      {step === 3 && (
        <div className="border rounded-4 p-3 background-gradient shadow-sm mb-4">
          <div className="mb-3">
            <label htmlFor="" className="form-label fw-bold">Catégorie</label>
            <select
              className="form-select form-select"
              value={category || ""}
              onChange={(e) => setCategory(Number(e.target.value))}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value={1}>Figurines</option>
              <option value={2}>Objets pratiques</option>
              <option value={3}>Jeux</option>
              <option value={4}>Divers</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label fw-bold">Produit du moment</label>
            <input
              type="text"
              className="form-control form-control"
              value={trendProduct}
              onChange={(e) => setTrendProduct(e.target.value)}
              placeholder="Ex: Noël"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="d-flex justify-content-between mt-3">
        {step > 1 ? (
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={handleBack}
          >
            ← Précédent
          </button>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4"
            onClick={handleNext}
          >
            Suivant →
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4"

          >
            <PlusCircle /> Ajouter
          </button>
        )}
      </div>
    </form>
  );

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={handleOpenModal}
      >
        <PlusCircle size={40} />
      </button>

      {/* Modale */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content rounded-4 p-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Ajouter un produit</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} />
              </div>
              <div className="modal-body">{renderFormSteps()}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddProduct;
