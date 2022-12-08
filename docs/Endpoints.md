# Endpoints
## Backend
## /app/
Responds "Endpoint Reached"

Response body
curl http://localhost:5000/app/
Endpoint Reached

## Nonexistent endpoint
Responds "404 NOT FOUND"

Response body
404 NOT FOUND


## Frontend
## Open index.html
Gives user two options, to create an account/sign in, or to continue as a guest

## Continue as Guest
Prompts user to enter their lattitude and longitude points of where they are located. Once entered, the user can click submit. Once submit button is pressed, the website will direct to a new page which tells the user what they should wear given the weather in their area.

## Create an Account / Log in
Prompts user for their email address and password. If this is a unrecognized email, this will create their account. If the email address already exists in the database and matches the password, the user will not have to input their lattitude and longitude points because it will already exist in the database. If the account is being created, it'll bring the user to the page where there is a form to input the user's lattitude and longitude points. Once submit button is pressed, the website will direct to a new page which tells the user what they should wear given the weather in their area.

## Going Home
If you want to try another location, you just navigate to the "Home" button in the top left corner to get back to the original page.
