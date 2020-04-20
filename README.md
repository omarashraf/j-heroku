# jawareb-backend

- Jawareb app is an admin app for managing the day-to-day process of the Jawareb company for selling socks. It is for admin use only.

- To run the back-end service, clone the repository and first run:

```
npm i
```

- Then run:

```
npm start

or

node index.js
```

- Envirnment Variables that need to be set:
    - DATABASE_URL &rarr; the connection db url (if host in cloud)
    - USER &rarr; the username to access such db
    - PASSWORD &rarr; the password to access such db
    - PORT &rarr; the port on which the server runs (default is 3001)
    - PRIVATE_KEY &rarr; the private key for encrypting the user passwords (could basically be anything)