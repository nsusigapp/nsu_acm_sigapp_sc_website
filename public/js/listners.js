
(function () {
    const onErrorCss = (elem) => {

        elem.style.borderColor = "crimson";
        elem.style.boxShadow = "0 0 0 0.2rem rgba(220,20,60,.5)";
    }

    const onSuccessCss = (elem) => {

        elem.style.borderColor = "green";
        elem.style.boxShadow = "0 0 0 0.2rem rgba(88,214,141,.5)";
    }

    // check password match;
    const checkPassword = function () {

        const passwdField = document.getElementById("password");
        const rePasswdField = document.getElementById("re_password");

        let passwd = passwdField.value;
        let rePasswd = rePasswdField.value;

        if (passwd !== rePasswd) {

            onErrorCss(passwdField);

        } else if (rePasswd.length > 0) {

            onSuccessCss(rePasswdField);
        }
    }

    const checkNsuEmail = function () {

        const mailField = document.getElementById("nsuMail");

        let nsuMail = mailField.value;

        if (!(nsuMail.endsWith("@northsouth.edu"))) {

            onErrorCss(mailField);

        } else {

            onSuccessCss(mailField);
        }
    }

    const validateFields = function (event) {
        
        event.preventDefault();
        let isFieldEmpty = false;
        let message = "";

        $(".registration-box-form input[type!=submit]").each(function () {
            if ($(this).val() === "") {
                isFieldEmpty = true;
                message = "There Are Empty Fields!";
            }
        });

        if (isFieldEmpty) {

            alert(message);

        } else if (!($("#nsuMail").val().endsWith("@northsouth.edu"))) {

            message = "Invalid NSU Email!";
            alert(message);

        } else if ($("#password").val() !== $("#re_password").val()) {

            message = "Password Do Not Match!";
            alert(message);

        } else {

            $("#registration-box-form").submit();
        }
    }

    document.getElementById("re_password").addEventListener("keyup", checkPassword);
    document.getElementById("nsuMail").addEventListener("keyup", checkNsuEmail);
    document.getElementById("registerBtn").addEventListener("click", validateFields);

})();

