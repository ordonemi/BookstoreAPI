const passwordComplexity = require('joi-password-complexity');
const passwordRules = {
    min: 8,
    max: 26,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
};

module.exports.passwordPass = (passwordToCheck) => {
    return passwordComplexity(passwordRules, 'Password').validate(passwordToCheck);
};