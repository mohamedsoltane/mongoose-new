// import required modules

console.log(process.env.DB_CONNECTION_URI);
const express=require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
console.log(process.env.DB_CONNECTION_URI);


// create Express app

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());


// connect to the database

mongoose.connect(process.env.DB_CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to the database');
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})
.catch((err) => {
  console.error('Error connecting to the database', err);
});


// create a Person schema

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String] }
});


// create a Person model

const Person = mongoose.model('Person', personSchema, 'contactlist');


// step 1: Create and Save a Record of a Model

const createAndSavePerson = (name, age, favoriteFoods, callback) => {
  const newPerson = new Person({
    name: name,
    age: age,
    favoriteFoods: favoriteFoods
  });

  newPerson.save((err, data) => {
    if (err) return callback(err);
    callback(null, data);
  });
};


// step 2: Create Many Records with model.create()

const createManyPeople = (arrayOfPeople, callback) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return callback(err);
    callback(null, data);
  });
};


// step 3: Use model.find() to Search Your Database

const findPeopleByName = (name, callback) => {
  Person.find({ name: name }, (err, data) => {
    if (err) return callback(err);
    callback(null, data);
  });
};


// step 4: Use model.findOne() to Return a Single Matching Document from Your Database

const findOnePersonByFood = (food, callback) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return callback(err);
    callback(null, data);
  });
};


// step 5: Use model.findById() to Search Your Database By _id

const findPersonById = (personId, callback) => {
  Person.findById(personId, (err, data) => {
    if (err) return callback(err);
    callback(null, data);
  });
};


// step 6: Perform Classic Updates by Running Find, Edit, then Save

const findEditThenSave = (personId, foodToAdd, callback) => {
  Person.findById(personId, (err, person) => {
    if (err) return callback(err);
    
    person.favoriteFoods.push(foodToAdd);

    person.save((err, updatedPerson) => {
      if (err) return callback(err);
      callback(null, updatedPerson);
    });
  });
};


// step 7: Perform New Updates on a Document Using model.findOneAndUpdate()

const findAndUpdate = (personName, newAge, callback) => {
  Person.findOneAndUpdate(
    { name: personName },
    { age: newAge },
    { new: true },
    (err, updatedPerson) => {
      if (err) return callback(err);
      callback(null, updatedPerson);
    }
  );
};


// step 8: Delete One Document Using model.findByIdAndRemove

const removeById = (personId, callback) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return callback(err);
    callback(null, removedPerson);
  });
};


// step 9: MongoDB and Mongoose - Delete Many Documents with model.remove()

const removeManyPeople = (nameToRemove, callback) => {
  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


// step 10: Chain Search Query Helpers to Narrow Search Results

const queryChain = (foodToSearch, callback) => {
  Person.find({ favoriteFoods: foodToSearch })
    .sort('name')
    .limit(2)
    .select('-age')
    .exec((err, data) => {
      if (err) return callback(err);
      callback(null, data);
    });
};


// export all the functions

module.exports = {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOnePersonByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain
};