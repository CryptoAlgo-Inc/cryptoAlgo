var perf = firebase.performance();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        if (user.isAnonymous) {
            document.getElementById("headText").innerHTML = "Welcome to CryptoAlgo";
            document.getElementById("usrName").innerHTML = "Hello, Anonymous User";
            document.getElementById("loginArea").style.display = 'none';
            $('#profileSpace').fadeIn("slow");
            document.getElementById('outerSettingsBtn').style.display = 'none';
            document.getElementById('usrEmail').style.display = 'none';
            document.getElementById('signOutButton').style.paddingRight = '0px';
            return;
		}

        // The user is signed in
        document.title = 'CryptoAlgo | User Profile';

        $('#warningBox1').fadeOut(0);
        var user = firebase.auth().currentUser;
        //    user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                            // this value to authenticate with your backend server, if
                            // you have one. Use User.getToken() instead.

        // This basically undos what the above if... block does if there's an Anonymous user.
        document.getElementById('outerSettingsBtn').style.display = 'inline-block';
        document.getElementById('usrEmail').style.display = 'block';
        document.getElementById('signOutButton').style.paddingRight = '5px';
        console.log('Name: ' + user.displayName);
        console.log('Email: ' + user.email);
        console.log('Profile Photo: ' + user.photoURL);
        console.log('Is email verified? ' + user.emailVerified);
        console.log('User UID: ' + user.uid);
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            // ...
            console.log(idToken);
        }).catch(function(error) {
            pushWarning(error);
        });
        // Update page elements
        document.getElementById("headText").innerHTML = "Welcome to CryptoAlgo";
        if (user.displayName) { // Check if there's a display name
            document.getElementById("usrName").innerHTML = "Hello, " + user.displayName;
        }
        else if (!user.email) {
            document.getElementById("usrName").innerHTML = "Please enter a email in settings";
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
        const loginTime = perf.trace('Render Login Screen');
        loginTime.start();
        // The user is not signed in
        document.title = 'CryptoAlgo | Login'; // Change title
        $('#warningBox1').fadeOut(0);
        document.getElementById("headText").innerHTML = "CryptoAlgo Login";
        $('#profileSpace').fadeOut(0);
        $('#loginArea').fadeIn();
        // The start method will wait until the DOM is loaded.
                    // FirebaseUI config.
        ui.start('#firebaseui-auth-container', uiConfig); // Render the login box
        loginTime.stop();
    }
});

function pushWarning(warningText, autoclose=true) {
    const warnings = perf.trace('pushWarning');
    warnings.start();
    document.getElementById("infoText").innerHTML = warningText;
    $("#infoArea").fadeIn();
    $("#contentArea").removeClass("unBlur");
    $("#contentArea").addClass("blurred");
    $("body").addClass("modal-open");
    if (autoclose) {
        setTimeout(function() { 
            closeModal();
        }, 5000);
    }
    warnings.stop();
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
    const usrNameChangeTrace = perf.trace('Change User Display Name');
    usrNameChangeTrace.start();
    var newDisplayName = document.getElementById("displayName").value;
    if(newDisplayName.length == 0) {
        pushWarning("The input is not filled in");
        usrNameChangeTrace.stop();
        return;
    }
    else if(newDisplayName.trim().length == 0) {
        pushWarning("The input does not have any text");
        usrNameChangeTrace.stop();
        return;
	}
    firebase.auth().currentUser.updateProfile({
        displayName: newDisplayName
    }).then(function() {
        // Update successful.
        $('#usrName').fadeOut(function() {
            document.getElementById("usrName").innerHTML = "Hello, " + newDisplayName;
            $('#usrName').fadeIn();
            usrNameChangeTrace.stop();
		});
    }).catch(function(error) {
        pushWarning("Failed to update profile");
        console.error("Failed to update profile:", error);
        usrNameChangeTrace.stop();
    });     
}

function signOutUser() {
    if(confirm('Are you sure you want to sign out of CryptoAlgo?')) {
        firebase.auth().signOut().then(function() {
            console.log("User signed out");
            pushWarning('You have been signed out. Thank you for using CryptoAlgo.');
            closeAllSettings();
        }, function(error) {
            console.error('Sign Out Error', error);
        });
    }
}

