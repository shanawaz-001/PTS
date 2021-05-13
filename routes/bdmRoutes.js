const router = require("express").Router();
//View Employee
router.get('/emp', require('../routes/readRoutes').empDev);
//View Projects
router.get('/project', require('../routes/readRoutes').projects);
// //View Tasks
// router.get('/project/tasks/:projectRef',require('../routes/readRoutes'));
// //View Teams
// router.get('/project/teams/:projectRef',require('../routes/readRoutes'));
//Add project
router.post('/project/add', require('../controller/bdm/add.project.controller'));
//Update Project
router.post('/project/update', require('../controller/bdm/update.project.controller'));
// //Delete Project
router.post('/project/remove', require('../controller/bdm/remove.project.controller'));
// //Set Project Manager
// router.post('/bdm/project/add', verify.BDM, require('../controller/bdm/add.project.controller'))
//Track Project Tasks


module.exports = router;


