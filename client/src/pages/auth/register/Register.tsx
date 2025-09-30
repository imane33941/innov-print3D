import { StatusCodes } from "http-status-codes";
import { useRef, useState } from "react";
import type { FormEventHandler } from "react";
import { Eye, EyeSlash, PersonPlusFill } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import type {
  RegisterError,
  RegisterErrors,
} from "../../../types/register-errors";
import "./register.css";
import pokeball_ronflex_1 from "/img/pokeball_ronflex_1.jpg";

function Register() {
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const zipCodeRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const onlyLetters = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof RegisterErrors,
  ) => {
    const value = e.target.value;
    const isValid = /^[\p{L}]+$/u.test(value) || value === "";

    if (isValid) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: "Ce champ doit contenir uniquement des lettres.",
      }));
    }
  };

  const createAccount: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: (firstnameRef.current as HTMLInputElement).value,
            lastname: (lastnameRef.current as HTMLInputElement).value,
            street: (streetRef.current as HTMLInputElement).value,
            zip_code: (zipCodeRef.current as HTMLInputElement).value,
            city: (cityRef.current as HTMLInputElement).value,
            country: (countryRef.current as HTMLInputElement).value,
            email: (emailRef.current as HTMLInputElement).value,
            phone: (phoneRef.current as HTMLInputElement).value,
            password: (passwordRef.current as HTMLInputElement).value,
            confirmPassword: (confirmPasswordRef.current as HTMLInputElement)
              .value,
          }),
        },
      );

      if (response.status === StatusCodes.CREATED) {
        toast.success("Votre compte a été créé avec succès !");
        navigate("/login");
      } else if (response.status === StatusCodes.BAD_REQUEST) {
        const { details, error } = await response.json();

        if (details) {
          const fieldErrors: RegisterErrors = {};

          for (const err of details as RegisterError[]) {
            fieldErrors[err.field] = err.message;
          }

          setErrors(fieldErrors);
          toast.error("Veuillez corriger le(s) erreur(s) du formulaire.");
        } else {
          toast.error(error || "Erreur de validation.");
        }
      } else if (response.status === StatusCodes.CONFLICT) {
        const { error } = await response.json();
        setErrors({ email: error });
        toast.error(error);
      } else {
        toast.error("Une erreur inattendue est survenue.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion au serveur.");
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-start p-3 p-md-5 cart-header-title">
        <h2 className="d-flex align-items-center gap-2 mb-1">
          <PersonPlusFill size={28} />
          S'inscrire
        </h2>
      </div>
      <div className=" mx-auto min-vh-100 d-flex align-items-center justify-content-center" style={{
        maxWidth: "1000px"
      }}>
        <div className=" shadow-lg rounded-4 w-100" >
          <div className="row g-0">


            {/* Right side form */}
            <div className="login-right-side col-md-7 p-4 pt-md-5 rounded-start-4">
              <h3 className="fw-bold text-center mb-3">Créer un compte</h3>
              <p className="text-center text-muted mb-4">Inscrivez-vous pour découvrir nos offres exclusives</p>

              <form onSubmit={createAccount}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control rounded-3 form-control ${errors.firstname ? "is-invalid" : ""}`}
                      placeholder="Prénom"
                      ref={firstnameRef}
                      onChange={(e) => onlyLetters(e, "firstname")}
                    />
                    <div className="invalid-feedback">{errors.firstname}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control rounded-3 form-control ${errors.lastname ? "is-invalid" : ""}`}
                      placeholder="Nom"
                      ref={lastnameRef}
                      onChange={(e) => onlyLetters(e, "lastname")}
                    />
                    <div className="invalid-feedback">{errors.lastname}</div>
                  </div>

                  <div className="col-12">
                    <input
                      type="text"
                      className={`form-control rounded-3 form-control ${errors.street ? "is-invalid" : ""}`}
                      placeholder="Adresse"
                      ref={streetRef}
                      onChange={() => setErrors((prev) => ({ ...prev, street: "" }))}
                    />
                    <div className="invalid-feedback">{errors.street}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control rounded-3 form-control ${errors.zip_code ? "is-invalid" : ""}`}
                      placeholder="Code postal"
                      ref={zipCodeRef}
                      onChange={() => setErrors((prev) => ({ ...prev, zip_code: "" }))}
                    />
                    <div className="invalid-feedback">{errors.zip_code}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control rounded-3 form-control ${errors.city ? "is-invalid" : ""}`}
                      placeholder="Ville"
                      ref={cityRef}
                      onChange={(e) => onlyLetters(e, "city")}
                    />
                    <div className="invalid-feedback">{errors.city}</div>
                  </div>

                  <div className="col-12">
                    <input
                      type="text"
                      className={`form-control rounded-3 form-control ${errors.country ? "is-invalid" : ""}`}
                      placeholder="Pays"
                      ref={countryRef}
                      onChange={(e) => onlyLetters(e, "country")}
                    />
                    <div className="invalid-feedback">{errors.country}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      type="email"
                      className={`form-control rounded-3 form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Email"
                      ref={emailRef}
                      onChange={() => setErrors((prev) => ({ ...prev, email: "" }))}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      type="tel"
                      className={`form-control rounded-3 form-control ${errors.phone ? "is-invalid" : ""}`}
                      placeholder="Téléphone"
                      ref={phoneRef}
                      onChange={() => setErrors((prev) => ({ ...prev, phone: "" }))}
                    />
                    <div className="invalid-feedback">{errors.phone}</div>
                  </div>

                  <div className="col-12">
                    <div className="input-group rounded-start-3 overflow-hidden">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control form-control ${errors.password ? "is-invalid" : ""}`}
                        placeholder="Mot de passe"
                        ref={passwordRef}
                        onChange={() => setErrors((prev) => ({ ...prev, password: "" }))}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center rounded-end-3"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </button>
                      <div className="invalid-feedback">{errors.password}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control rounded-3 form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      placeholder="Confirmer mot de passe"
                      ref={confirmPasswordRef}
                      onChange={() => setErrors((prev) => ({ ...prev, confirmPassword: "" }))}
                    />
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  </div>

                  <div className="col-12 mt-4 text-center">
                    <button
                      type="submit"
                      className="btn p-2 fw-semibold rounded-2 fs-5 shadow-sm mb-3 btn-danger w-100"
                      style={{ transition: "all 0.3s" }}

                    >
                      Créer mon compte
                    </button>
                    <p className="text-center fw-medium">
                      Vous avez dèjà un compte ?{" "}
                      <Link
                        to="/login"
                        className="fw-bold text-decoration-none text-danger"
                      >
                        Connectez-vous
                      </Link>
                    </p>
                  </div>

                </div>
              </form>
            </div>
            {/* Left side illustration */}
            <div className="col-md-5 d-none d-md-block">
              <div
                className="login-left-side h-100 w-100 d-flex flex-column justify-content-evenly align-items-center text-white p-4 rounded-end-4"
              >
                <div>
                  <h2 className="fw-bold mb-3 text-center">Bienvenue sur InnovPrint3D</h2>
                  <p className="mb-0 text-center">Rejoignez notre communauté et profitez des offres exclusives.</p>
                </div>
                <img
                  src={pokeball_ronflex_1}
                  alt="Illustration"
                  className="rounded mt-4 object-fit-cover login-img w-100"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
