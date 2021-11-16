//global variables

$(function () {

    $(".form-control").on("change", function (e) {
        $("#formCheck").addClass("hidden");
        $(e.target).removeClass("border-danger");
    });

    $("#verifyPassword").on("change", function (e) {
        $("#passwordMatchCheck").addClass("hidden");
        $(e.target).removeClass("border-danger");
    });

    $("#email").on("change", function (e) {
        $("#emailCheck").addClass("hidden");
        $(e.target).removeClass("border-danger");
    });

    $("form").on("submit", function (e) {
        isValid = true;
        if (!isFormValid()) {
            $("#formCheck").removeClass("hidden");
            $("#formCheck").addClass("text-danger");
            $("#formCheck").html("All fields are required.");
            isValid = false;
        }
        if (e.target.id === "register") {
            if ($("#password").val() != $("#verifyPassword").val()) {
                $("#passwordMatchCheck").removeClass("hidden");
                $("#passwordMatchCheck").addClass("text-danger");
                $("#passwordMatchCheck").html("Passwords do not match.");
                $("#verifyPassword").addClass("border-danger");
                isValid = false;
            }
        }

        if (isValid) {
            submitForm(e.target.id);
        }
        return false;
    });

    function isFormValid() {
        let valid = true;

        $("input").each(function () {
            if ($(this).val().length == 0) {
                $(this).addClass("border-danger");
                valid = false;
            }
        });

        let email = $("#email").val();
        if (email != undefined && email.length > 0) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(email)) {
                $("#emailCheck").removeClass("hidden");
                $("#emailCheck").addClass("text-danger");
                $("#emailCheck").html("Must be a valid email.");
                $("#email").addClass("border-danger");
                valid = false;
            }
        }
        return valid;
    }

    async function submitForm() {
        await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "firstname": $("#firstname").val(),
                "lastname": $("#lastname").val(),
                "email": $("#email").val(),
                "password": $("#password").val()
            }),
        })
            .then(response => response.json())
            .then(function (data) {
                if (data.type === 'error') {
                    $("#formCheck").removeClass("hidden");
                    $("#formCheck").addClass("text-danger");
                    $("#formCheck").html(data.message);
                } else {
                    $(location).prop('href', '/home');
                }
            })
            .catch(error => console.log(error));
    }

    async function submitForm(route) {
        await fetch('/' + route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "firstname": $("#firstname").val(),
                "lastname": $("#lastname").val(),
                "email": $("#email").val(),
                "password": $("#password").val()
            }),
        })
            .then(response => response.json())
            .then(function (data) {
                if (data.type === 'error') {
                    $("#formCheck").removeClass("hidden");
                    $("#formCheck").addClass("text-danger");
                    $("#formCheck").html(data.message);
                } else {
                    $(location).prop('href', '/home');
                }
            })
            .catch(error => console.log(error));
    }

}); //ready

// All tests which should pass
// first and last name must not be null
// email should be a valid email address
// password must not be empty
// repeat password should match first password entry
