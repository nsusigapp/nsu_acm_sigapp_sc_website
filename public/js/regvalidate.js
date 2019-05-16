
(function () {

    const passwdField = document.getElementById("password");
    const rePasswdField = document.getElementById("re_password");

    const mailField = document.getElementById("nsuMail");
    const idField = document.getElementById("nsuID");
    const unameField = document.getElementById("username");


    // change css on error
    const onErrorCss = (elem) => {

        elem.style.borderColor = "crimson";
        elem.style.boxShadow = "0 0 0 0.2rem rgba(220,20,60,.5)";
    }

    // change css upon validation
    const onSuccessCss = (elem) => {

        elem.style.borderColor = "green";
        elem.style.boxShadow = "0 0 0 0.2rem rgba(88,214,141,.5)";
    }

    // add input error msg to the flashbox;
    const appendToErrorList = (msg) => {

        const flashBox = document.getElementById("flash-box-list");
        const flashBoxList = Array.from(document.getElementById("flash-box-list").childNodes);
        
        // add/remove error classes for appropriate styles

        if(flashBox.parentElement.classList.contains("flash-box-success")){

            flashBox.parentElement.classList.remove("flash-box-success");
            flashBox.classList.remove("flash-box--req-success");
        }

        if(!(flashBox.parentElement.classList.contains("flash-box-error"))){

            flashBox.parentElement.classList.add("flash-box-error");
            flashBox.classList.add("flash-box--req-error");
        }

        //remove existing lists
        flashBoxList.forEach(item => {
            item.parentNode.removeChild(item);
        });

        // add the erorr li
        const li = document.createElement("li");
        li.textContent = msg;

        flashBox.appendChild(li);
    }

    // check password match;
    const checkPassword = function() {

        let passwd = passwdField.value;
        let rePasswd = rePasswdField.value;

        if (passwd !== rePasswd) {

            onErrorCss(passwdField);
            onErrorCss(rePasswdField);

        } else if (rePasswd.length > 0 && rePasswd === passwd) {

            onSuccessCss(passwdField);
            onSuccessCss(rePasswdField);
        }
    }

    // validate nsu email
    const checkNsuEmail = function() {

        let nsuMail = mailField.value;

        if (!(nsuMail.endsWith("@northsouth.edu"))) {

            onErrorCss(mailField);

        } else {

            onSuccessCss(mailField);
        }
    }

    // validate nsu id
    const checkNsuId = function() {

        let nsuId = idField.value;

        if (!(nsuId.match(/^[01][0-9][0-3]\d{4}(\d{3})?$/))) {

            onErrorCss(idField);

        } else {

            onSuccessCss(idField);
        }
    }

    const checkUnameAvailable = function() {

        axios.post("/check-username", {
            username: unameField.value,
        })
            .then(res => {

                if (document.getElementById("uname_span") === null) { // if element doesn't exist; attach to DOM

                    const span = document.createElement("span");
                    const unameDiv = document.getElementById("uname_div");

                    span.setAttribute("class", "margin-gutter-small");
                    span.style.display = "inline-block";
                    span.setAttribute("id", "uname_span");

                    unameDiv.parentElement.insertBefore(span, unameDiv);
                }

                if (res.data.available) {

                    document.getElementById("uname_span").style.color = "green";
                    document.getElementById("uname_span").textContent = "Username Available!";

                } else {

                    document.getElementById("uname_span").style.color = "crimson";
                    document.getElementById("uname_span").textContent = "x Username Unavailable!";
                }

            })
            .catch(err => console.log(err));
    }

    // validate form before form submision
    const validateFields = function(event) {
    
        event.preventDefault();
        let isFieldEmpty = false;
        let message = "";

        const inputFields = Array.from(document.querySelectorAll(".registration-box-form input"));

        inputFields.forEach((input) => {
            
            if(input.value === ""){
                isFieldEmpty = true;
                message = "There Are Empty Fields!";
            }
        });

        if (isFieldEmpty) {

            appendToErrorList(message);

        } else if (!mailField.value.endsWith("@northsouth.edu")) {

            message = "Invalid NSU Email!";
            appendToErrorList(message);

        } else if (!(idField.value.match(/^[01][0-9][0-3]\d{4}(\d{3})?$/))) {

            message = "Invalid NSU ID!";
            appendToErrorList(message);

        } else if (passwdField.value !== rePasswdField.value) {

            message = "Passwords Do Not Match!";
            appendToErrorList(message);

        } else {

            document.getElementById("registration-box-form").submit();
        }
    }  

    // event listeners
    rePasswdField.addEventListener("keyup", checkPassword);
    mailField.addEventListener("keyup", checkNsuEmail);
    idField.addEventListener("keyup", checkNsuId);
    unameField.addEventListener("keyup", checkUnameAvailable);
    document.getElementById("registerBtn").addEventListener("click", validateFields);

})();

