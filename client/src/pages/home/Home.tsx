import {
  CurrencyExchange,
  DatabaseFillAdd,
  Star,
  StarFill,
  StarHalf,
  Truck,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import GoogleLogo from "../../../img/icons/GoogleLogo.png";
import CategoryProducts from "../../components/product/catProducts/CategoryProducts";
import TrendProducts from "../../components/product/trendProducts/TrendProducts";
import "./Home.css";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useProductSearch } from "../../contexts/ProductSearchContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Eric Dupont",
    date: "18/02/2025",
    rating: 5,
    comment:
      "Génial ! Merci, produits top, vendeur top, efficace et prix correct !",
  },
  {
    id: 2,
    name: "Camille Duret",
    date: "07/03/2025",
    rating: 3,
    comment:
      "La qualité est correct. En attente de nouveaux produits. Pour le reste parfait.",
  },
  {
    id: 3,
    name: "Sylvie Durand",
    date: "11/05/2025",
    rating: 4.5,
    comment:
      "Produit correspondant à la photo. Rapide et efficace, je recommande vivement.",
  },
  {
    id: 4,
    name: "Lucas Lefèvre",
    date: "20/06/2025",
    rating: 4,
    comment:
      "Très satisfait de ma commande ! Figurine bien emballée et conforme aux attentes.",
  },
  {
    id: 5,
    name: "Thomas Garnier",
    date: "15/07/2025",
    rating: 4.5,
    comment:
      "Super expérience ! Envoi rapide, bonne qualité, et le design est top.",
  },
];

