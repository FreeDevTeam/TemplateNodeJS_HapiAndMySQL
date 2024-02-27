/* Copyright (c) 2021-2022 Reminano */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const AppUserPermissionResourceAccess = require('../resourceAccess/AppUserPermissionResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let appUserPermissions = await AppUserPermissionResourceAccess.find(filter, skip, limit, order);
      let appUserPermissionsCount = await AppUserPermissionResourceAccess.count(filter, order);
      if (appUserPermissions && appUserPermissionsCount) {
        resolve({ data: appUserPermissions, total: appUserPermissionsCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
};
