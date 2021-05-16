const router = require("express").Router();
//View Employee
router.get('/emp', require('../routes/readRoutes').empDev);
//View Projects
router.get('/project', require('../routes/readRoutes').projects);
//View Tasks
router.post('/project/tasks/:projectRef',require('../routes/readRoutes').projectTasks);
//View Teams
router.get('/project/teams/:projectRef',require('../routes/readRoutes').projectTeams);
//Add project
router.post('/project/add', require('../controller/bdm/add.project.controller'));
//Update Project
router.post('/project/update', require('../controller/bdm/update.project.controller'));
// //Delete Project
router.post('/project/remove', require('../controller/bdm/remove.project.controller'));


//Track Project Tasks
router.get('/chart/emp',require('../routes/chartRoutes').bdmEmp);
router.get('/chart/projects',require('../routes/chartRoutes').projects);
router.get('/chart/tasks/priority',require('../routes/chartRoutes').taskPriority);
router.get('/chart/tasks/status',require('../routes/chartRoutes').taskStatus);

module.exports = router;


