const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const Student = require('./models/modelStudent')
// const Staff = require('./models/modelStaff')
// const Teacher = require('./models/modelTeacher')
// const pnut = require('./models/modelAcademicStaff')
const User = require('./models/user')
const Staff = require('./models/modelStaff')
const Student = require('./models/modelStudent')
const Teacher = require('./models/modelTeacher')
const Building = require('./models/modelBuildding')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test123@ds117816.mlab.com:17816/ooad');

//ID: legendnoz002
//PASSWORD: legendnoz007 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('login')
})
// app.get('/login', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

app.post('/login', function (req, res) {
  let username = req.body.username
  let password = req.body.password

  User.findOne({ username: username, password: password }, function (err, user) { // แก้
    if (err) {
      console.log(err)
      return res.status(500).send()
    }
    if (!user) {
      console.log('username or password not match')
      return res.status(404).send()
    }
    return res.redirect('/main1')
  })
})

app.get('/main1', function (req, res) {
  res.render('เมนูอาจารย์')
})

app.get('/b', function (req, res) {
  Building.find({}, function (err, building) {
    if (err) {
      console.log(err)
    }
    else {
      res.render('ตึก', { building: building })//render collection "users"
    }
  })
})

app.get('/b/addBuilding', function (req, res) {
  res.render('addBuilding')
})

app.post('/b/post', function (req, res) {
  const build = new Building(req.body)
  console.log(build)
  build.save()
    .then(build => {
      res.redirect('/b')
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
})

///////////////////////////////////////////////////////////////////////////  
app.get('/f', function (req, res) {
  Student.find({ uType: "student" }, function (err, person) {
    if (err) {
      console.log(err)
    }
    else {
      res.render('จัดการนิสิต', { person: person })//render collection "users"
    }
  })
})

app.get('/f/addStudent', function (req, res) {
  res.render('addStudent')
})

app.get('/f/addStaff', function (req, res) {
  res.render('addStaff')
})

app.get('/f/addTeacher', function (req, res) {
  res.render('addTeacher')
})

app.post('/f/post', function (req, res) {
  const student = new Student(req.body)
  student.uType = "student"
  console.log(student)
  student.save()
    .then(student => {
      res.redirect('/f')
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
})

///////////////////////////////////////////////////////////////////////////////

app.get('/g', function (req, res) {
  Staff.find({ uType: "staff" }, function (err, person) {
    if (err) {
      console.log(err)
    }
    else {
      res.render('จัดการเจ้าหน้าที่', { person: person })//render collection "person"
    }
  })
})

//////////////////////////////////////////////////////////////////////////////

app.get('/c', function (req, res) {
  Teacher.find({ uType: "teacher" }, function (err, person) {
    if (err) {
      console.log(err)
    }
    else {
      res.render('จัดการอาจารย์', { person: person })//render collection "users"
    }
  })
})


///////////////////////////////////////////////////////////////////////////////








app.get('/f/edit/:id', function (req, res) { //EDIT FOLLOWED BY UPDATE
  const id = req.params.id;
  Student.findById(id, function (err, person) {
    res.render('edit', { person: person })
  })
})

app.get('/b/editBuilding/:id', function (req, res) { //EDIT FOLLOWED BY UPDATE ตึก
  const id = req.params.id;
  Building.findById(id, function (err, building) {
    res.render('editBuilding', { building: building })
  })
})

app.post('/f/update/:id', function (req, res) { //UPDATE 
  Student.findById(req.params.id, function (err, person) {
    if (!person)
      return next(new Error('Could not load Document'))
    else {
      // do your updates here
      person.username = req.body.username
      person.password = req.body.password
      person.prefixName = req.body.prefixName
      person.firstName = req.body.firstName
      person.lastName = req.body.lastName
      person.faculty = req.body.faculty
      person.major = req.body.major
      person.year = req.body.year
      person.branch = req.body.branch
      person.sector = req.body.sector

      person.save().then(person => {
        res.redirect('/f')
      })
        .catch(err => {
          res.status(400).send("unable to update the database")
        })
    }
  })
})

app.post('/b/updateBuilding/:id', function (req, res) { //UPDATE ตึก
  Building.findById(req.params.id, function (err, building) {
    if (!building)
      return next(new Error('Could not load Document'))
    else {
      // do your updates here
      building.buildingName = req.body.buildingName
      building.floor = req.body.floor

      building.save().then(building => {
        res.redirect('/b')
      })
        .catch(err => {
          res.status(400).send("unable to update the database")
        })
    }
  })
})

app.get('/f/delete/:id', function (req, res) {
  Student.findByIdAndRemove({ _id: req.params.id },
    function (err, person) {
      if (!person) res.json(person)
      else res.redirect('/f')
    })
})

app.get('/b/delete/:id', function (req, res) { //ตึก
  Building.findByIdAndRemove({ _id: req.params.id },
    function (err, building) {
      if (!building) res.json(building)
      else res.redirect('/b')
    })
})

app.listen(port, function () {
  console.log('Node js Express js Tutorial at port', port)
})