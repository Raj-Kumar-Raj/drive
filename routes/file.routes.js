const express = require("express");
const router = express.Router();

// route to upload files

router.post("/upload", (req, res) => {
  // handle file upload logic here
  res.render("final");
});

module.exports = router;
