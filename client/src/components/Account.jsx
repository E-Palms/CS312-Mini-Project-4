import React, { useEffect, useState } from "react";
import { useNavigate, Link, useRouteError } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan} from '@fortawesome/free-solid-svg-icons';
import "./styles/Home.css";

function Account()
   {
      const [blogPosts, setBlogPosts] = useState([]);
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
         const response = await fetch("http://localhost:5000/api/getuserposts", {
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

      useEffect(() => {
         getPosts();
         getUser();
      }, []);

    return(
      <div className="Content">
         <div>
            <h2>Welcome {user}, check out your posts!</h2>
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
                     <button onClick={() => editPost(post)} style={{minWidth: "60px", margin: "2%"}}><FontAwesomeIcon style={{height: "50%"}} icon={faEdit} /></button>
                     <button onClick={() => deletePost(post)} style={{minWidth: "60px", margin: "2%"}}><FontAwesomeIcon style={{height: "50%"}} icon={faTrashCan} /></button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    )
   }

export default Account