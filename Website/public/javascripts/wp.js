const loginButton = $("#loginButton");
loginButton.click(function(){
    window.location = "/user/login";
});
const bookButton = $("#bookButton");
bookButton.click(function(){
    window.location = "/register";
});
const getStarted = $("#getStarted");
getStarted.click(function(){
    window.location = "/register";
});
const accountButton = $("#accountButton");
accountButton.click(function(){
    window.location = "/user";
});
const heroAccountButton = $("#heroAccountButton");
heroAccountButton.click(function(){
    window.location = "/user";
});
const learnMoreCovidButton = $("#learnMoreCovid");
learnMoreCovidButton.click(function(){
    window.location = "/about-covid";
});
const learnMoreNtiButton = $("#learnMoreNti");
learnMoreNtiButton.click(function(){
    window.location = "/about-nti";
});

const testDateOne = $("#testDateOne");
const testTimeOne = $("#testTimeOne");
const testDateTwo = $("#testDateTwo");
const testTimeTwo = $("#testTimeTwo");

let currentTestDateOne;
testDateOne.change(function() {
    const newTestDateOneString = testDateOne.val();
    const newTestDateOne = new Date(testDateOne.val());
    if (newTestDateOne.getDay() === 6 || newTestDateOne.getDay() === 0) {
        alert("Test slots are only available on weekdays.");
        testDateOne.val(currentTestDateOne);
    }else{
        currentTestDateOne = newTestDateOneString;
    }
    valueChange();
});

testTimeOne.change(function(){
    valueChange();
});

const valueChange = function(){
    if((typeof testDateOne.val() !== 'undefined' && testDateOne.val() !== '') && (testTimeOne.val() === 'morning' || testTimeOne.val() === 'afternoon')){

        const min = getSecondTestMin(testDateOne.val());
        const max = getSecondTestMax(getSecondTestMin(testDateOne.val()));

        testDateTwo.prop("max", max);
        testDateTwo.prop("min", min);

        testDateTwo.prop("disabled", false);
        testTimeTwo.prop("disabled", false);
    }else{
        testDateTwo.prop("disabled", true);
        testTimeTwo.prop("disabled", true);
    }
}

//Get the first monday of the next week given a date
function getSecondTestMin(d){
    d = new Date(d);
    d.setUTCMilliseconds(d.getMilliseconds() + 7 * 24 * 60 * 60 * 1000);
    const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
    d = new Date(d.setDate(diff));
    return d.toISOString().slice(0,10);
}

//Get final day of week for second test given the first Monday
function getSecondTestMax(d){
    d = new Date(d);
    d = new Date(d.setDate(d.getDate() + 4));
    return d.toISOString().slice(0,10);
}

function showSpinner(){
    const submitButton = $('#submitButton');
    submitButton.prop('disabled', true);
    submitButton.html(
        "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span> Working..."
    );
}

function hideSpinner(){
    const submitButton = $('#submitButton');
    submitButton.prop('disabled', false);
    submitButton.html(
        "Submit"
    );
}

function showError(text){
    $(".alertHolder").addClass("alert alert-warning mt-3").html(text);
}

function hideError(){
    $(".alertHolder").removeClass("alert alert-warning mt-3").html('');
}

$('#bookingForm').submit(function(e){
    e.preventDefault();

    showSpinner();
    hideError();

    let form = $(this);
    let url = '/register/booktest';

    $.post(url, form.serialize(), function(){
        //redirect to success page
        window.location.replace("/register/booktest/success");
    }).fail(function(xhr, status, error){
        //parse response and show relevant error
        console.log(xhr);

        switch(xhr.responseText){
            case "ERR_USERNAME_EXISTS":
                hideSpinner();
                showError('An account with this username already exists. Please either <a href="/login">log in</a> or choose a different username.');
                break;
            case "ERR_INVALID_POSTCODE":
                hideSpinner();
                showError('Please enter a valid postcode.');
                break;
            default:
                hideSpinner();
                showError('An unknown error occurred. Please check your internet connection and try again. If the issue persists, please contact the Norwich Testing Initiative for more help.');
        }
    })

});