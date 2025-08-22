import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import api from "../../api";
import Upitnik from "../../components/Upitnik";

function RjesiUpitnik({ mod }) {
  const [xmlData, setXmlData] = useState(null);
  const [email, setEmail] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vrednovanje, setVrednovanje] = useState("");
  const [rezultatSpecs, setRezultatSpecs] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(
        mod === "javni"
          ? `/upitnik/get-upitnik/${params.id}`
          : `/upitnik/get-upitnik/private/${params.uuid}`
      );

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "", // atributi se parsiraju kao obični ključevi (kao i tagovi), bez prefiksa
      });
      const parsedObj = parser.parse(data.xml);

      setVrednovanje(data.vrednovanje);
      setRezultatSpecs(data.formula);

      console.log(data);
      setXmlData(parsedObj);
    };

    fetchData();
  }, []); 

  const handleSubmit = async () => {
    console.log(email);
    try {
      const { data } = await api.post("/email/send-result", {
        email: email,
        result: "Ovdje će biti rezultati upitnika",
      });
      setShowShare(false);
      setEmail("");
      if (data.success) {
        setSuccess(true);
      }
      console.log(data.success);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {xmlData && (
        <div className="container mb-5 p-4 bg-primary-subtle border border-primary-subtle rounded-3 d-flex flex-column align-items-center">
          <Upitnik xmlData={xmlData} />
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowShare(true)}
          >
            Submit
          </button>
          {success && (
          <Alert variant="success" className="mt-3 text-center">
            Provjerite mail za rezultate upitnika!
          </Alert>
      )}
        </div>
      )}
      
      <Modal show={showShare} onHide={() => {setShowShare(false); setEmail("");}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Dobij rezultate putem e-pošte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Unesi adresu e-pošte na koju ćemo ti poslati rezultate upitnika
              </Form.Label>
              <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {setShowShare(false); setEmail("");}}
          >
            Odustani
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Pošalji</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RjesiUpitnik;
