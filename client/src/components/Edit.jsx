import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom"
import "./styles/Home.css"

function Edit()
   {
    const { postId } = useParams();
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [user, setUser] = useState('');
    const [userId, setUserId] = useState('');
    const navigator = useNavigate();
    
    const getUser = async () => {
       const response = await fetch("http://localhost:5000/api/getuser", {
         method: 'POST' });
       const userData = await response.json();
       if (userData)
         {
          setUser(userData.userName);
          setUserId(userData.userId);
         }
      }

    const editPost = async (postId) => {
       const response = await fetch("http://localhost:5000/api/edit", {
         method: 'POST',
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ postId })
       });
       const result = await response.json();

       if (result.success)
         {
          setPostTitle(result.post.title);
          setPostContent(result.post.content);
         }
       else
         {
          console.log(result.error);
         }
      }

    const updatePost = async (event, postId) => {
       event.preventDefault();
       
       let postData = {
          postTitle: postTitle,
          postContent: postContent,
          postId : postId
         }

       const response = await fetch("http://localhost:5000/api/update", {
            method:'POST',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
         });

       const result = await response.json();

       if (result.success)
         {
          navigator("/");
         }
      }

      useEffect(() => {
         getUser();
         editPost(postId);
      }, [postId]);

    return (
      <div className="Content">
         <div className="Post">
               <form onSubmit={(event) => updatePost(event, postId)}>
                  <div className="Post-Header-Form">
                     <div className="Post-Author-Text">
                        <h3>{"User: " + user}</h3>
                     </div>
                     <div>
                        <button type="submit">Update Post</button>
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
      </div>);
   }

export default Edit