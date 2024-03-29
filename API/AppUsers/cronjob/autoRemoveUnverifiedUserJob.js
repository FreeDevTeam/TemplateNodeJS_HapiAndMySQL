/* Copyright (c) 2022-2023 TORITECH LIMITED 2022 */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moment = require('moment');
const { deleteUserAccount } = require('../AppUsersFunctions');

const AppUsersResourceAccess = require('../resourceAccess/AppUsersResourceAccess');
const { NORMAL_USER_ROLE } = require('../../AppUserRole/AppUserRoleConstant');

async function autoRemoveUnverifiedUser() {
  let endDate = moment().add(-3, 'day').format();
  while (true) {
    let _unactiveUserList = await AppUsersResourceAccess.customSearch(
      {
        isVerifiedPhoneNumber: 0,
        appUserRoleId: NORMAL_USER_ROLE, //chi xoa user thuong
      },
      0,
      5,
      undefined,
      endDate,
    );
    if (_unactiveUserList && _unactiveUserList.length >= 0) {
      for (let i = 0; i < _unactiveUserList.length; i++) {
        const _unactiveUser = _unactiveUserList[i];
        await deleteUserAccount(_unactiveUser);
      }
    } else {
      break;
    }
  }
}
autoRemoveUnverifiedUser();

module.exports = {
  autoRemoveUnverifiedUser,
};
