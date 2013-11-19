
/**
 * Display the results on a page
 *
 * @param {Array} result - array where each element is a string
 * @param {String} jQuery selector of an element that will be used to display the results
 */
function displayResult(result, element_id) {
    var res_msg = result.join("\n");
    res_msg = "<pre>" + res_msg + "</pre>";
    $(element_id).html(res_msg).show();
};

/**
 * Calculate a cartesian product of a list of lists
 * This is used to generate permutations with repetitions of an array
 * Stolen from: https://gist.github.com/ramn/3103615
 *
 * @param {Array} xss - An array of arrays that need to be multiplied
 * @returns {Array} Array of arrays
 */
function cartesianProduct(xss) {
    if (!xss || xss.length < 1)
        return [];
    else {
        var head = xss[0];
        var tail = xss.slice(1);
        var result = [];
        for (var i = 0; i < head.length; i++) {
            var productOfTail = cartesianProduct(tail);
            if (productOfTail && productOfTail.length > 0) {
                for (var j = 0; j < productOfTail.length; j++) {
                    result.push([head[i]].concat(productOfTail[j]));
                }
            }
            else
                result.push([head[i]]);
        }
        return result;
    }
};

/**
 * Generate all possible permutations with repetition of a given size.
 * This effectivelly is a cartesian product of the same array
 *
 * @param {Array} list - list of elements to use in permutations
 * @param {Number} size - size of the resulting list
 * @return {Array} array of arrays
 */
function perm_r(list, size) {
    var set_of_lists = [];
    for (var i = 0; i < size; i++) {
        set_of_lists[i] = list;
    }
    var result = cartesianProduct(set_of_lists);
    return result;
};
    
/**
 * Generate all possible permutations of the elements in a given list
 * Stolen from: http://jsfiddle.net/q62Dr/38/
 *
 * @param {Array} list - List of elements
 * @return {Array} array of arrays
 */
function perm(list) {
    var permArr = [];
    var usedChars = [];
    function permute(input) {
        var i, ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
                permArr.push(usedChars.slice());
            }
            permute(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        return permArr
    };
    return permute(list);
};

/**
 * Converts a number to string. If the number is negative it will be surroundes by parentheses.
 *
 * @param {Number} number - A number
 * @return {String} string representation of the number
 */
function numToStr(number) {
    if (number < 0) {
        return "(" + number.toString() + ")";
    } else {
        return number.toString();
    }
};

/**
 * Attempts to find an equation using provided numbers, operations and result
 *
 * @param {Array} numbers - An array containing numbers
 * @param {Array} operations - An array containing allowed operations, as string elemets
 * @param {Number} result - "Right side" of the equation
 * @returns {Array} Array containing possible solutions. Empty array if none found
 */
function findEquation(numbers, operations, result) {
    var op_list = perm_r(operations, numbers.length - 1);
    var el_list = perm(numbers);
    var solutions = [];
    for (var i=0; i < el_list.length; i++) { // go through all combinations of numbers
        for (var j=0; j < op_list.length; j++) { // go through all combinations of operations
            var nums = el_list[i];
            var ops = op_list[j];
            var expression = numToStr(nums[0]);
            for (var c=1; c < nums.length; c++) {
                expression = "(" + expression + ops[c-1] + numToStr(nums[c]) + ")";
            }
            var res = eval(expression);
            if (res == result) {
                solutions.push(expression + " = " + res);
            }
        }
    }
    return solutions;
};

/**
 * Convert string to an array of numbers
 * Elements can be separated by the following characters: ' ', ',', ';', '/', '\'
 * Invalid numbers are discarded.
 *
 * @param {string} input_str - String that contains numbers separated by one of the accepted separator characters
 * @returns {Array} Array of numbers
 */
function strToNumArray(input_str) {
    var result = input_str.split(/[ ,;\/\\]/);
    result = result.map(Number).filter(Number); // convert all elements to numbers and remove empty elements
    return result
};

/**
 * Controller that calls data processing and display functions
 *
 * @param {string} input_str - String as entered by user (we need a list of numbers separated by comma or space)
 * @param {string} input_res_str - String containing result to the equation that we will be trying to find
 * @param {string} elem_id - Selector of an element that will be used to display the results
 */
function processAndDisplay(input_str, input_res_str, elem_id) {
    var numbers = strToNumArray(input_str);
    var target_res = Number(input_res_str);
    if (numbers.length == 0 || isNaN(target_res)) {
        alert("Please enter BOTH: a comma separated list of numbers AND result of the equation you are trying to find!");
        return;
    }
    var operations = ['+', '-', '*', '/'];
    var results = findEquation(numbers, operations, target_res);
    displayResult(results, "#results");
};

/**
 * Initialise and bind events
 *
 * @param jQuery
 */
function readyFn(jQuery) {
    $("#numbers_form").submit( function(event) {
        processAndDisplay($("#numbers_text").val(), $("#result_text").val());
        event.preventDefault();
    });
};

$(window).load(readyFn);
