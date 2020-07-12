// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDu3GBqQg6o9Mp7Ay6KkTKRnqogZWmhU6c",
    authDomain: "cryptoalgogui.firebaseapp.com",
    databaseURL: "https://cryptoalgogui.firebaseio.com",
    projectId: "cryptoalgogui",
    storageBucket: "cryptoalgogui.appspot.com",
    messagingSenderId: "104602369567",
    appId: "1:104602369567:web:bcfdad88debbb2b8cddf2a",
    measurementId: "G-YT1W6G83B3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Init Firebase Performance
var perf = firebase.performance();

firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        document.getElementById("loginContainer").style.display = 'none';
        document.getElementById("signOutContainer").style.display = 'display flex';
        // Signed in
        //if (user.isAnonymous) {
            // Check if its anonymous
        //}
        if (user.displayName) {
            document.getElementById("usrDisplayName").innerHTML = user.displayName;
        }
        else if (user.email) {
            document.getElementById("usrDisplayName").innerHTML = user.email;
		}
        else {
            document.getElementById("usrDisplayName").innerHTML = "Logged In";
        }
        document.getElementById("usrLogoArea").src = user.photoURL;
        console.log("Changed src");
	}
    else {
        // Signed out
        document.getElementById("signOutContainer").style.display = 'none';
        document.getElementById("loginContainer").style.display = 'display flex';
        document.getElementById("usrDisplayName").innerHTML = "Logged Out";
	}
});