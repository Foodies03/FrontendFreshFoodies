# LookingGlass

While working on the continuation of LookingGlass, we were asked to add food waste reports, incorporate facts related to food waste, and add more customization for privacy settings/notifications. Our focus was on encouraging the reduction of food waste by encouraging both a collaborative effort, between roommates, as well as an individual effort through personal analytics. What we have contributed is the analytics feature that provides individuals with specific quantitative data regarding their food waste habits.


In order to continue enforcing food waste reduction, we believe that implementing educational resources and other features that will help the user improve their food waste reduction habits will elevate the project. Another way to improve the platform would be to add more customization to encourage user engagement.

# LookingGlass Next Steps

In order to continue development of this project, two repositories will need to be forked and set up:

## Backend

[Backend Repo](https://github.com/Foodies03/FreshFoodies)


Run flask backend with
```
flask run
```

You will need to set up a new MongoDB cluster and download [MongoDB Compass](https://www.mongodb.com/products/compass). References to the MongoDB cluster link will need to be changed throughout the backend repository.

In addition, you will need to set up a new Heroku account (or your choice of deployment platform) and [deploy this Flask app to Heroku](https://realpython.com/flask-by-example-part-1-project-setup/). The ideal set up is to have changes to the main production branch automatically update the Heroku branch.


## Frontend

[Frontend Repo](https://github.com/Foodies03/FrontendFreshFoodies)

Run expo frontend with
```
npm start
```

Any references to the old backend API will need to be switched to your new API link in the .env file.

### Other Links

[Presentation Deck](https://docs.google.com/presentation/d/1uNQsNYkwTvcslU7DrDMNwNpT26kMaTYrXtptSvNJe_s/edit#slide=id.gb301727d1d_0_49)

[Final Product - WIP]()
