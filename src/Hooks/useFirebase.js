import React, { useEffect, useState } from "react";
import initAuth from "../Pages/Login/Firebase/firebase.init";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import axios from "axios";

initAuth();
const useFirebase = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const auth = getAuth();

  ///user state observer
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser({});
      }
      setIsLoading(false);
    });
  }, []);

  ///new User register
  const registerUser = (email, password, name) => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        updateUser(name);
        const newUser = {
          displayName: name,
          email: user.email,
        };
        newUserInfo(newUser);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
        // ..
      })
      .finally(() => setIsLoading(true));
  };

  ///login user
  const userLogin = (email, password, location, history) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setError("");
        const destination = location?.state?.from || "/";
        history.push(destination);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  ///logout
  const logout = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
      })
      .finally(() => setIsLoading(false));
  };

  ///user info post to server
  const newUserInfo = (newUser) => {
    axios
      .post("https://nameless-fortress-10028.herokuapp.com/users", newUser)
      .then((res) => {
        ///save to database
      });
  };

  ///update user profile
  const updateUser = (name) => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        // Profile updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };

  //check admin
  useEffect(() => {
    axios
      .get(
        `https://nameless-fortress-10028.herokuapp.com/users/admin/${user?.email}`
      )
      .then((res) => {
        console.log(res.data, admin);
        if (res.data.admin) {
          setAdmin(true);
        }
      });
  }, [user?.email, admin]);

  return {
    user,
    error,
    isLoading,
    registerUser,
    userLogin,
    admin,
    logout,
  };
};

export default useFirebase;
