# Mail ![Django](https://github.com/ESWZY/cs50web-final-project/workflows/Django%20CI/badge.svg)

  A Mobile Responsive website powered by [Django](https://www.djangoproject.com/) using [Python](https://www.python.org/) , in which user can compose mails , send , delete , edit ,like , archive , unarchive and reply  as well as search for any mail or user .


# Project Structure


## HTML Files
      
 - inbox.html
   - this page dispalys all mails as inbox , including navigating to send mails , archived as well as displaying whether the mail is read or not )
    
 - login.html
   - user has to login in order to participate in  any class 
 
 - Register.html
   - a page in which a user with no previous interaction with this site has to register to be able to use this website
  

## JS Files
 -  main.js (include all the functions to handle and manipulate the DOM, using json and Ajax)



# Backend


## Python Files
 - models.py(includes 4 models (user,classes,membership,user_class)
   - it includes 4 models
      - User model (saves user logging data )
      - Email model(handles all the data including sender, reciever,body,date,read or not and archived ones )
      
 - views.py (include different functions such as class_capacity , user,membershipinfo ,join,add)
     - it includes functions
         - compose 
         - mailbox
         - email
         - delete
 - urls.py (include routes(add,user,membershipinfo) as well as API routes(join, class_capacity)
   - routes(Paths):-
      - /
      - /register
      - /logout
      - /login
     
   - API routes:-
       - /emails
      - /delete



# Setup
   ```shell script
git clone https://github.com/Mail/oi19.git
cd Mail
```
Run the following command to run your server.


```shell script
python manage.py runserver
```

Run those following commands to migrate database.

```shell script
python manage.py makemigrations
python manage.py migrate
```
