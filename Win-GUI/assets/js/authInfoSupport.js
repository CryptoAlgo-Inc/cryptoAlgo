var firebaseConfig={apiKey:"AIzaSyDu3GBqQg6o9Mp7Ay6KkTKRnqogZWmhU6c",authDomain:"cryptoalgogui.firebaseapp.com",databaseURL:"https://cryptoalgogui.firebaseio.com",projectId:"cryptoalgogui",storageBucket:"cryptoalgogui.appspot.com",messagingSenderId:"104602369567",appId:"1:104602369567:web:bcfdad88debbb2b8cddf2a",measurementId:"G-YT1W6G83B3"};firebase.initializeApp(firebaseConfig);var perf=firebase.performance();firebase.auth().onAuthStateChanged(function(e){e?(document.getElementById("loginContainer").style.display="none",document.getElementById("signOutContainer").style.display="display flex",e.displayName?document.getElementById("usrDisplayName").innerHTML=e.displayName:e.email?document.getElementById("usrDisplayName").innerHTML=e.email:document.getElementById("usrDisplayName").innerHTML="Logged In",document.getElementById("usrLogoArea").src=e.photoURL,console.log("Changed src")):(document.getElementById("signOutContainer").style.display="none",document.getElementById("loginContainer").style.display="display flex",document.getElementById("usrDisplayName").innerHTML="Logged Out")});