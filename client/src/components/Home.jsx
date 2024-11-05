import React, { useEffect, useState } from "react";
import { useNavigate, Link, useRouteError } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan} from '@fortawesome/free-solid-svg-icons';
import "./styles/Shared.css"
import "./styles/Home.css"


function Home({onLogout})
   {
      const [blogPosts, setBlogPosts] = useState([]);
      const [postTitle, setPostTitle] = useState('');
      const [postContent, setPostContent] = useState('');
      const [user, setUser] = useState('');
      const [userId, setUserId] = useState(-1);
      const navigate = useNavigate();
      
      const getUser = async () => {
         const response = await fetch("http://localhost:5000/api/getuser", {
            method: 'POST'
         });
         const userData = await response.json();
         if (userData)
            {
             setUser(userData.userName);
             setUserId(userData.userId);
            }
      }

      const getPosts = async () => {
         const response = await fetch("http://localhost:5000/api/getposts", {
            method: 'POST'
            });
         const data = await response.json();
         setBlogPosts(data);
         }

      const editPost = async (post) => {
         const response = await fetch("http://localhost:5000/api/edit", {
            method: 'POST',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId: post.blog_id })
         });

         const result = await response.json();

         if (result.success)
            {
             navigate(`/Edit/${ result.post.blog_id }`);
            }
         else
            {
             console.log(result.error);
            }
      }

      const deletePost = async (post) => {
         const response = await fetch("http://localhost:5000/api/delete", {
            method:'POST',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId: post.blog_id })
         })

         const result = await response.json();

         if (result.success)
            {
             await getPosts();
             console.log("deletion success")
            }
         else
            {
             console.log(result.error);
            }
      }

      const newPost = async (event) => {
         event.preventDefault();

         let postData = {
             postTitle: postTitle,
             postContent: postContent,
             postUser: user,
             postUserId: userId
            }

         const response = await fetch("http://localhost:5000/api/submit", {
            method:'POST',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
         });
         if (response.ok)
            {
             await getPosts();
             setPostTitle('');
             setPostContent('');
            }
      }
      
      useEffect(() => {
         getPosts();
         getUser();
      }, []);
      
      return (
         <div className="Content">
            <div className="Post">
               <form onSubmit={newPost}>
                  <div className="Post-Header-Form">
                     <div className="Post-Author-Text">
                        <h3>{"User: " + user}</h3>
                     </div>
                     <div>
                        <button type="submit">Post</button>
                     </div>
                  </div>
                  <div className="Post-Title-Form, Post-Title-Text" style={{marginBottom: "2%"}}>
                     <label htmlFor="userTitle">Title:</label>
                     <input className="Post-Title-Text" 
                            style={{marginLeft: "2%", alignSelf: "center", 
                            borderRadius: "30px", padding: "2%"}} 
                            type="text" 
                            name="userTitle"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)} 
                            required />
                  </div>
                  <div className="Post-Content-Form">
                     <label className="Post-Content-Text" htmlFor="userContent">Edit blog post here:</label>
                     <textarea style={{borderRadius: "30px", resize: "vertical", padding: "2%", width: "90%", alignSelf: "center"}} 
                               className="Post-Content-Text" 
                               rows="8" 
                               name="userContent"
                               value={postContent}
                               onChange={(e) => setPostContent(e.target.value)}
                               required />
                  </div>
               </form>
            </div>
            <div>
               <h1>Blog Posts</h1>
            </div>
            {blogPosts.map((post) => (
               <div className="Post">
                  <div className="Post-Header">
                     <h2 className="Post-Title-Text" key={post.id}>{post.title}</h2>
                     <h4 className="Post-Date-Text" key={post.id}>
                        {new Date(post.date_created).toLocaleDateString('en', {
                           year: 'numeric',
                           month: 'short',
                           day: '2-digit',
                        })}
                     </h4>
                  </div>
                  <div className="Post-Content-Text">
                     <p key={post.id}>{post.content}</p>
                  </div>
                  <div className="Post-Footer">
                     <div className="Post-Author Post-Author-Text">
                        <p style={{marginRight: "2%"}} key={post.id}>Posted by:</p>
                        <h4>{post.name}</h4>
                     </div>
                     <div className="Post-Options">
                        <button onClick={() => editPost(post)} style={{margin: "2%"}}><FontAwesomeIcon icon={faEdit} /></button>
                        <button onClick={() => deletePost(post)} style={{margin: "2%"}}><FontAwesomeIcon icon={faTrashCan} /></button>
                     </div>
                  </div>
               </div>
            ))}
         </div>);
   }

export default Home