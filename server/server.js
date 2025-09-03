import express from "express";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import korisnikRouter from "./routes/korisnikRouter.js"
import upitnikRouter from "./routes/upitnikRouter.js";
import emailRouter from "./routes/emailRouter.js";

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/auth', authRouter);
app.use('/korisnik', korisnikRouter);
app.use('/upitnik', upitnikRouter);
app.use('/email', emailRouter);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});


