var mongoose = require('mongoose');
var donorSchema = require('../models/donors')
var donor  = mongoose.model('donors', donorSchema);

exports.allDonor = function(req, res) {
    donor.find(function(err, result) {
    if(err) res.send(500, err.message);

    console.log('GET /donor')
        res.status(200).jsonp(result);
    });
};

exports.findDonor = function(req, res) {
    donor.findById(req.params.id, function(err, result) {
    if(err) return res.send(500, err.message);

    console.log('GET /result/' + req.params.id);
        res.status(200).jsonp(result);
    });
};

exports.findDonorByIP = function(req, res) {
    donor.findOne({
        'ip' : req.params.ipaddress
    }, 
    function(err, result) {
        if(err) return res.send(500, err.message);
        console.log('GET /result/ipaddress: ' + req.params.ipaddress);
        res.status(200).jsonp(result);
    });
};

exports.addDonor = function(req, res) {
    var socket = require('../../server')._socket;

    console.log('POST');
    console.log(req.body);

    var _donor = new donor({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        number: req.body.number,
        email: req.body.email,
        address: req.body.address,
        group: req.body.group,
        ip: req.body.ip,
        lat: req.body.lat.toString(),
        lng: req.body.lng.toString()
    });

    _donor.save(function(err, result) {
        if(err) return res.send(500, err.message);
        socket.emit('messages', {"donor": req.body, "action": "save" });
        res.status(200).jsonp(result);
    });
};

exports.updateDonor = function(req, res) {
    var socket = require('../../server')._socket;

    donor.findById(req.params.id, function(err, _donor) {
        _donor.firstname = req.body.firstname,
        _donor.lastname = req.body.lastname,
        _donor.number = req.body.number,
        _donor.email = req.body.email,
        _donor.address = req.body.address,
        _donor.group = req.body.group,
        _donor.ip = req.body.ip,
        _donor.lat = req.body.lat.toString(),
        _donor.lng = req.body.lng.toString()

        _donor.save(function(err) {
            if(err) return res.send(500, err.message);
            socket.emit('messages', {"donor": req.body, "action": "edit" });
            res.status(200).jsonp(_donor);
        });
    });
};

exports.deleteDonor = function(req, res) {
    var socket = require('../../server')._socket;

    donor.findById(req.params.id, function(err, _donor) {
        _donor.remove(function(err) {
            if(err) return res.send(500, err.message);
            socket.emit('messages', {"donor": _donor, "action": "delete" });
            res.status(200).jsonp(_donor);
        })
    });
};