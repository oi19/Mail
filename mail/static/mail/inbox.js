document.addEventListener('DOMContentLoaded', function () {



  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent', reply = 'yes'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());
  // document.querySelector('#inbox-archive').addEventListener('click', () => compose_email());
  document.querySelector('#compose-button').addEventListener('click', () => compose('/emails', data = {
    recipients: document.querySelector('#compose-recipients').value,
    subject: document.querySelector('#compose-subject').value,
    body: document.querySelector('#compose-body').value,
    read: true
  }))


  // document.querySelector('#reply').addEventListener('click', () => compose_email(reply(document.querySelector('.button-container').id)));
  // document.querySelector('#reply').addEventListener('click', () => compose_email(
  //   recipients = document.querySelector('#sender').value,
  //   subject = document.querySelector('#subject').value,
  //   body = document.querySelector('#body').value));

  messageClick()

  // By default, load the inbox
  load_mailbox('inbox');


});



function compose_email(data = { recipients: '', subject: '', body: '', reply: 'no' }) {
  // console.log(data)

  // Show compose view and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // assigning message_parts_container
  const recipient_container = document.querySelector('#compose-recipients')
  const subject_container = document.querySelector('#compose-subject')
  const body_container = document.querySelector('#compose-body')
  // Clear out composition fields
  recipient_container.value = data.recipients;
  subject_container.value = data.subject;
  body_container.value = data.body;

  if (data.reply == 'yes') {
    // console.log('reply:yes')
    recipient_container.disabled = true,
      subject_container.disabled = true
  }
  else {
    // console.log('reply:no')
    recipient_container.disabled = false;
    subject_container.disabled = false;
  }



}

function load_mailbox(mailbox, reply = 'no') {


  // clean the mailbox every time you use it 
  document.querySelector('#emails-view').innerHTML = '';


  // Show the mailbox and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';


  // Show the mailbox name
  const mailName = document.createElement('h3');
  mailName.innerHTML = `${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}`;
  document.querySelector('#emails-view').appendChild(mailName);

  const rButton = document.querySelector('#reply')
  reply === 'yes'
    ? rButton.style.display = 'none'
    : rButton.style.display = 'inline-block'

  // document.querySelector('#emails-view').appendChild(getEmails(mailbox));



  // emails GET request
  getEmails(mailbox)

}






// a function that create a container of the message 
const messageContainer = (email) => {

  // creating container with a given id and classname
  const container = document.createElement('div')
  container.className = 'mContainer'
  container.id = `c${email.id}`

  // content which is title of the email on the cover(container)
  const content = document.createElement('div')
  content.id = `${email.id}`

  email.read == true
    ? content.classList.add('om2')
    : content.className = "om";
  // console.log(email.timestamp)
  content.innerHTML = `From:&#160 ${email.sender} &#160&#160&#160 /    Subject: ${email.subject}&#160&#160&#160 / Time:&#160 ${email.timestamp}`

  // the delete button
  const d = document.createElement('button');
  d.className = 'del-button'
  d.innerText = 'Delete'

  // appendchild to container 
  container.appendChild(content);
  container.appendChild(d);
  // return container;


  // appendchild the container to the emails-view div 
  document.querySelector('#emails-view').appendChild(container)
  return;

}



// a function that tracks any click event and act differently based on the clicked element
const messageClick = () => {

  // adding event listenter 
  document.addEventListener('click', (event) => {
    const element = event.target
    const id = parseInt(element.id)
    // handling clicking an email
    element.className === 'om' || element.className == 'om2' ? getEmail(id) : null;
    // handling clicking delete button
    element.className == 'del-button'
      ? delContainer(element.parentElement)
      : null
    // element.id == 'compose-button'
    //   ? () => compose('/emails', data = {
    //     recipients: document.querySelector('#compose-recipients').value,
    //     subject: document.querySelector('#compose-subject').value,
    //     body: document.querySelector('#compose-body').value,
    //     read: true
    //   })
    //   : null

  })

}



