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

        // check password match;

        const checkPassword= function(){
            let passwd= $("#password").val();
            let rePasswd= $("#re_password").val();

            if(passwd !== rePasswd){
                $("#re_password").css({
                    "border-color": "crimson",
                    "box-shadow": "0 0 0 0.2rem rgba(220,20,60,.5)"
                });
            }else{
                $("#re_password").css({
                    "border-color": "green",
                    "box-shadow": "0 0 0 0.2rem rgba(88,214,141,.5)"
                });
            }
        }

        $("#re_password").keyup(checkPassword);
    });

})();