/* Copyright (c) 2022-2023 Reminano */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'AppUserMissionHistoryView';
const rootTableName = 'AppUserMissionHistory';
const primaryKeyField = 'appUserMissionHistoryId';
const AppUserTable = 'AppUser';
async function createViews() {
  let fields = [
    `${rootTableName}.${primaryKeyField}`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.missionStatus`,
    `${rootTableName}.missionStartDate`,
    `${rootTableName}.missionStartDay`,
    `${rootTableName}.missionStartTime`,
    `${rootTableName}.missionCompletedDate`,
    `${rootTableName}.missionProgressTarget`,
    `${rootTableName}.missionCompleteTarget`,
    `${rootTableName}.missionBonus`,
    `${rootTableName}.referUserId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.createdAtTimestamp`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.missionIndex`,
    `${rootTableName}.missionReferBonus`,

    `${AppUserTable}.username`,
    `${AppUserTable}.memberReferIdF1`,
    `${AppUserTable}.memberReferIdF2`,
    `${AppUserTable}.memberReferIdF3`,
    `${AppUserTable}.memberReferIdF4`,
    `${AppUserTable}.memberReferIdF5`,
    `${AppUserTable}.memberReferIdF6`,
    `${AppUserTable}.memberReferIdF7`,
    `${AppUserTable}.memberReferIdF8`,
    `${AppUserTable}.memberReferIdF9`,
    `${AppUserTable}.memberReferIdF10`,
    `${AppUserTable}.staffId`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(AppUserTable, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${AppUserTable}.appUserId`);
    });
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  await createViews();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let filter = {};
  filter[`${primaryKeyField}`] = id;
  return await Common.updateById(tableName, filter, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (startDate) {
    const moment = require('moment');
    queryBuilder.where('createdAtTimestamp', '>=', moment(startDate).toDate() * 1);
  }
  if (endDate) {
    const moment = require('moment');
    queryBuilder.where('createdAtTimestamp', '<=', moment(endDate).toDate() * 1);
  }
  queryBuilder.where({ isDeleted: 0 });
  Common.filterHandler(filterData, queryBuilder);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy(`${primaryKeyField}`, 'desc');
  }
  return queryBuilder;
}

async function customSearch(filter, skip, limit, startDate, endDate, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, order);
  return await query.select();
}

async function customCount(filter, startDate, endDate) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, undefined);
  return await query.count(`${primaryKeyField} as count`);
}

async function countDistinct(filter, field, startDate, endDate) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, undefined);
  return await query.countDistinct(`${field} as count`);
}

async function customSum(sumField, filter, startDate, endDate) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, undefined);
  return await query.sum(`${sumField} as sumResult`);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  updateAll,
  customSum,
  customSearch,
  customCount,
  countDistinct,
  findById,
};
