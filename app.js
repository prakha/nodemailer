const form = document.getElementById('contact-form')
const formEvent = form.addEventListener("submit",(event)=>{
  event.preventDefault()
  const name = form.getElementsByTagName('input')[0].value
  const email = form.getElementsByTagName('input')[1].value
 
  sendEmail(name,email);
})