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