const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // MySQL Student model
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sessionStore = new session.MemoryStore;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Express session
router.use(cookieParser('secret'));
router.use(session({
    cookie: { maxAge: 3000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
// Connect flash
router.use(flash());
// Global variables
router.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

// Get all students -> PRIVATE
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const students = await Student.findAll();
        res.render("../views/students/index", { students: students });
        req.flash('success_msg', 'You`re already Logged in !');
    } catch (err) {
        console.log("Error : ", err);
    }
});

// Get single student by id -> PRIVATE
router.get('/show/:id', ensureAuthenticated, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            req.flash('error_msg', 'Student not found');
            return res.redirect('/students');
        }
        res.render("../views/students/show", { student: student });
    } catch (err) {
        console.log("Error : ", err);
    }
});

// Create a student -> PRIVATE
router.get("/create", ensureAuthenticated, (req, res) => {
    res.render('students/create');
});

// Save student
router.post("/save", ensureAuthenticated, async (req, res) => {
    try {
        const student = await Student.findOne({ where: { name: req.body.name } }); // Check for existing student
        if (student) {
            req.flash('error_msg', 'Name already exists');
            return res.status(400).redirect('/students/create');
        } else {
            const newStudent = {
                name: req.body.name,
                address: req.body.address,
                batch: req.body.batch,
                work_Experience: req.body.work_Experience
            };
            const createdStudent = await Student.create(newStudent);
            req.flash('success_msg', 'Student added!');
            res.redirect('/students/show/' + createdStudent.id);
        }
    } catch (err) {
        console.log(err);
    }
});

// Edit student -> PRIVATE
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        res.render("../views/students/edit", { student: student });
    } catch (err) {
        console.log("Error : ", err);
    }
});

// Update a student
router.post('/update/:id', async (req, res) => {
    try {
        await Student.update({
            name: req.body.name,
            address: req.body.address,
            batch: req.body.batch,
            work_Experience: req.body.work_Experience
        }, {
            where: { id: req.params.id }
        });
        req.flash('success_msg', 'Student Detail Updated!');
        res.redirect('/students/show/' + req.params.id);
    } catch (err) {
        console.log("Error : ", err);
        res.render("../views/students/edit", { student: req.body });
    }
});

// Delete student
router.post('/delete/:id', async (req, res) => {
    try {
        await Student.destroy({
            where: { id: req.params.id }
        });
        req.flash('success_msg', "Deleted");
        console.log("Student deleted!");
        res.redirect("/students");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
