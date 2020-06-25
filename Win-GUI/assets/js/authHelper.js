firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // The user is signed in
        document.title = 'CryptoAlgo | User Profile';

        $('#warningBox1').fadeOut(0);
        var user = firebase.auth().currentUser;
        //    user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                            // this value to authenticate with your backend server, if
                            // you have one. Use User.getToken() instead.

        console.log('Name: ' + user.displayName);
        console.log('Email: ' + user.email);
        console.log('Profile Photo: ' + user.photoURL);
        console.log('Is email verified? ' + user.emailVerified);
        console.log('User UID: ' + user.uid);
        // Update page elements
        document.getElementById("headText").innerHTML = "Welcome to CryptoAlgo";
        if (user.displayName) { // Check if there's a display name
            document.getElementById("usrName").innerHTML = "Hello, " + user.displayName;
        }
        else {
            document.getElementById("usrName").innerHTML = "Hello, " + user.email;
		}
        document.getElementById("usrProfilePic").src = user.photoURL;
        if (!user.emailVerified) {
            document.getElementById("usrEmail").innerHTML = user.email + "<br/> Email not verified";
            $('#verifyEmail').fadeIn();
        }
        else {
            document.getElementById("usrEmail").innerHTML = user.email + "<br/> Email verified";
        }
        $('#loginArea').fadeOut(0);
        $('#profileSpace').fadeIn("slow");
    } else {
        // The user is not signed in
        document.title = 'CryptoAlgo | Login'; // Change title
        $('#warningBox1').fadeOut(0);
        document.getElementById("headText").innerHTML = "CryptoAlgo Login";
        $('#profileSpace').fadeOut(0);
        $('#loginArea').fadeIn();
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig); // Render the login box
    }
});

function emailAuthLogin() {
    firebase.auth().signInWithEmailAndPassword(document.getElementById("username").value, document.getElementById("password").value).catch(function(error) {
        // Handle Errors here.
        pushWarning(error.message);
        console.error(error.message);
    });
}

function pushWarning(warningText) {
    document.getElementById("warnings").innerHTML = warningText;
    $('#warningBox').fadeIn();
    setTimeout(function() { 
        $('#warningBox').fadeOut();
    }, 3000);
    document.getElementById("warnings1").innerHTML = warningText;
    $('#warningBox1').fadeIn();
    setTimeout(function() {
        $('#warningBox1').fadeOut();
    }, 3000);
}

function openAccountCreate() {
    $('#newAccountHint').fadeOut();
    $('#emailLogin').fadeOut(function() {
        $('#newAccount').fadeIn();
        $('#backToLogin').fadeIn();
    });
}

function verifyEmail() {
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        pushWarning("Verification email sent. It may take up to 5 minutes to be received.");
        $('#verifyEmail').fadeOut();
    }).catch(function(error) {
        pushWarning(error);
    });
}

var closeOrOpen = true; // True for open
function usrSettingsCloseOpen() {
    if(closeOrOpen) {  // Open settings
        $('#profileSettings').fadeIn();
        $('#settingsBtn').fadeOut(function() {
            document.getElementById("settingsBtn").innerHTML = "close";
            $('#settingsBtn').fadeIn();
        });
        closeOrOpen = false;
    }
    else {
        $('#profileSettings').fadeOut();
        $('#settingsBtn').fadeOut(function() {
            document.getElementById("settingsBtn").innerHTML = "settings";
            $('#settingsBtn').fadeIn();
        });
        closeOrOpen = true;
    }
}

function updateProfile() {
    var newDisplayName = document.getElementById("displayName").value;
    if(newDisplayName.length == 0) {
        pushWarning("The input is not filled in");
        return;
    }
    else if(newDisplayName.trim().length == 0) {
        pushWarning("The input does not have any text");
        return;
	}
    firebase.auth().currentUser.updateProfile({
        displayName: newDisplayName
    }).then(function() {
        // Update successful.
        $('#usrName').fadeOut(function() {
            document.getElementById("usrName").innerHTML = "Hello, " + newDisplayName;
            $('#usrName').fadeIn();
		});
    }).catch(function(error) {
        pushWarning("Failed to update profile");
        console.error("Failed to update profile:", error);
    });     
}

function backToLogin() {
    $('#newAccount').fadeOut();
    $('#backToLogin').fadeOut(function() {
        $('#newAccountHint').fadeIn();
        $('#emailLogin').fadeIn();
    });
}

