var userStr = localStorage.getItem("users");
var user = JSON.parse(userStr);


const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const etpassword = document.getElementById('etpassword');
form.addEventListener('submit', e => {
	e.preventDefault();
  var result = checkInputs();
  if(result){
    getDataInput();
  }
});

async function getDataInput(){
  var data = {
    id: Date.now(),
    email: email.value,
    password: password.value,
    etpassword:  etpassword.value,
    
    role: {
      amdin: false,
      member: true
    }
  }
  
  fetch(`http://localhost:3000/users?email=${data.email}`, {
    method: "GET"
  }).then(r => r.json()).then(exist => {
    if (exist.length != 0) {
      setErrorFor(email,'Email exists');
      return;
    }else{
      fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => response.json())
      .then((responseJson) => console.log(responseJson))

      window.location.pathname = '../'
    }
  })

  
}



function checkInputs(){
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const etpasswordValue = etpassword.value.trim();

  if(emailValue === ''){
    setErrorFor(email,'Email cannot be blank');
    return false
  } else if(!isEmail(emailValue)){
    setErrorFor(email,'Incorrect email format');
    return false
  }else{
    setSuccessFor(email);
  }

  if(passwordValue === ''){
    setErrorFor(password,'Password cannot be blank');
    return false
  } else if(passwordValue.length <= 6){
    setErrorFor(password,'Password must be greater than 6');
    return false
  } else{
    setSuccessFor(password);
  }

  if(etpasswordValue === ''){
    setErrorFor(etpassword,'Enter the password cannot be blank');
    return false
  }else if(etpasswordValue.length <= 6){
    setErrorFor(etpassword,'Password must be greater than 6');
    return false
  }else if(passwordValue != etpasswordValue){
    setErrorFor(etpassword,'Enter the password is not the same as password');
    return false
  }  else{
    setSuccessFor(etpassword);
  }

  return true;
    
}

function  setSuccessFor(input){
  const formGroup = input.parentElement;
  formGroup.className = 'form-group form_group success';
}

function  setErrorFor(input, message){
  const formGroup = input.parentElement;
  const small = formGroup.querySelector('small');
  formGroup.className = 'form-group form_group error';
  small.innerText = message;
}

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}
