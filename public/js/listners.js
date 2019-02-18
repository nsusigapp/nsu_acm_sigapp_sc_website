(function(){
    
    // open modal;
    $(document).ready(function(){
        $("#openSignInModal").click(function(event){
            event.stopPropagation();
            $("#signInModal").fadeToggle();
        });

        // close modal on click outside of modal
        $(document).on("click",function(event){
            if(!$(event.target).closest("#signInModal").length){
                $("#signInModal").fadeOut();
            }
        });

        // css changes

        const onErrorCss= (id)=>{
            $(id).css({
                "border-color": "crimson",
                "box-shadow": "0 0 0 0.2rem rgba(220,20,60,.5)"
            });
        }

        const onSuccessCss= (id)=>{
            $(id).css({
                "border-color": "green",
                "box-shadow": "0 0 0 0.2rem rgba(88,214,141,.5)"
            });
        }

        // check password match;
        const checkPassword= function(){
            let passwd= $("#password").val();
            let rePasswd= $("#re_password").val();

            if(passwd !== rePasswd){
                onErrorCss("#re_password");
            }else if(rePasswd.length > 0){
                onSuccessCss("#re_password")
            }
        }

        const checkNsuEmail= function(){
            let nsuMail= $("#nsuMail").val();

            if(!(nsuMail.includes("@northsouth.edu"))){
                onErrorCss("#nsuMail");
            }else{
                onSuccessCss("#nsuMail");
            }
        }

        const validateFields= function(event){
            event.preventDefault();
            let isFieldEmpty= false;
            let message= "";

            $(".registration-box-form input[type!=submit]").each(function(){
                if($(this).val() === ""){
                    isFieldEmpty= true;
                    message= "There Are Empty Fields!";
                }
            });

            if(isFieldEmpty){

                alert(message);

            }else if(!($("#nsuMail").val().includes("@northsouth.edu"))){

                message= "Invalid NSU Email!";
                alert(message);

            }else if($("#password").val() !== $("#re_password").val()){

                message= "Password Do Not Match!";
                alert(message);

            }else{

                $("#registration-box-form").submit();
            }
        }

        $("#re_password").keyup(checkPassword);
        $("#nsuMail").keyup(checkNsuEmail);
        $("#registerBtn").click(validateFields);
    });

})();