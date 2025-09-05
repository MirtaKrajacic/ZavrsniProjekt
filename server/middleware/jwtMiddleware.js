import jwt from "jsonwebtoken";

const secretKey = "secret-key"; 

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, secretKey, (err, succ) => {
      if (err) {
        res.status(401).send("provide valid token");
      } else {
        req.userid = succ.userid; // spremi userid u req objekt koji se prosljeđuje ruteru
        next();
      }
    });
  } else {
    console.log("provide token");
    res.status(403).send("provide token");
  }
}

export {verifyToken};