function Home() {
  const navigate = useNavigate();
  const { products } = useProductSearch();
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  const totalCells = 6;

  useEffect(() => {
    if (products.length === 0) return;

    const initialIndexes = Array.from({ length: totalCells }, () =>
      Math.floor(Math.random() * products.length)
    );
    setVisibleIndexes(initialIndexes);
    
    const interval = setInterval(() => {
      setVisibleIndexes((prev) =>
        prev.map((idx) => {
          if (Math.random() > 0.5) {
            return Math.floor(Math.random() * products.length);
          }
          return idx;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [products]);

  const renderStars = (note: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const key = `star-${note}-${i}`;
      if (i <= Math.floor(note)) {
        stars.push(<StarFill key={key} className="home-stars" size={15} />);
      } else if (i - 0.5 === note) {
        stars.push(<StarHalf key={key} className="home-stars" size={15} />);
      } else {
        stars.push(<Star key={key} className="home-stars" size={15} />);
      }
    }
    return stars;
  };

  return (
    <>
      <section className="home-browse-creation text-black d-sm-flex">
        <div className="home-browse-creation-content  border d-flex flex-column w-100 align-items-center align-items-md-start justify-content-center gap-4">
          <h2 className="pb-2 fw-semibold mt-4 ms-md-5">
            Création & Impression 3D
          </h2>
          <p className="home-browse-creation-p fs-md-7 ms-md-5 lh-lg text-center text-md-start w-75">
            Explore un univers de figurines imprimées en 3D, pensées et créées
            avec passion. Chaque modèle est conçu avec soin pour capturer
            l’imaginaire et l’originalité. <br /> Que tu sois collectionneur ou
            curieux, laisse-toi surprendre par des créations uniques.
          </p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="btn home-browse-creation-btn p-3 ms-md-5 mb-5"
          >
            Parcourir les créations
          </button>
        </div>

        <div className="container home-choose-us  home-browse-creation-img-div">
          <div className="row g-3 p-4 ">
            {visibleIndexes.map((productIndex, i) => {
              const product = products[productIndex];
              return (
                <div key={i} className="col-4">
                  <div
                    className="position-relative w-100 h-100 rounded overflow-hidden shadow-sm"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <AnimatePresence>
                      <motion.img
                        key={product.id}
                        src={`${import.meta.env.VITE_API_URL}/uploads/products/${product.images[0]}`}
                        alt={product.name}
                        className="w-100 h-100 object-fit-cover rounded"
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                          rotate: Math.random() * 10,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                          rotate: Math.random() * 10,
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut",
                          delay: i * 0.1,
                        }}
                      />
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CategoryProducts />
      <TrendProducts />

      <section className="home-choose-us d-flex flex-column mb-5 justify-content-center align-items-center home-margin-top">
        <div>
          <h2 className="text-center fw-semibold text-light mt-3 py-4 px-2">
            Pourquoi nous choisir
          </h2>
        </div>
        <div className="container row w-100 mb-5 gap-2 gap-md-0  ">
          <div className="col-md-4 mt-3 ">
            <div className="card text-center rounded-4 home-choose-us-height">
              <Truck
                size={100}
                className="card-img-top w-25 mx-auto mt-2 mb-md-2"
              />
              <div className="card-body">
                <h5 className="fw-bold mb-3">Livraison rapide</h5>
                <p className="card-text home-choose-us-p">
                  Recevez vos figurines en un temps record grâce à notre service
                  d’expédition express.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-3">
            <div className="card text-center rounded-4 home-choose-us-height">
              <DatabaseFillAdd
                size={100}
                className="card-img-top w-25 mx-auto mt-2 mb-md-2"
              />
              <div className="card-body">
                <h5 className="fw-bold mb-3">Création sur mesure</h5>
                <p className="card-text home-choose-us-p">
                  Donnez vie à vos idées avec des figurines personnalisées à
                  votre image.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-3">
            <div className="card text-center rounded-4 home-choose-us-height">
              <CurrencyExchange
                size={100}
                className="card-img-top w-25 mx-auto mt-2 mb-md-2"
              />
              <div className="card-body">
                <h5 className="fw-bold mb-3">Achat responsable</h5>
                <p className="card-text home-choose-us-p">
                  Fabriqué à base de filament PLA composé de polymère et
                  d'amidon de maïs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-margin-top reviews-top">
        <h2 className="text-center fw-semibold  mb-4 mt-5">
          Les avis de nos clients
        </h2>
        <section className="d-md-none">
          <div className="container row px-3 mx-auto ">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 7000 }}
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id} className="mb-4">
                  <div className="card w-100 mb-4 text-center  mt-3 rounded-2 ">
                    <div className="p-2 d-flex flex-column justify-content-center align-items-center gap-3 ">
                      <div className="d-flex align-items-center w-100 justify-content-center gap-3">
                        <h3 className="fw-bold fs-6 mt-3 ">{review.name}</h3>
                        <img
                          src={GoogleLogo}
                          className="review-google-img pt-1 ms-1"
                          alt="Google"
                        />
                      </div>
                      <p className="mb-1 fw-lighter">{review.date}</p>
                      <div>{renderStars(review.rating)}</div>
                      <p className="card-text fs-6 mb-3">{review.comment}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </div>

      <section className="d-none d-md-flex justify-content-center ">
        <div className="container row w-75 text-center mb-3">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="mb-5">
                <div
                  key={review.id}
                  className="mt-3 mt-md-2 w-100 mb-3 mx-auto"
                >
                  <div className="card home-review-card text-center d-flex flex-column justify-content-between">
                    <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                      <div className="d-flex align-items-center w-75 justify-content-center ms-4">
                        <h3 className="fw-bold fs-6 pt-3 w-75">
                          {review.name}
                        </h3>
                        <img
                          src={GoogleLogo}
                          className="review-google-img pt-1 ms-1"
                          alt="Google"
                        />
                      </div>
                      <p className="mb-1 fw-lighter">{review.date}</p>
                      <div className="">{renderStars(review.rating)}</div>
                      <p className="card-text home-review-comment mt-2 p-3">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="home-create-account text-center text-black p-4 mt-5 mx-auto home-margin-top mb-5 d-flex gap-4 align-items-center flex-column">
        <h2 className="mt-5">Rejoins la communauté des passionnés de 3D !</h2>
        <p>Crée ton compte et explore un univers unique de figurines 3D</p>
        <button
          type="button"
          onClick={() => {
            navigate("/register");
            window.scrollTo(0, 0);
          }}
          className="btn home-browse-creation-btn mb-5 p-3"
        >
          Créer un compte
        </button>
      </section>
    </>
  );
}

export default Home;
