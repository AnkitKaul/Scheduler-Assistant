// check matching password
const user_password = $('#password')[0];
const confPw = $('#confPassword')[0];
user_password.onchange = () => checkPw();
confPw.onchange = () => checkPw();

function checkPw() {
  const pwValue = user_password.value;
  const confPwValue = confPw.value;
  if (pwValue !== confPwValue) {
    confPw.setCustomValidity('Password is Incorrect');
  } else {
    confPw.setCustomValidity('');
  }
}

