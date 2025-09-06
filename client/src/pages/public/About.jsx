function About() {
  return (
    <main className="d-flex flex-column justify-content-center">
      <h1 className="text-primary fw-bold text-center mb-5">O nama</h1>
      <div className="container">
        <p className="fw-semibold mb-4">
          Dobrodošli u MindCheck – istražite svoje psihološko stanje kroz
          provjerene psihološke upitnike. Aplikacija vam omogućuje
          anonimno ispunjavanje upitnika i dobivanje detaljnih rezultata putem
          e-pošte.
        </p>

        <p className="fw-semibold mb-4">
          Upitnike pomno biraju psiholozi i time pružaju pouzdane uvide u vaše
          osobine i obrasce ponašanja, a cilj im je pomoći vam u boljem
          razumijevanju sebe te poticanju brige o svojem mentalnom zdravlju.
        </p>

        <p className="fw-semibold">
          Aplikacija je razvijena u kontekstu Završnog rada na FER-u studentice
          Mirte Krajačić. S naglaskom na jednostavnost, spaja psihološka znanja
          s modernom tehnologijom.
        </p>
      </div>
    </main>
  );
}

export default About;