// function which fetches email and render it in the email template (div)
const getEmail = (id) => {
  console.log('25')

  // handling other div to be hidden
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  // fetching email using passed id argument 
  const email = fetch(`emails/${id}`)
    .then(respond => respond.json())
    .then(result = (data) => {
      const email = eval(data);
      // rendering the email template with fetched data
      console.log(email)
      document.querySelector('#sender').value = `${email.sender}`
      document.querySelector('#recipients').value = `${email.recipients[0]}`
      document.querySelector('#subject').value = `${email.subject}`
      document.querySelector('#body').value = `${email.body}`
      document.querySelector('#body').readOnly = 'true'
      //
      console.log(email.archived)
      // document.querySelector('.button-container').dataSet = `${id}`


      const button = document.querySelector('#inbox-archive');
      button.onclick = () => {
        inbox_archive_button(id);
        // console.log()
      }
      // button.addEventListener('click', () => { functionHnadler(inbox_archive_button(id), load_mailbox('inbox')) })
      email.archived == false
        ? button.value = 'Archive'
        : button.value = 'Unarchive'

      console.log(email.archived)


      Put_requests(id, data = { read: true });
      const reply_button = document.querySelector('#reply')
      // reply_button.id = `r${email.id}`
      // console.log(reply_button.id)
      // const dataSet = parseInt(reply_button.id.split('r')[1])


      reply_button.onclick = () => {
        console.log('here')
        const time = email.timestamp
        const subject = `re-${email.subject}`
        const body = `On ${time} ${email.sender} wrote: ${email.body}`

        compose_email(data = { recipients: email.sender, subject: subject, body: body, reply: 'yes' })
      }

      // button.value == ''

    })


}





// function same as getEmail 
const getEmails = (type) => {
  fetch(`emails/${type}`)
    .then(respond => respond.json())
    .then(data => {
      console.log(data)
      console.log(data.length)
      data.forEach(email => {
        // creating message container for each email
        // messageContainer(email.sender, email.id, email.read)
        messageContainer(email)

      });
    })
}





// postData function to compose emails
const compose = async (url = '', data = {}) => {
  console.log('up here')

  // const recipient = document.querySelector('#compose-recipients').value;
  // const subject = document.querySelector('#compose-subject').value;
  // const body = document.querySelector('#compose-body').value;
  await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  console.log('hi')
  load_mailbox('sent', 'yes');
  // document.querySelector('#sent').click();
  console.log('after')
}



const delContainer = (element) => {
  element.style.animationPlayState = 'running'
  console.log(element)
  setTimeout(() => { element.style.display = 'none' }, 470)
  const id = element.id.split('c')[1]
  console.log(id)
  fetch(`delete/${id}`)
  // element.style.display = 'none'
  // element.child.animationPlayState = 'running'
  // element.hide()


}


const inbox_archive_button = async (id) => {

  // Show the mailbox and hide other views
  console.log(id)

  const button = document.querySelector('#inbox-archive')
  const buttonContent = button.value
  var status = ''
  console.log(button)
  buttonContent == 'Archive'
    ? status = true
    // button.innerHTML = 'Unarchive'

    : status = false;
  // button.innerHTML = 'Archive'


  // console.log(buttonContent)
  // console.log(status)
  // await Put_requests(id, data = { 'archived': status })
  await fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data = { 'archived': status })
  })
  load_mailbox('inbox')

  // setTimeout(load_mailbox('inbox'), 5000)
}


const Put_requests = (id, data = {}) => {
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// const reply = (d) => {

//   // const id = parseInt(d.split('r')[1])
//   console.log(d)
//   fetch(`emails/${d}`)
//     .then(respond => respond.json())
//     .then((data) => {
//       const time = data.timestamp
//       const subject = `re-${data.subject}`
//       const body = `On ${time} ${data.sender} wrote: ${data.body}`

//       compose_email(data = { recipients: data.sender, subject: subject, body: body })

//     })


// }

const functionHnadler = async (firstFunction, secondFunction) => {
  const done = await firstFunction;
  secondFunction



}