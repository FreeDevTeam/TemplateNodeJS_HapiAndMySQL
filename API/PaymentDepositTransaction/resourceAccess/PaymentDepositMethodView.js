/* Copyright (c) 2022-2024 Reminano */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'DepositTransactionUserView';
const rootTableName = 'PaymentMethod';
const primaryKeyField = 'paymentDepositTransactionId';
async function createView() {
  const UserTableName = 'DepositTransactionUserView';
  let fields = [
    `${UserTableName}.appUserId`,
    `${UserTableName}.firstName`,
    `${UserTableName}.lastName`,
    `${UserTableName}.email`,
    `${UserTableName}.memberLevelName`,
    `${UserTableName}.active`,
    `${UserTableName}.ipAddress`,
    `${UserTableName}.phoneNumber`,
    `${UserTableName}.telegramId`,
    `${UserTableName}.facebookId`,
    `${UserTableName}.appleId`,
    `${UserTableName}.username`,
    `${UserTableName}.companyName`,
    `${UserTableName}.appUserMembershipTitle`,
    `${UserTableName}.isUserDeposit`,
    `${UserTableName}.paymentDepositTransactionId`,
    `${UserTableName}.paymentAmount`,
    `${UserTableName}.paymentRewardAmount`,
    `${UserTableName}.paymentUnit`,
    `${UserTableName}.paymentStatus`,
    `${UserTableName}.paymentType`,
    `${UserTableName}.paymentRef`,
    `${UserTableName}.paymentSecondaryRef`,

    `${UserTableName}.paymentNote`,
    `${UserTableName}.paymentOwner`,
    `${UserTableName}.paymentOriginSource`,
    `${UserTableName}.paymentOriginName`,
    `${UserTableName}.paymentApproveDate`,
    `${UserTableName}.paymentPICId`,
    `${UserTableName}.createdAt`,
    `${UserTableName}.createdAtTimestamp`,
    `${UserTableName}.updatedAt`,
    `${UserTableName}.isHidden`,
    `${UserTableName}.isDeleted`,

    `${rootTableName}.paymentMethodId`,
    `${rootTableName}.paymentMethodName`,
    `${rootTableName}.paymentMethodType`,
    `${rootTableName}.paymentCategory`,
    `${rootTableName}.paymentMethodIdentityNumber`,
    `${rootTableName}.paymentMethodReferName`,
    `${rootTableName}.paymentMethodReceiverName`,
    `${rootTableName}.paymentMethodImageUrl`,
  ];
  var viewDefinition = DB.select(fields)
    .from(UserTableName)
    .leftJoin(rootTableName, function () {
      this.on(`${UserTableName}.paymentMethodId`, '=', `${rootTableName}.paymentMethodId`);
    });
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`)
        .orWhere('companyName', 'like', `%${searchText}%`)
        .orWhere('paymentOwner', 'like', `%${searchText}%`)
        .orWhere('paymentOriginSource', 'like', `%${searchText}%`)
        .orWhere('paymentOriginName', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

  if (startDate) {
    const moment = require('moment');
    queryBuilder.where('createdAtTimestamp', '>=', moment(startDate).toDate() * 1);
  }

  if (endDate) {
    const moment = require('moment');
    queryBuilder.where('createdAtTimestamp', '<=', moment(endDate).toDate() * 1);
  }

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
async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, startDate, endDate, searchText) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText);
  return await query.count(`paymentDepositTransactionId as count`);
}

async function customSum(sumField, filter, searchText, startDate, endDate) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText);
  return await query.sum(`${sumField} as sumResult`);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  sum,
  modelName: tableName,
  customSearch,
  customCount,
  customSum,
};
