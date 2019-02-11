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
    });

})();