function createNewAccount() {
    if(!(document.getElementById("newPassword").value == document.getElementById("confirmPassword").value)) {
        pushWarning("The passwords do not match");
        return;
    }
    var passwdTemplate=  /^[A-Za-z]\w{7,64}$/;
    if(document.getElementById("newPassword").value.match(passwdTemplate)) {
        firebase.auth().createUserWithEmailAndPassword(document.getElementById("newUsername").value, document.getElementById("newPassword").value).catch(function(error) {
            pushWarning(error.message);
        });
    }
    else {
        pushWarning("Please meet the following requirements: 7-64 characters, starting with a letter")
    }
}

function signOutUser() {
    if(confirm('Are you sure you want to sign out of CryptoAlgo?')) {
        firebase.auth().signOut().then(function() {
            console.log("User signed out");
            alert('You have been signed out. Thank you for using CryptoAlgo.');
        }, function(error) {
            console.error('Sign Out Error', error);
        });
    }
}

function changeUserPassword() {
    if(!(document.getElementById("changePwd").value == document.getElementById("confirmChangePwd").value)) {
        // The two passwords do not match
        pushWarning("The passwords do not match");
        return;
	}
    var passwdTemplate=  /^[A-Za-z]\w{7,64}$/;
    if(document.getElementById("changePwd").value.match(passwdTemplate)) {
        $('#pwdChange').fadeOut();
        var userProvidedPassword = document.getElementById("oldPwd").value;
        var credential = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email, 
            userProvidedPassword
        );
        firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function() {
            firebase.auth().currentUser.updatePassword(document.getElementById("changePwd").value).then(function() {
                // Update successful.
                alert("Successfully changed password.");
                $('#pwdChange').fadeIn();
            }).catch(function(error) {
                pushWarning(error);
            });
        }).catch(function(error) {
            // An error happened.
        });
    }
    else {
        pushWarning("Please meet the following requirements: 7-64 characters, starting with a letter")
        $('#pwdChange').fadeIn();
	}
}

function updateEmail() {
    var userProvidedPassword = document.getElementById("emailChgPwd").value;
    var credential = firebase.auth.EmailAuthProvider.credential(
        firebase.auth().currentUser.email, 
        userProvidedPassword
    );
    firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function() {
        firebase.auth().currentUser.updateEmail(document.getElementById("changeEmail").value).then(function() {
            pushWarning("Updated email address. Please verify your new email.");
        }).catch(function(error) {
            pushWarning(error);
        });
    }).catch(function(error) {
        pushWarning(error);
    });
}

document.getElementById('profilePicSelector').addEventListener('change', function(e) {
    var file = e.currentTarget.files[0];

    var ext = file.name.match(/\.([^\.]+)$/)[1];
    switch (ext) {
        case 'tiff':
        case 'pjp':
        case 'pjpeg':
        case 'jfif':
        case 'tif':
        case 'gif':
        case 'svg':
        case 'bmp':
        case 'png':
        case 'jpeg':
        case 'svgz':
        case 'jpg':
        case 'webp':
        case 'ico':
        case 'xbm':
        case 'dib':
        break;
    default:
        pushWarning('This file type is not allowed');
        return;
    }

    if (file) {
        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();

        // Create a storage reference from the Firebase storage service
        var storageRef = storage.ref();

        var profilePicUploadRef = storageRef.child(firebase.auth().currentUser.uid + '/' + file.name);

        profilePicUploadRef.put(file).then(function(snapshot) {
            pushWarning('Uploaded image');
            snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log("File available at", downloadURL);
                var fileDownloadURL = downloadURL;
                firebase.auth().currentUser.updateProfile({
                    photoURL: fileDownloadURL
                }).then(function() {
                    pushWarning("Updated profile image");
                    document.getElementById("usrProfilePic").src = fileDownloadURL;
                    $('#usrProfilePic').fadeOut(function() {
                        $('#usrProfilePic').fadeIn();
                    });
                }).catch(function(error) {
                    pushWarning(error);
                });
            });
        });
    }
    else {
        pushWarning("No valid file selected");
	}
})

function deleteUser() {
    var credential = firebase.auth.EmailAuthProvider.credential(
        firebase.auth().currentUser.email, 
        document.getElementById("acctDeletePwd").value
    );

    firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function() {
        if(confirm("Are you sure you want to delete your account? THIS ACTION CANNOT BE UNDONE!")){
            firebase.auth().currentUser.delete().then(function() {
                alert("Your account has been deleted. You will be automatically logged out.");
            }).catch(function(error) {
                pushWarning(error);
            });
        }
    }).catch(function(error) {
        pushWarning(error);
    });
}

// Start of Model Box JavaScript

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// End of model box JavaScript