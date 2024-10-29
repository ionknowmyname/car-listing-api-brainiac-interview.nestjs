
# **CAR LISTING API - TYPESCRIPT - NESTJS - MONGODB DATABASE**

---
## PROJECT IMPLEMENTATION SUMMARY

Project can create a user which can be seller or buyer. Seller can create car listings, the rest of the functionalities follow the interview prompt.


---
## SETUP

### 1. LOCAL
- Install npm with command below:
```
npm i
```

- Run `npm run start` in terminal. Service starts on port 3000

### NOTE:

- For Cloudinary, use your details. I added .env.example for you to follow

---
## BUILD PROCESS

- Created user because it was necessary for the car listing
- Ignored authentication because not needed. If it was, use logged in user to create car listing instead of sellerId

---

## EXTRAS

- I didn't deploy live to render because it was pointless, local DB would render that deployment redundant, and I didn't want to use my Mongo Atlas cluster
- I would have added postman collection but the endpoints are straightforward, using the question prompt as guide