// prikazuje sve upitnike iz data

function Upitnici({ data, children }) {
  return (
    <div className="container text-center">
      <div className="row g-4 mb-5">
        {data.map((u) => (
          u.status === 'javni' && (
            <div className="col" key={u.id}>
            <div
              className="card h-100 shadow border-0"
              style={{
                width: "18rem",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
              }}
            >
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">{u.naslov}</h5>
                <p className="card-text text-secondary">{u.kratki_opis}</p>
                <p>{u.ime}</p>
                {children(u)}
                
              </div>
            </div>
          </div>
          )
        ))}
      </div>
    </div>
  );
}

export default Upitnici;
