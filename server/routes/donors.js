var express = require('express');
var router = express.Router();
var DonorCtrl = require('../controllers/donors');

router.get('/', DonorCtrl.allDonor);
router.post('/', DonorCtrl.addDonor);
router.get('/:id', DonorCtrl.findDonor);
router.get('/ipaddress/:ipaddress', DonorCtrl.findDonorByIP);
router.put('/:id', DonorCtrl.updateDonor);
router.delete('/:id', DonorCtrl.deleteDonor);

module.exports = router;