import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
// import validateXML from "./validateQueXML.js";

import api from "../api";
import Upitnik from "../components/Upitnik";

function AddUpitnik({ upitnikId }) {
  const [sadrzaj, setSadrzaj] = useState(null);
  useEffect(() => {
    console.log(sadrzaj);
  }, [sadrzaj]);

  useEffect(() => {
    const fetchXml = async () => {
      try {
        const { data } = await api.get(`/get-xml/${upitnikId}`);
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        setSadrzaj(parser.parse(data.xml)); // sadrzaj je JS objekt nastao parsiranjem XMLa
        //console.log(sadrzaj);
        //console.log(parser.parse(result.xml));
      } catch (err) {
        console.error("error: ", err);
      }
    };

    fetchXml();
  }, []);

  return sadrzaj ? <Upitnik xmlData={sadrzaj} /> : <p>Učitavanje...</p>;
}

export default AddUpitnik;
