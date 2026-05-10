const express = require("express");
const db = require("./database");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const PORT = 3000;

app.use(express.json());

/* =====================
   TEST
===================== */
app.get("/", (req, res) => {
  res.json("API Personnes fonctionne !");
});

/* =====================
   GET ALL
===================== */
app.get("/personnes", (req, res) => {

  db.all("SELECT * FROM personnes", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });

    res.json(rows);
  });

});

/* =====================
   GET BY ID
===================== */
app.get("/personnes/:id", (req, res) => {

  db.get(
    "SELECT * FROM personnes WHERE id=?",
    [req.params.id],
    (err, row) => {

      if (err)
        return res.status(400).json({ error: err.message });

      res.json(row);
    }
  );

});

/* =====================
   POST
===================== */
app.post("/personnes", (req, res) => {

  const { nom, adresse } = req.body;

  db.run(
    "INSERT INTO personnes(nom, adresse) VALUES (?,?)",
    [nom, adresse],
    function (err) {

      if (err)
        return res.status(400).json({ error: err.message });

      res.json({
        message: "Personne ajoutée",
        id: this.lastID
      });
    }
  );

});

/* =====================
   PUT
===================== */
app.put("/personnes/:id", (req, res) => {

  const { nom, adresse } = req.body;

  db.run(
    "UPDATE personnes SET nom=?, adresse=? WHERE id=?",
    [nom, adresse, req.params.id],
    function (err) {

      if (err)
        return res.status(400).json({ error: err.message });

      res.json({ message: "Personne modifiée" });
    }
  );

});

/* =====================
   DELETE
===================== */
app.delete("/personnes/:id", (req, res) => {

  db.run(
    "DELETE FROM personnes WHERE id=?",
    req.params.id,
    function (err) {

      if (err)
        return res.status(400).json({ error: err.message });

      res.json({ message: "Personne supprimée" });
    }
  );

});

/* =====================
   SWAGGER
===================== */

const swaggerDocument = YAML.load("./openapi.yaml");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

/* =====================
   SERVER
===================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running http://localhost:${PORT}`);
});