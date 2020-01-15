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
      if (data) {
        response.status(200).json(data)
      } else {
        response.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error: "The post information could not be retrieved" })
    })
});

router.get("/:id/comments", (request, response) => {
  const id = request.params.id;
  db.findCommentById(id)
    .then(data => {
      if (!data) {
        response.status(404).json({ message: "The post with the specified ID does not exist" })
      } else {
        response.status(200).json(data)
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ message: "The comments information could not be retrieved." })
    })
});

//POST requests
router.post("/", (request, response) => {
  const info = request.body;
  if (!info.title || !info.contents) {
    response.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    db.insert(info)
      .then(data => {
        response.status(201).json(data)
      })
      .catch(error => {
        console.log(error)
        response.status(500).json({ error: "There was an error while saving the post to the database." })
      })
  }
});

router.post("/:id/comments", (request, response) => {
  const info = request.body;
  const id = request.params.id;
  // const { text } = request.body;
  if (!info.text) {
    response.status(404).json({ message: "Please provide text for the comment." })
  } else {
    db.findById(id)
      .then(data => {
        if (!data) {
          response.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
          db.insertComment({ ...info, post_id: id })
            .then(hubs => {
              response.status(201).json(hubs)
            })
        }
      })
      .catch(error => {
        console.log(error)
        response.status(500).json({ error: "There was an error while saving the comment to the database" })
      })
  }
});

// DELETE requests
router.delete("/:id", (request, response) => {
  const id = request.params.id;
  db.findById(id)
    .then(data => {
      if (!data) {
        response.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        db.remove(id)
          .then(deleted => {
            response.status(201).json({ message: "Deletion successful", deleted })
          })
      }
    })
    .catch(error => {
      response.status(500).json({ error: "The post could not be removed." })
    })
});

// PUT requests
router.put("/:id", (request, response) => {
  const id = request.params.id;
  const info = request.body;
  if (!info.title || !info.contents) {
    response.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    db.findById(id)
      .then(data => {
        if (!data) {
          response.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
          db.update(id, info)
            .then(hubs => {
              response.status(200).json(hubs)
            })
        }
      })
      .catch(error => {
        console.log(error)
        response.status(500).json({ error: "The post information could not be modified" })
      })
  }
});



module.exports = router;