/* Copyright (c) 2022-2024 Reminano */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { DEPOSIT_TRX_STATUS, DEPOSIT_TRX_CATEGORY, DEPOSIT_TRX_UNIT, DEPOSIT_TRX_TYPE } = require('../PaymentDepositTransactionConstant');
const Logger = require('../../../utils/logging');
const tableName = 'PaymentDepositTransaction';
const primaryKeyField = 'paymentDepositTransactionId';

async function createTable() {
  Logger.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('paymentDepositTransactionId').primary();
          table.integer('appUserId');
          table.integer('walletId');
          table.integer('referId'); // nguoi gioi thieu
          table.integer('paymentMethodId');
          table.bigInteger('paymentAmount').defaultTo(0); //số tiền nạp
          table.bigInteger('paymentRewardAmount').defaultTo(0); //số tiền được thưởng
          table.bigInteger('paymentRefAmount').defaultTo(0); //số tiền quy đổi hoặc tham chiếu
          table.string('paymentUnit').defaultTo(DEPOSIT_TRX_UNIT.USDT); //don vi tien
          table.integer('isUserDeposit').defaultTo(0);
          table.string('paymentType').defaultTo(DEPOSIT_TRX_TYPE.USER_DEPOSIT);
          table.string('paymentStatus').defaultTo(DEPOSIT_TRX_STATUS.NEW);
          table.string('paymentCategory').defaultTo(DEPOSIT_TRX_CATEGORY.BANK);
          table.string('paymentNote').defaultTo('Đến: Ví chính'); //Ghi chu
          table.string('paymentRef').defaultTo(''); //Ma hoa don,ma giao dich thuc te
          table.string('paymentSecondaryRef').defaultTo(''); //Ma hoa don,ma giao dich thuc te
          table.string('paymentOwner').defaultTo(''); //ten nguoi gui, ten tai khoan
          table.string('paymentOriginSource').defaultTo(''); //ten ngan hang, ten mang (blockchain)
          table.string('paymentOriginName').defaultTo(''); //so tai khoan, dia chi vi
          table.timestamp('paymentApproveDate', { useTz: true }); // ngay duyet
          table.integer('paymentPICId'); // nguoi duyet
          table.integer('paymentStaffId'); // nguoi tạo, người quản lý
          timestamps(table);
          table.index('paymentStaffId');
          table.index('appUserId');
          table.index('referId');
          table.index('isUserDeposit');
          table.index('paymentType');
          table.index('paymentStatus');
          table.index('paymentCategory');
          table.index('paymentMethodId');
        })
        .then(() => {
          Logger.info(`${tableName} table created done`);
          resolve();
        });
    });
  });
}

async function initDB() {
  await createTable();
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
async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
}
async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
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

async function customSum(sumField, filter, startDate, endDate) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, undefined);
  return await query.sum(`${sumField} as sumResult`);
}

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'paymentAmount', filter, startDate, endDate);
}

module.exports = {
  insert,
  find,
  findById,
  count,
  updateById,
  initDB,
  customSearch,
  modelName: tableName,
  customSum,
  sumAmountDistinctByDate,
};
