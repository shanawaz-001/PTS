const router = require("express").Router();

//view Employee-----------
router.get('/emp', require('../routes/readRoutes').empActive);
router.get('/emp/inactive', require('../routes/readRoutes').empInactive);
//add Employee------------
router.post('/emp/add', require('../controller/hr/add.emp.controller'));
//update Employee-----------
router.post('/emp/update', require('../controller/hr/update.emp.controller'));
//delete Employe------------
router.post('/emp/remove', require('../controller/hr/remove.emp.controller'));
//active Employee--------
router.post('/emp/active', require('../controller/hr/active.emp.controller'));
//View Projects----------
router.get('/projects',require('../routes/readRoutes').projects);
//
router.get('/chart/emp',require('../routes/chartRoutes').emp);
router.get('/chart/emp/status',require('../routes/chartRoutes').empStatus);
router.get('/chart/projects',require('../routes/chartRoutes').projects);
router.get('/chart/tasks/priority',require('../routes/chartRoutes').taskPriority);
router.get('/chart/tasks/status',require('../routes/chartRoutes').taskStatus);
router.get('/chart/tasks/percent/:id',require('../routes/chartRoutes').taskPercent);
router.get('/chart/projects/percent',require('../routes/chartRoutes').projectPercent);
module.exports = router;