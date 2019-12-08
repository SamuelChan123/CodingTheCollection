# Overall Architecture Design
Frontend: React, Javascript, and Material UI
Backend: No backend, just firebase
Datastore: Firebase (real time database) and firebase storage (Web, JS)
Deployment: via firebase deployment

# Database Schema

- The database itself is a NoSQL database, with the entire data store is separated out into four “tables”: 
- Artworks
  - An object composed of unique Ids, each of which contains:
    - All strings: artist, imageLine, dimensions, description, materials, name, objectNumber, year
    - A unique Id, a string
    - An image id, a string (that references the image bucket in firebase storage)
    - A list of contextual medias, an object that contains contextual media unique ids that can reference an object in contextual media
- Contextualmedia
  - An object composed of unique Ids, each of which contains:
    - All strings: description, name, unique id
    - An image id, a string (that references the image bucket in firebase storage)
- Projects
  - An object composed of unique Ids, each of which contains:
    - A list of artworks (which contain unique Artwork ids, which can be found in the artworks object)
    - a list of collaborators (which contain user emails, which can be found in the users object)
    - The same unique id for the project
    - The name of the project, a string
    - The owner, a unique Id found in the users object
- Users
  - An Object composed of unique ids, each of which contains:
    - Email: a string
    - Username: a string
    - Projects object that contains a list of project Ids, each of which can be found in the projects object

# Database Storage Schema (Images)
- Artworks/ (for artwork images)
- Contextualmedia/ (for contextual media images)
- projects/ (for project cover photos)
- samples/ (for testing)
