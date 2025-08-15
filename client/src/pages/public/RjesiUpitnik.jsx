import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";

import api from "../../api";
import Upitnik from "../../components/Upitnik";

function RjesiUpitnik({ mod }) {
  const [xmlData, setXmlData] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(
        mod === "javni"
          ? `/get-xml/${params.id}`
          : `/get-xml/private/${params.uuid}`
      );

      const parser = new XMLParser({
        ignoreAttributes: false, 
        attributeNamePrefix: "", // atributi se parsiraju kao obični ključevi (kao i tagovi), bez prefiksa 
      });
      const parsedObj = parser.parse(data.xml);

      console.log(parsedObj);
      setXmlData(parsedObj);
    };

    fetchData();
  }, []); // [params.id]

  return (
    <>
      {xmlData && (
        <div className="container mb-5 p-4 bg-primary-subtle border border-primary-subtle rounded-3 d-flex flex-column align-items-center">
          <Upitnik xmlData={xmlData} />
          <button className="btn btn-primary mt-3">Submit</button>
        </div>
      )}
    </>
  );
}

export default RjesiUpitnik;
