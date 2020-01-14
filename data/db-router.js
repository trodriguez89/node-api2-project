const express = require("express");

const db = require("./db");

const router = express.Router();

router.use(express.json());

// GET requests
router.get("/", (request, response) => {
    db.find()
        .then(data => {
            response.status(200).json(data)
        })
        .catch(error => {
            console.log(error)
            response.status(500).json({ error: "The posts informattion could not be retrieved" })
        })
});

router.get("/:id", (request, response) => {
    const id = request.params.id;
    db.findById(id)
        .then(data => {
            if (!data) {
                response.status(404).json({message: "The post with the specified ID does not exist."})
            } else {
                response.status(200).json(data)
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).json({error: "The post information could not be retrieved"})
        })
})

module.exports = router;