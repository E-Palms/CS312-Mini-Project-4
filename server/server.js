import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors"

const port = 5000;
const app = express();

const corsOptions = {
   origin: ["http://localhost:5173"]
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blogbase",
    password: "",
    port: "5432"
});
db.connect();

let loggedInUsername = null;
let loggedInUserId = null;

async function getAllPosts() 
    {
     const result = await db.query("SELECT blogs.blog_id, blogs.title, blogs.content, blogs.date_created, users.user_id, users.name FROM blogs LEFT JOIN users ON blogs.creator_user_id = users.user_id;");
     return result.rows;
    }

app.post("/api/getuser", async (req, res) =>
   {
    res.json({userName: loggedInUsername, userId: loggedInUserId})
   });

app.post("/api/login", async (req, res) =>
    {
     const { userId, password } = req.body;
     
     try 
        {
         const result = await db.query('SELECT * FROM users WHERE name = $1', [userId]);
         if (result.rowCount == 0) 
            {
               res.json({"success": false, "error": "Username does not exist"});
            }
         else
            {
             if (result.rows[0].password == password)
                {
                 loggedInUsername = userId;
                 loggedInUserId = result.rows[0].user_id;
                 res.json({"success": true})
                }
             else
                {
                  res.json({"success": false, "error": "Password is incorrect"});
                }
            }
        } 
     catch (err) 
        {
         console.error('Error during signin:', err);
         res.status(500).send('Server Error');
        }
    });

app.post('/api/signup', async (req, res) => 
    {
     const { userId, password } = req.body;

     const numUsers = (await db.query("SELECT * FROM users")).rowCount

     try 
        {
         const result = await db.query('SELECT * FROM users WHERE name = $1', [userId]);
         if (result.rowCount > 0) 
            {
             return res.json({"success": false, "error": "Username already exists" });
            }

         await db.query('INSERT INTO users (user_id, name, password) VALUES ($1, $2, $3)', [numUsers + 1, userId, password]);

         res.json({"success": true});
        } 
     catch (err) 
        {
         console.error('Error during signup:', err);
         res.status(500).send('Server Error');
        }
    });

app.post("/api/getposts", async (req, res) =>
    {
     const result = await getAllPosts();
     result.sort(function(obj1, obj2) {
      return obj1.date_created - obj2.date_created;
     });
     res.json(result);
    });

app.post("/api/submit", async (req, res, next) =>
    {
     const { postTitle, postContent, postUser, postUserId } = req.body;

     try {
        await db.query(`INSERT INTO blogs (blog_id, date_created, content, creator_user_id, creator_name, title) VALUES ($1, $2, $3, $4, $5, $6)`, [ (await getAllPosts()).length + 1, new Date(), postContent, postUserId, postUser, postTitle ]);
        res.json(true);
        }
     catch (err)
        {
         console.error('Error during post submission:', err);
         res.status(500).send('Server Error');
        }
    });

app.post("/api/edit", async (req, res) =>
    {
     const { postId } = req.body;

     const blogpost = await db.query(`SELECT blogs.blog_id, blogs.title, blogs.content, blogs.date_created, users.user_id, users.name FROM blogs LEFT JOIN users ON blogs.creator_user_id = users.user_id WHERE blogs.blog_id = ${postId};`);
     if (loggedInUsername == blogpost.rows[0].name)
        {
        res.json({ success: true, post: blogpost.rows[0] });
        }
     else
        {
         const result = await getAllPosts();
         res.json({ success: false, error: "Cannot edit, invalid user" });
        }
    });

app.post("/api/update", async (req, res) => 
    {
     const { postTitle, postContent, postId } = req.body;

     try
        {
         await db.query(`UPDATE blogs SET title = $1, content = $2, date_created = $3 WHERE blog_id = $4`, [postTitle, postContent, new Date(), postId]);
         res.json({ success: true })
        }
     catch (err)
        {
         console.error("Error during post update:", err);
         res.status(500).send("Server Error");
        }
    });

app.post("/api/delete", async (req, res) =>
    {
     const { postId } = req.body;

     try 
        {
         const blogpost = await db.query(`SELECT * FROM blogs WHERE blog_id = $1`, [postId]);

         if (blogpost.rowCount === 0) 
                {
                 const posts = await getAllPosts();
                 return res.json({ success: false, error: "Post not found" });
                }

             if (loggedInUserId !== blogpost.rows[0].creator_user_id) 
                {
                 const posts = await getAllPosts();
                 return res.json({ success: false, error: "Cannot delete, invalid user" });
                }

             await db.query(`DELETE FROM blogs WHERE blog_id = $1`, [postId]);
             res.json({ success: true });
            } 
         catch (err)
            {
             console.error("Error during post deletion:", err);
             res.status(500).send("Server Error");
            }
        });

app.post("/api/getuserposts", async (req, res) => {
   try
      {
       const blogposts = await db.query(`SELECT blogs.blog_id, blogs.title, blogs.content, blogs.date_created, users.user_id, users.name FROM blogs LEFT JOIN users ON blogs.creator_user_id = users.user_id WHERE users.user_id = ${loggedInUserId};`);
       res.json(blogposts.rows);
      }
   catch (err)
      {
       console.error('Error during query:', err);
       res.status(500).send('Server Error');
      }
});

app.listen(port, () =>
    {
     console.log(`Server listening on port: ${port}`);
    });
