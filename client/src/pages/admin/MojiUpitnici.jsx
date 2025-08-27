import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

import api from "../../api";
import UpitniciCards from "../UpitniciCards";

const MojiUpitnici = () => {
  const [upitnici, setUpitnici] = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    document.title = "Moji upitnici";
  }, []);

  useEffect(() => {
    getUpitnici();
  }, []);

  const getUpitnici = async () => {
    try {
      const { data } = await api.get(`/upitnik/get-moji-upitnici`);
      console.log(data);

      if (Array.isArray(data)) {
        // provjera u slučaju da korisnik nema još ni jedan upitnik koji dolazi iz baze
        setUpitnici(data);
      } else {
        setUpitnici([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setForDeletion = (upitnikId) => {
    setId(upitnikId);
    setShowShare(true);
  };

  const deleteUpitnik = async (id) => {
    try {
      await api.delete(`/upitnik/del-upitnik/${id}`);
      setShowShare(false);
      getUpitnici();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <div className="d-flex justify-content-begin p-4 border-bottom mb-5">
        <Link
          to="/add"
          className="btn btn-light border dodaj-button"
          
        >
          Dodaj novi upitnik
        </Link>
      </div>
      {upitnici.length > 0 ? (
        <>
          <UpitniciCards data={upitnici}>
            {(u) => (
              <>
                {u.status === "privatni" && (
                  <small className="text-primary">*privatni</small>
                )}
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <Link
                    className="btn btn-light border btn-sm"
                    to={
                      u.status === "javni"
                        ? `/upitnik/${u.id}`
                        : `/upitnik/p/${u.link_token}`
                    }
                  >
                    Isprobaj
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setForDeletion(u.id)}
                  >
                    Izbriši
                  </button>
                </div>
              </>
            )}
          </UpitniciCards>
        </>
      ) : (
        <p className="text-center">Još nemate ni jedan upitnik.</p>
      )}

      <Modal show={showShare} onHide={() => setShowShare(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Brisanje upitnika</Modal.Title>
        </Modal.Header>
        <Modal.Body className="my-4">
          Jeste li sigurni da želite trajno izbrisati ovaj upitnik?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-primary bg-primary-subtle shadow-sm"
            variant="outline-primary"
            onClick={() => setShowShare(false)}
          >
            Odustani
          </button>
          <button
            className="btn btn-outline-danger bg-danger-subtle shadow-sm"
            onClick={() => deleteUpitnik(id)}
          >
            Izbriši
          </button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default MojiUpitnici;
