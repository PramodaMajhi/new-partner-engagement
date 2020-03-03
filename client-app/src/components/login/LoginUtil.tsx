const PasswordSpecialChars = ".*[!\"#$%&'()*+,-./:;<=>?@\\[\\]^_`{|}~].*";

export const resetLoginInfo = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('loggedinUser');
  localStorage.clear();
}

export function validateBothPassword(formData, errors){

    const pass1 = formData.password;
    const pass2 = formData.passwordConfirmed;
  
    let specPass = false;
    let digitPass = false;
    let charUpperPass = false;
    let charLowerPass = false;
    let charNotAllowed = false;
    let lenPass = false;
  
  
    if (pass1 !== pass2) {
      errors.addError("The two passwords don't match");
    }
  
    /* check for numeric */
    if (pass1.match(".*[0-9].*") && pass2.match(".*[0-9].*")) {
      digitPass = true;
    }else{
      errors.addError("Password does not contain numeric");
    }
  
    /* check for special character */
    if (pass1.match(PasswordSpecialChars) && pass2.match(PasswordSpecialChars)) {
      specPass = true;
    }else{
      errors.addError("Password does not contain special character");
    }
  
    /* check for CAPS */
    if (pass1.match(".*[A-Z].*") && pass2.match(".*[A-Z].*")) {
      charUpperPass = true;
    }else{
      errors.addError("Password does not contain uppercase character");
    }
  
    /* check for LOWER */
    if (pass1.match(".*[a-z].*") && pass2.match(".*[a-z].*")) {
      charLowerPass = true;
    }else{
      errors.addError("Password does not contain lower character");
    }
  
    /* SRV-7173: Update password minimum length policy */
    if ((pass1.length >= 8) && (pass1.length <= 20) && 
      (pass2.length >= 8) && (pass2.length <= 20)) {
      lenPass = true;
    }else{
      errors.addError("Password does not meet a minimum length of 8 and less than 20");
    }
  
  
    if (hasInvalidPWChars(pass1) || hasInvalidPWChars(pass2)) {
      charNotAllowed = true;
      errors.addError("Password has invalid characters");
    }
  
    /*
    * any three of special, numeric, caps and lower should exist to pass
    * Password validation
    */
    if ((digitPass && specPass && charUpperPass && lenPass)
                    || (digitPass && specPass && charLowerPass && lenPass)
                    || (specPass && charUpperPass && charLowerPass && lenPass)
                    || (digitPass && charLowerPass && charUpperPass && lenPass)) {
            if (charNotAllowed) {
                    return errors;
            } else {
                    return false;
            }
    }
  
  
  
    return errors;
}

export function validatePassword(formData, errors){

    const pass1 = formData.password;
  
    let specPass = false;
    let digitPass = false;
    let charUpperPass = false;
    let charLowerPass = false;
    let charNotAllowed = false;
    let lenPass = false;
  
    /* check for numeric */
    if (pass1.match(".*[0-9].*")) {
      digitPass = true;
    }else{
      errors.addError("Password does not contain numeric");
    }
  
    /* check for special character */
    if (pass1.match(PasswordSpecialChars)) {
      specPass = true;
    }else{
      errors.addError("Password does not contain special character");
    }
  
    /* check for CAPS */
    if (pass1.match(".*[A-Z].*")) {
      charUpperPass = true;
    }else{
      errors.addError("Password does not contain uppercase character");
    }
  
    /* check for LOWER */
    if (pass1.match(".*[a-z].*")) {
      charLowerPass = true;
    }else{
      errors.addError("Password does not contain lower character");
    }
  
    /* SRV-7173: Update password minimum length policy */
    if ((pass1.length >= 8) && (pass1.length <= 20)) {
      lenPass = true;
    }else{
      errors.addError("Password does not meet minimum of 8 and less than 20 characters");
    }
  
  
    if (hasInvalidPWChars(pass1)) {
      charNotAllowed = true;
      errors.addError("Password have invalid characters");
    }
  
    /*
    * any three of special, numeric, caps and lower should exist to pass
    * Password validation
    */
    if ((digitPass && specPass && charUpperPass && lenPass)
                    || (digitPass && specPass && charLowerPass && lenPass)
                    || (specPass && charUpperPass && charLowerPass && lenPass)
                    || (digitPass && charLowerPass && charUpperPass && lenPass)) {
            if (charNotAllowed) {
                    return errors;
            } else {
                    return false;
            }
    }
  
  
  
    return errors;
}
  
function hasInvalidPWChars(password){
    let i;
    let len;
    let ascii;
    for (i = 0, len=password.length; i<len; i++) {
        ascii = password.charCodeAt(i);
        if ((ascii >= 0 && ascii <= 32) || ascii > 127){
            return true;
        }
    }

    return false;
}