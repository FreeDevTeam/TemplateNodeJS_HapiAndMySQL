/* Copyright (c) 2023 TORITECH LIMITED 2022 */

const moment = require('moment');
const Logger = require('../../../utils/logging');
const AppUserVehicleSettingAccess = require('../resourceAccess/AppUserVehicleSettingAccess');
const CustomerMessageFunctions = require('../../CustomerMessage/CustomerMessageFunctions');
const { SETTING_STATUS } = require('../AppUserVehicleSettingConstant');

async function checkingUserVehicleExpireDateBHTNDS() {
  Logger.info('CHECKING APP USER VEHICLE EXPIRE DATE BHTNDS');
  const currentDate = moment().format('YYYYMMDD') * 1;
  const nextMonth = moment().add(1, 'month').format('YYYYMMDD') * 1;
  const next7Days = moment().add(7, 'days').format('YYYYMMDD') * 1;
  const next3Days = moment().add(3, 'days').format('YYYYMMDD') * 1;
  const next1Days = moment().add(1, 'days').format('YYYYMMDD') * 1;

  const EXPIRE_IN_ONE_MONTH_MESSAGE = 'chỉ còn 1 tháng là hết hạn BHTNDS.';
  const EXPIRE_IN_SEVEN_DAYS_MESSAGE = 'chỉ còn 7 ngày là hết hạn BHTNDS.';
  const EXPIRE_IN_THREE_DAYS_MESSAGE = 'chỉ còn 3 ngày là hết hạn BHTNDS.';
  const EXPIRE_IN_ONE_DAYS_MESSAGE = 'chỉ còn 1 ngày là hết hạn BHTNDS.';
  const OUT_OF_DATE_MESSAGE = 'có BHTNDS đã hết hạn.';

  await notifyExpireDateBHTNDSForUser(nextMonth, EXPIRE_IN_ONE_MONTH_MESSAGE);
  await notifyExpireDateBHTNDSForUser(next7Days, EXPIRE_IN_SEVEN_DAYS_MESSAGE);
  await notifyExpireDateBHTNDSForUser(next3Days, EXPIRE_IN_THREE_DAYS_MESSAGE);
  await notifyExpireDateBHTNDSForUser(next1Days, EXPIRE_IN_ONE_DAYS_MESSAGE);
  await notifyExpireDateBHTNDSForUser(currentDate, OUT_OF_DATE_MESSAGE);
}

async function notifyExpireDateBHTNDSForUser(expireDate, leftDaysMessage, limit = 30) {
  const filter = {
    vehicleExpiryDateBHTNDS: expireDate,
  };

  let skip = 0;
  while (true) {
    // Mỗi lượt lấy limit record
    const vehicleExpire = await AppUserVehicleSettingAccess.customSearch(filter, skip, limit);
    if (vehicleExpire && vehicleExpire.length > 0) {
      const promiseBunch = vehicleExpire.map(vehicle => _notifyToCustomer(leftDaysMessage, vehicle));
      await Promise.all(promiseBunch); // thông báo cùng lúc cho limit người dùng
    } else {
      break;
    }
    skip += limit;
  }
}

async function _notifyToCustomer(leftDaysMessage, vehicle) {
  const title = 'Thông báo hạn BHTNDS';
  const message = `Phương tiện BSX ${vehicle.vehicleIdentity} ${leftDaysMessage}`;
  await CustomerMessageFunctions.addMessageCustomer(title, undefined, message, vehicle.vehicleIdentity, vehicle.appUserId, vehicle.appUserVehicleId);
}

module.exports = {
  checkingUserVehicleExpireDateBHTNDS,
};