function changePwd() {
    firebase.auth().currentUser.updatePassword(document.getElementById("changePwd").value).then(function() {
        // Update successful.
        pushWarning("Successfully changed password.");
        $('#pwdChange').fadeIn();
    }).catch(function(error) {
        pushWarning(error);
        $('#pwdChange').fadeIn();
    });
}

function changeUserPassword() {
    if (firebase.auth().currentUser.email == null) {
        pushWarning("Please enter a email address first before setting a password.");
        return;
	}
    if (!(document.getElementById("changePwd").value == document.getElementById("confirmChangePwd").value)) {
        // The two passwords do not match
        pushWarning("The passwords do not match");
        return;
	}
    var passwdTemplate=  /^[A-Za-z]\w{7,64}$/;
    if(document.getElementById("changePwd").value.match(passwdTemplate)) {
        $('#pwdChange').fadeOut();
        var userProvidedPassword = document.getElementById("oldPwd").value;
        if (document.getElementById("oldPwd").value.length <= 5) {
            changePwd();
            return;
	    }
        var credential = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email, 
            userProvidedPassword
        );
        firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function() {
            changePwd();
        }).catch(function(error) {
            pushWarning(error);
        });
    }
    else {
        pushWarning("Please meet the following requirements: 7-64 characters, starting with a letter")
        $('#pwdChange').fadeIn();
	}
}

function changeEmail() {
    firebase.auth().currentUser.updateEmail(document.getElementById("changeEmail").value).then(function() {
        pushWarning("Updated email address. Please verify your new email.");
    }).catch(function(error) {
        pushWarning(error);
    });
}

function updateEmail() {
    if (firebase.auth().currentUser.email) {
        var userEmail = firebase.auth().currentUser.email;
	}
    else {
        changeEmail(); // If the user does not already have a email, directly change email
	}
    var userProvidedPassword = document.getElementById("emailChgPwd").value;
    var credential = firebase.auth.EmailAuthProvider.credential(
        userEmail,
        userProvidedPassword
    );
    firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function() {
        changeEmail();
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
        console.log(file.size);
        if (file.size > 2000000) {
            pushWarning('Image size too big. Please select a image that is <= 2MB.');
            return;
		}
        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();

        // Create a storage reference from the Firebase storage service
        var storageRef = storage.ref();

        var uploadTask = storageRef.child('/' + firebase.auth().currentUser.uid + '/pfp.' + file.name.split('.').pop()).put(file);

        // elem.style.width = width + '%';

        uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            document.getElementById('progressBar').style.width = progress + '%';

            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                break;
            }
        }, function(error) {
            // Handle unsuccessful uploads
            document.getElementById('progressBar').style.width = "0px";
            pushWarning(error);
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            pushWarning("Uploaded profile picture");
            document.getElementById('progressBar').style.width = "0px";

            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
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
        if(prompt("Are you sure you want to delete your account? THIS ACTION CANNOT BE UNDONE! To continue, key in your email address.", "Your email address") == firebase.auth().currentUser.email){
            firebase.auth().currentUser.delete().then(function() {
                pushWarning("Your account has been deleted. You will be automatically logged out.");
                closeAllSettings();
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

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (X), close the modal
function closeModal() {
    $('#infoArea').fadeOut();
    $("#contentArea").removeClass("blurred");
    $("#contentArea").addClass("unBlur");
    $("body").removeClass("modal-open");
}
// End of model box JavaScript

function closeAllSettings() {
    var coll = document.getElementsByClassName("collapsible");

    for (var i = 0; i < coll.length; i++) {
        try {
            coll[i].classList.remove("active");
            if (coll[i].nextElementSibling.style.maxHeight){
                coll[i].nextElementSibling.style.maxHeight = null;
            }
        } catch {
            // Ignore error as that means the boxes were not open
		}
    }
    $('#profileSettings').fadeOut(0);
    document.getElementById("settingsBtn").innerHTML = "settings";
    closeOrOpen = true;
}