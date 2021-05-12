const router = require("express").Router();
const verify = require('../routes/verifyToken');

//confirmation
router.get('/dev',require('../routes/readRoutes').confirmationDev);

//View assigned Projects
router.get('/dev/projects',require('../routes/readRoutes').projectsDev);
//View assigned Project Tasks
router.get('/dev/tasks',require('../routes/readRoutes').tasksDev);

//******************************************************************************************************* */
//********************************************** PM ROUTES ********************************************** */
//******************************************************************************************************* */

//View Employee
router.get('/pm/emp',verify.PM, require('../routes/readRoutes').empDev);

//View assigned Projects
router.get('/pm/projects',verify.PM, require('../routes/readRoutes').projectsPM);
//View Project Tasks
router.get('/pm/tasks/:projectRef',verify.PM, require('../routes/readRoutes').projectTasks);
//Add project Task
router.post('/pm/task/add',verify.PM, require('../controller/pm/add.task.controller'));
//Update Project Task
router.post('/pm/task/update',verify.PM, require('../controller/pm/update.task.controller'));
//Delete Project Task 
router.post('/pm/task/remove',verify.PM, require('../controller/pm/remove.task.controller'));

//Set Project Team - Employee Info 
router.post('/pm/team/add',verify.PM,require('../controller/pm/add.team.controller'));
//View Project Team
router.get('/pm/teams/:projectRef',verify.PM, require('../routes/readRoutes').projectTeams);
//update Project Team
router.post('/pm/team/update',verify.PM,require('../controller/pm/update.team.controller'));
//remove Project Team


//Update Project Tasks % of completion



//******************************************************************************************************* */
//********************************************** TL ROUTES ********************************************** */
//******************************************************************************************************* */


//get assigned projects
router.get('/tl/projects',verify.TL,require('../routes/readRoutes').projectsTL);
//get project tasks
router.get('/tl/project/tasks/:projectRef',verify.TL,require('../routes/readRoutes').projectTasks);
//get assigned team
router.get('/tl/project/team/:projectRef',verify.TL, require('../routes/readRoutes').projectTeams);
//get team members task assigned
router.get('/tl/project/team/assigned/:projectRef',verify.TL, require('../routes/readRoutes').assignedTeamMem);
//get team members task unassigned
router.get('/tl/project/team/unassigned/:projectRef',verify.TL, require('../routes/readRoutes').unassignedTeamMem);
//assign task to team member
router.post('/tl/project/team/assignTask',verify.TL,require('../controller/tl/assign.task.controller'));
//Unassign task to team member
router.post('/tl/project/team/unassignTask',verify.TL,require('../controller/tl/unassign.task.controller'));

//update % of team work completion






module.exports = router;