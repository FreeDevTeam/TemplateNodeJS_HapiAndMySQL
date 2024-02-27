/* Copyright (c) 2022-2024 Reminano */

module.exports = {
  STAFF_SEX: {
    MALE: 0,
    FEMALE: 1,
  },
  STAFF_STATUS: {
    ACTIVE: 1,
    NO_ACTIVE: 0,
  },
  STAFF_ERROR: {
    DUPLICATED_STAFF: 'DUPLICATED_STAFF',
    DUPLICATED_STAFF_EMAIL: 'DUPLICATED_STAFF_EMAIL',
    DUPLICATED_STAFF_PHONE: 'DUPLICATED_STAFF_PHONE',
    NOT_AUTHORIZED: 'NOT_AUTHORIZED',
    STAFF_LOCKED: 'STAFF_LOCKED',
    USERNAME_OR_PASSWORD_NOT_MATCH: 'USERNAME_OR_PASSWORD_NOT_MATCH',
    INVALID_ROLE: 'INVALID_ROLE',
    STAFF_IS_NOT_EXIST: 'STAFF_IS_NOT_EXIST',
    ROLE_MUST_DIFFERENT_ADMIN: 'ROLE_MUST_DIFFERENT_ADMIN',
  },
  VALID_STAFF: 'VALID_STAFF',
};
