import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";
import Upitnik from "../components/Upitnik";

function RjesiUpitnik({ mod }) {
  const [xmlData, setXmlData] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      let result = await fetch(
        mod === "javni"
          ? `http://localhost:5000/get-xml/${params.id}`
          : `http://localhost:5000/get-xml/token/${params.uuid}`
      );
      result = await result.json();

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });
      const parsedObj = parser.parse(result.xml);

      console.log(parsedObj);
      setXmlData(parsedObj); // see note below
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
