import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import Upitnik from "../components/Upitnik";
// import validateXML from "./validateQueXML.js";

function AddUpitnik({upitnikId}) {
  const [sadrzaj, setSadrzaj] = useState(null);
  useEffect(() => {
    console.log(sadrzaj);
  }, [sadrzaj]);

  useEffect(() => {
    const fetchXml = async () => {
      try {
        let result = await fetch(`http://localhost:5000/get-xml/${upitnikId}`);
        result = await result.json();
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        setSadrzaj(parser.parse(result.xml)); // sadrzaj je JS objekt nastao parsiranjem XMLa
        //console.log(sadrzaj);
        //console.log(parser.parse(result.xml));
      } catch (err) {
        console.error("error: ", err);
      }
    };

    fetchXml();
  }, []);

  return sadrzaj ? (
    <Upitnik xmlData={sadrzaj} />
  ) : (
    <p>Učitavanje...</p>
  );
}

export default AddUpitnik;
