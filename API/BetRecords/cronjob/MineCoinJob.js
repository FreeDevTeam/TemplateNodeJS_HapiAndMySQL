/* Copyright (c) 2022 Reminano */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const ServicePackageUserViews = require('../../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
const UserServiceResource = require('../../PaymentServicePackage/resourceAccess//PaymentServicePackageUserResourceAccess');
const WalletResource = require('../../Wallet/resourceAccess/WalletResourceAccess');
const { ACTIVITY_STATUS, MINING_DURATION } = require('../../PaymentServicePackage/PaymentServicePackageConstant');
const Logger = require('../../../utils/logging');

async function updateUserPackageStatus() {
  Logger.info(`updateUserPackageStatus ${new Date()}`);
  //Count all in-progress service packages
  let countAllInprogress = await ServicePackageUserViews.count({
    packageActivityStatus: ACTIVITY_STATUS.WORKING,
  });

  if (countAllInprogress && countAllInprogress.length > 0) {
    countAllInprogress = countAllInprogress[0].count;
  }

  if (countAllInprogress < 1) {
    Logger.info(`There is no package in-progress`);
    resolve('OK');
    return;
  } else {
    Logger.info(`There is ${countAllInprogress} package in-progress`);
  }

  const MAX_PER_BATCH = 100;
  let batchCount = parseInt(countAllInprogress / MAX_PER_BATCH);
  if (batchCount * MAX_PER_BATCH < countAllInprogress) {
    batchCount = batchCount + 1;
  }

  for (let i = 0; i < batchCount; i++) {
    let userServicePackages = await ServicePackageUserViews.find(
      {
        packageActivityStatus: ACTIVITY_STATUS.WORKING,
      },
      MAX_PER_BATCH * i,
      MAX_PER_BATCH,
    );

    if (userServicePackages && userServicePackages.length > 0) {
      for (let packageCounter = 0; packageCounter < userServicePackages.length; packageCounter++) {
        const userPackage = userServicePackages[packageCounter];
        if (
          new Date(userPackage.packageExpireDate) - 1 < new Date() - 1 ||
          userPackage.profitEstimate <= userPackage.profitActual + userPackage.profitClaimed
        ) {
          await UserServiceResource.updateById(userPackage.paymentServicePackageUserId, {
            packageActivityStatus: ACTIVITY_STATUS.COMPLETED,
            packageNote: 'MACHINE_LIQUIDATION_EXPIRED',
          });
        }
      }
    }
  }
  Logger.info(`Complete updateUserPackageStatus ${new Date()}`);
}

async function mineCoin() {
  Logger.info(`start mine coin ${new Date()}`);
  return new Promise(async (resolve, reject) => {
    try {
      //Count all in-progress service packages
      let countAllInprogress = await ServicePackageUserViews.count({
        packageActivityStatus: ACTIVITY_STATUS.WORKING,
      });

      if (countAllInprogress && countAllInprogress.length > 0) {
        countAllInprogress = countAllInprogress[0].count;
      }

      if (countAllInprogress < 1) {
        Logger.info(`There is no package in-progress`);
        resolve('OK');
        return;
      } else {
        Logger.info(`There is ${countAllInprogress} package in-progress`);
      }

      const MAX_PER_BATCH = 100;
      let batchCount = parseInt(countAllInprogress / MAX_PER_BATCH);
      if (batchCount * MAX_PER_BATCH < countAllInprogress) {
        batchCount = batchCount + 1;
      }

      for (let i = 0; i < batchCount; i++) {
        let userServicePackages = await ServicePackageUserViews.find(
          {
            packageActivityStatus: ACTIVITY_STATUS.WORKING,
          },
          MAX_PER_BATCH * i,
          MAX_PER_BATCH,
        );
        if (userServicePackages && userServicePackages.length > 0) {
          for (let packageCounter = 0; packageCounter < userServicePackages.length; packageCounter++) {
            const userPackage = userServicePackages[packageCounter];
            //get mining duration
            let miningDuration = new Date(userPackage.packageLastActiveDate) - 1 - (new Date() - 1);
            //convert from ms to minutes
            miningDuration = Math.abs(parseInt(miningDuration / 1000 / 60));
            if (miningDuration < MINING_DURATION * 60) {
              continue;
            }

            //update profileActual of package
            let updateProfitResult = await UserServiceResource.updateById(userPackage.paymentServicePackageUserId, {
              profitActual: userPackage.profitActual + userPackage.packageCurrentPerformance,
              packageActivityStatus: ACTIVITY_STATUS.STANDBY,
            });

            if (!updateProfitResult) {
              Logger.error(`can not updateProfitResult package ${userPackage.paymentServicePackageId} for user ${userPackage.appUserId}`);
            }
          }
        }
      }

      Logger.info(`Complete mine coin ${new Date()}`);
      //update status for all packages
      await updateUserPackageStatus();
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

mineCoin();

module.exports = {
  mineCoin,
};
