import React, { useState } from "react";
import "./styles.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
firebase.initializeApp(firebaseConfig);

export default function App() {
  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    photo:'',
    Password:'',
    error:''
    
    
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignInGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        const {displayName,photoURL,email,Password}=res.user;
       const signedInUser={
         isSignedIn:true,
         name:displayName,
         email:email,
         photo:photoURL,
         Password:Password,

       }
       setUser(signedInUser);
      })
      .catch(error =>{
        console.log(error);
      })
  };
  const handleSignOut =() =>{
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      const userOut={
        isSignedIn:false,
        name:'',
        email:'',
        photo:'',
        Password:'',
        error:'',
        existingUser:false
      }
      setUser(userOut);
    }).catch(function(error) {
      // An error happened.
    });
  }
  let isTrue=true;
const ValidateEmail=(mail)=>{
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  } 
  return (false);
}
  const handleChange= e =>{
    const newuserInfo={
      ...user
    };
    if(e.target.name==='email'){
       isTrue=ValidateEmail(e.target.value);
       if(isTrue===true){
        newuserInfo[e.target.name]=e.target.value;
        newuserInfo.isTrue=isTrue;
       setUser(newuserInfo);
       //console.log(user);
       }
    }
    else if(e.target.name==='name'){
       newuserInfo[e.target.name]=e.target.value;
       setUser(newuserInfo);
       //console.log(user);
    }
    else if( e.target.name==='Password'){
      newuserInfo[e.target.name]=e.target.value;
      setUser(newuserInfo);
      //console.log(user);
    }
  }
  const createAccount=(e)=>{
    
    e.preventDefault();
    if(user.isTrue===true){
      const updateUser={...user};
      firebase.auth().createUserWithEmailAndPassword(user.email, user.Password)
      .then(res => {
        updateUser.isSignedIn=true;
        updateUser.error='';
        setUser(updateUser);
      })
      .catch(function(error) {
        // Handle Errors here
        updateUser.isSignedIn=false;
        updateUser.error=error.message;
        setUser(updateUser);
        // ...
      });
    }
    else{
      user.isSignedIn=false;
      console.log("invalid");
    }
    e.target.reset();
  }

  const signInUser =(e)=>{
    e.preventDefault();
    const updateUser={...user};
    firebase.auth().signInWithEmailAndPassword(user.email, user.Password)
    .then(res =>{
      updateUser.isSignedIn=true;
        updateUser.error='';
        setUser(updateUser);
    })
    .catch(function(error) {
      updateUser.isSignedIn=false;
        updateUser.error=error.message;
        setUser(updateUser);
      // ...
    });
      
      e.target.reset();

  }
  const switchForm =(e)=>{
    const update={...user};
    update.existingUser=e.target.checked;
    setUser(update);
  }
  console.log(user);
  return (
    <div className="App">
      
        
        
          {
            user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
            <div className="card">
              
              <input type="checkbox" name="switchForm" id="switchForm" onChange={switchForm}/>
              <label htmlFor="switchForm">Returning User</label>
              
              <form onSubmit={signInUser} style={{display:user.existingUser ? 'block' :'none'}}>
                  <h1>Login</h1>
                  <input type="text" placeholder="E-mail" name="email" onBlur={handleChange}
                  required />
                  <br/>
                  <input type="password" placeholder="Password" name="Password" onBlur={handleChange} required />
                  <br/>
                  <input type="submit" value="Sign In"/>
                  <br/>
                    {
                      user.error && <p style={{color:'red'}}>{user.error}</p>
                    }
              </form>
              <form onSubmit={createAccount} style={{display:user.existingUser ? 'none' :'block'}}>
                  <h1>Our own Authentication</h1>
                  <input type="text" placeholder="User_name" name="name" onBlur={handleChange}
                    required />
                    <br/>
                    <input type="text" placeholder="E-mail" name="email" onBlur={handleChange}
                    required />
                    <br/>
                    <input type="password" placeholder="Password" name="Password" onBlur={handleChange} required />
                    <br/>
                    <button type="submit">Create Account</button>
                    <br/>
                    {
                      user.error && <p style={{color:'red'}}>{user.error}</p>
                    }
              </form> 
              <br/>
              <p>or sign in with</p>
              <button onClick={handleSignInGoogle}>Goggle</button> 
            </div>
          }
            {
          user.isSignedIn && <div>
            <h2>Welcome : {user.name}</h2>
            <img src={user.photo} alt="me"/>
            <p>Email :{user.email}</p>
          </div>
        }
       
      
      
    </div>
  );
}
