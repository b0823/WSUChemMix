# WSUChemMix
Application experimental design and response surface methodology.
Written in Node.JS.
Database is a very simple MonogoDB

#Must have a mongo running
http://stackoverflow.com/questions/5596521/what-is-the-correct-way-to-start-a-mongod-service-on-linux-os-x
http://stackoverflow.com/questions/2438055/how-to-run-mongodb-as-windows-service/7895724#7895724

#To add an admin account.
Open mongo connection 'mongo' in OS X, cd to installed mongo's bin folder and type mongo.
Type 'use chem' to switch to the used schema.
Type 'db.users.insert({username:"ADMINUSERNAME", "password":"ADMINPASSWORD", isAdmin:true})'
Obviously change the username and password above to desired.

#Install Packages:
npm install
#Start Server:
npm start
