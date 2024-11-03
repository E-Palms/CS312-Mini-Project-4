import express, { response } from "express";
import bodyParser from "body-parser";
import pg from "pg";

const port = 5000;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blogbase",
  password: "Pr1nt3xP@lms",
  port: "5432",
});
db.connect();

let loggedInUsername = null;
let loggedInUserId = null;

async function getAllPosts() {
  const result = await db.query(
    "SELECT blogs.blog_id, blogs.title, blogs.content, blogs.date_created, users.user_id, users.name FROM blogs LEFT JOIN users ON blogs.creator_user_id = users.user_id;"
  );
  return result.rows;
}

app.get("/", (req, res) => {});

app.post("/api/login", async (req, res) => {
   const { userName, userPassword } = req.body;
 
   try {
     const result = await db.query("SELECT * FROM users WHERE name = $1", [
       userName,
     ]);
     
     if (result.rowCount === 0) {
       return res.json({ error: "Username not found" });
     } else {
       if (result.rows[0].password === userPassword) {
         const loggedInUserId = result.rows[0].user_id;
         return res.json({ success: true });
       } else {
         return res.json({ error: "Password is incorrect" });
       }
     }
   } catch (err) {
     console.error("Error during signin:", err);
     res.status(500).send("Server Error");
   }
 });

app.get("/signup", (req, res) => {
  res.render("signup.ejs", { error: null }); /////////////////////////////////////////////////////////////////
});

app.post("/registerUser", async (req, res) => {
  const { userName, userPassword } = req.body;

  const numUsers = (await db.query("SELECT * FROM users")).rowCount;

  try {
    const result = await db.query("SELECT * FROM users WHERE name = $1", [
      userName,
    ]);
    if (result.rowCount > 0) {
      return res.render("signup", { error: "Username already exists" });
    }

    await db.query(
      "INSERT INTO users (user_id, name, password) VALUES ($1, $2, $3)",
      [numUsers + 1, userName, userPassword]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send("Server Error");
  }
});

app.get("/home", async (req, res) => {
  const result = await getAllPosts();
  res.render("index.ejs", {
    blogs: result,
    userName: loggedInUsername,
    error: null,
  }); ////////////////////////////////////////////////////////////////////////////////////////
});

app.post("/submit", async (req, res, next) => {
  const { userTitle, userContent } = req.body;

  try {
    await db.query(
      `INSERT INTO blogs (blog_id, date_created, content, creator_user_id, creator_name, title) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        (await getAllPosts()).length + 1,
        new Date(),
        userContent,
        loggedInUserId,
        loggedInUsername,
        userTitle,
      ]
    );
    res.redirect("/home");
  } catch (err) {
    console.error("Error during post submission:", err);
    res.status(500).send("Server Error");
  }
});

app.get("/edit", async (req, res) => {
  const postId = req.query.postId;
  const blogpost = await db.query(
    `SELECT blogs.blog_id, blogs.title, blogs.content, blogs.date_created, users.user_id, users.name FROM blogs LEFT JOIN users ON blogs.creator_user_id = users.user_id WHERE blogs.blog_id = ${postId};`
  );
  if (loggedInUsername == blogpost.rows[0].name) {
    res.render("edit.ejs", { post: blogpost.rows[0], postId: postId }); //////////////////////////////////////////////////////////////////
  } else {
    const result = await getAllPosts();
    res.render("index.ejs", {
      blogs: result,
      userName: loggedInUsername,
      error: "Cannot edit, invalid user",
    }); ///////////////////////////////////////////////////////////////////////////////
  }
});

app.post("/update", async (req, res) => {
  const { postId, userTitle, userContent } = req.body;

  try {
    await db.query(
      `UPDATE blogs SET title = $1, content = $2, date_created = $3 WHERE blog_id = $4`,
      [userTitle, userContent, new Date(), postId]
    );
    res.redirect("/home");
  } catch (err) {
    console.error("Error during post update:", err);
    res.status(500).send("Server Error");
  }
});

app.get("/delete", async (req, res, next) => {
  const postId = parseInt(req.query.postId, 10);
  try {
    const blogpost = await db.query(`SELECT * FROM blogs WHERE blog_id = $1`, [
      postId,
    ]);

    if (blogpost.rowCount === 0) {
      const posts = await getAllPosts();
      return res.render("index.ejs", {
        blogs: posts,
        userName: loggedInUsername,
        error: "Post not found",
      }); //////////////////////////////////////////////////////////////////////////////////////////
    }

    if (loggedInUserId !== blogpost.rows[0].creator_user_id) {
      const posts = await getAllPosts();
      return res.render("index.ejs", {
        blogs: posts,
        userName: loggedInUsername,
        error: "Cannot delete, invalid user",
      }); ///////////////////////////////////////////////////////////////////////////////////////////////////
    }

    await db.query(`DELETE FROM blogs WHERE blog_id = $1`, [postId]);
    res.redirect("/home");
  } catch (err) {
    console.error("Error during post deletion:", err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
