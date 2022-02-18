var express = require("express");
var router = express.Router();
const fetch = require("node-fetch-retry");

const baseUrl = "https://api.hatchways.io/assessment/blog/posts?tag=";

//route is mounted on api/posts/
// query parameters must be singluar

router.get("/", async (req, res, next) => {
  try {
    if (req.query.tags.length !== 0) {
      const tagNames = req.query.tags.split(",");
      const groupResponse = {};
      for (const tag of tagNames) {
        const tagResponse = await fetch(`${baseUrl}${tag}`);
        const parsedResponse = await tagResponse.json();
        const singleIds = parsedResponse.posts.map((single) => {
          return single.id;
        });

        singleIds.forEach((singlePost) => {
          if (groupResponse[singlePost] === undefined) {
            return (groupResponse[singlePost] =
              parsedResponse.posts[singleIds.indexOf(singlePost)]);
          }
        });
      }

      const direction = req.query.direction || "asc";
      const sortBy = req.query.sortBy || "id";
      const valid = ["id", "reads", "likes", "popularity", "asc", "desc"];
      if (valid.includes(sortBy) && valid.includes(direction)) {
        const sort = Object.values(groupResponse).sort(function (a, b) {
          if (direction === "asc") {
            return a[sortBy] - [sortBy];
          }
          if (direction === "desc") {
            return b[sortBy] - a[sortBy];
          }
        });
        res.json({ posts: sort });
      } else if (!valid.includes(sortBy)) {
        res.status(400).json({ error: "sortBy parameter is invalid" });
      } else if (!valid.includes(direction)) {
        res.status(400).json({ error: "direction parameter is invalid" });
      }
    } else if (req.query.tags === undefined || req.query.tags.length === 0) {
      res.status(400).json({ error: "Tags parameter is required" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
