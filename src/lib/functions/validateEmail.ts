import zeroBounce from '../zeroBounce.js'
async function validateEmail(email:string){
     const emailValid= await zeroBounce.validateEmail(email);
     if(emailValid.status==="valid")
          return true;
}
export default validateEmail;