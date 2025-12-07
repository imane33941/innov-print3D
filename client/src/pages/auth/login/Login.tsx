import { type FormEventHandler, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css';
import { Eye, EyeSlash, PersonFill } from 'react-bootstrap-icons';
import pokeball_ronflex_1 from '/img/pokeball_ronflex_1.jpg';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: (emailRef.current as HTMLInputElement).value,
            password: (passwordRef.current as HTMLInputElement).value,
          }),
        },
      );

      if (!response.ok) throw new Error('Erreur lors de la connexion');

      const data = await response.json();
      login(data.user, data.token);
      navigate(`/cart/${data.user.id}`);
    } catch {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-start p-3 p-md-5 cart-header-title">
        <h2 className="d-flex align-items-center gap-2 mb-1">
          <PersonFill size={28} />
          Connexion
        </h2>
      </div>
      <section className="container d-flex align-items-center justify-content-center py-4 mt-2 ">
        <div className="row shadow-lg rounded-4 overflow-hidden w-100 login-max-w-900">
          <div className="col-md-6 d-md-flex flex-column justify-content-center align-items-center text-white p-5 login-left-side">
            <h1 className="fw-bold mb-3 text-center">
              Bienvenue sur InnovPrint3D
            </h1>
            <p className="fs-5 text-center">
              Connectez-vous pour accéder à votre espace personnel.
            </p>
            <img
              src={pokeball_ronflex_1}
              alt="Illustration"
              className="rounded mt-4 object-fit-cover login-img w-100"
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="col-md-6 p-5 d-flex flex-column justify-content-center login-right-side"
          >
            <h2 className="text-center mb-4 fw-bold">Connexion</h2>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-semibold">
                Adresse e-mail
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                className="form-control form-control-lg rounded-3 shadow-sm"
                required
                placeholder="dupont@mail.com"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                Mot de passe
              </label>
              <div className="input-group">
                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control form-control-lg rounded-start-3 shadow-sm"
                  required
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center rounded-end-3"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="afficher le mot de passe"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-lg fw-semibold rounded-4 shadow-sm mb-3 btn-danger"
              aria-label="se connecter"
            >
              Se connecter
            </button>

            <p className="text-center fw-medium">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="fw-bold text-decoration-none text-danger"
                aria-label="s'inscrire"
              >
                Inscrivez-vous
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
