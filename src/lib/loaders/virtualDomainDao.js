'use strict';
var driverStore = require('../stores/corbelDriver.store');
var utils = require('../utils');
var COLLECTION = 'composr:VirtualDomain';

var VirtualDomainDao = {};

VirtualDomainDao.load = function (id) {
  if (!id) {
    return Promise.reject('missing:id');
  }

  if (driverStore.getDriver()) {
    return driverStore.getDriver().resources.resource(COLLECTION, id)
      .get()
      .then(function (response) {
        return response.data;
      });
  } else {
    return Promise.reject('missing:driver');
  }
};

/*VirtualDomainDao.loadAll = function () {
  var caller = function (pageNumber, pageSize) {
    return driverStore.getDriver().resources.collection(COLLECTION).get({
      pagination: {
        page: pageNumber,
        pageSize: pageSize
      }
    });
  };

  return utils.getAllRecursively(caller);
};*/

VirtualDomainDao.loadAll = function(){
  return Promise.resolve([{
    id : 'booqs:nubico:demo!phrasesProject',
    phrases : ['booqs:nubico:demo!v0!user!email','booqs:nubico:demo!v0!user!email'],
    snippets : ['booqs:nubico:demo!config']
  }]);
};

module.exports = VirtualDomainDao;