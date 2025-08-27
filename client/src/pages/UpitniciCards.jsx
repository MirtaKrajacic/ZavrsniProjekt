// prikazuje grid upitnika

function UpitniciCards({ data, children }) {
  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5 justify-content-start">
        {data.map((u) => (
          <div className="col" key={u.id}>
            <div
              className="card upitnik-card d-flex flex-column h-100 shadow border-0"
              style={{ minHeight: "330px" }}
            >
              <div className="card-body flex-grow-1">
                <h5 className="card-title text-primary fw-bold">{u.naslov}</h5>
                <p className="card-text">{u.kratki_opis}</p>
              </div>
              <div className="card-footer bg-transparent border-0 mt-auto">
                {children(u)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpitniciCards;
