/* Copyright (c) 2022-2023 TORITECH LIMITED 2022 */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'StationNews';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { STATION_NEW_CATEGORIES } = require('../StationNewsConstants');

const insertSchema = {
  stationNewsTitle: Joi.string().required(),
  stationNewsContent: Joi.string().required(),
  stationNewsAvatar: Joi.string().required(),
  embeddedCode: Joi.string().allow(['', null]),
  ordinalNumber: Joi.number().default(1), // default 1,: để tin mới tạo hiện lên đầu
};

const updateSchema = {
  stationNewsTitle: Joi.string(),
  stationNewsContent: Joi.string(),
  stationNewsAvatar: Joi.string(),
  isDeleted: Joi.number(),
  isHidden: Joi.number(),
  stationNewsCategories: Joi.number().valid(Object.values(STATION_NEW_CATEGORIES)),
  embeddedCode: Joi.string().allow(['', null]),
  ordinalNumber: Joi.number().allow(null),
};

const filterSchema = {
  stationNewsTitle: Joi.string(),
  stationNewsContent: Joi.string(),
  stationNewsStatus: Joi.number(),
  isHidden: Joi.number(),
  stationNewsCategories: Joi.string(),
};

module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        stationNewsCategories: Joi.number().valid(Object.values(STATION_NEW_CATEGORIES)),
        ...insertSchema,
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'insert');
    },
  },
  advanceUserAddNews: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdvanceUserToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        stationNewsCategories: Joi.number().valid([
          STATION_NEW_CATEGORIES.PROMOTION_NEWS,
          STATION_NEW_CATEGORIES.RECRUITMENT_NEWS,
          STATION_NEW_CATEGORIES.EXPERT_NEWS,
        ]),
        ...insertSchema,
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'advanceUserAddNews');
    },
  },
  updateById: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  advanceUserUpdateNews: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdvanceUserToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'advanceUserUpdateNews');
    },
  },
  find: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        searchText: Joi.string(),
        filter: Joi.object(filterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'find');
    },
  },
  advanceUserGetList: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdvanceUserToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        searchText: Joi.string(),
        filter: Joi.object(filterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'advanceUserGetList');
    },
  },
  findById: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  advanceUserGetDetail: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdvanceUserToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  stationNewsList: {
    tags: ['api', `${moduleName}`],
    description: `stationNewsList ${moduleName}`,
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        stationsUrl: Joi.string().required(),
        filter: Joi.object({
          stationNewsCategories: Joi.string(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getNewList');
    },
  },
  advanceUserGetNewsList: {
    tags: ['api', `${moduleName}`],
    description: `stationNewsList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdvanceUserToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        stationsUrl: Joi.string().required(),
        filter: Joi.object({
          stationNewsCategories: Joi.string(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getNewList');
    },
  },
  increaseShare: {
    tags: ['api', `${moduleName}`],
    description: `increase Share ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      payload: Joi.object({
        stationNewsId: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'increaseShare');
    },
  },
  stationNewestList: {
    tags: ['api', `${moduleName}`],
    description: `getNewestList ${moduleName}`,
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        stationsUrl: Joi.string().required(),
        filter: Joi.object({
          stationNewsCategories: Joi.string(),
        }),
        order: Joi.object({
          key: Joi.string().default('stationNewsUpdatedAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getNewestList');
    },
  },
  getExpertNews: {
    tags: ['api', `${moduleName}`],
    description: `getExpertNews ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0).max(99999),
        limit: Joi.number().default(20).min(1).max(100),
        order: Joi.object({
          key: Joi.string().default('stationNewsUpdatedAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getExpertNews');
    },
  },
  getRecruitmentNews: {
    tags: ['api', `${moduleName}`],
    description: `getExpertNews ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0).max(99999),
        limit: Joi.number().default(20).min(1).max(100),
        order: Joi.object({
          key: Joi.string().default('stationNewsUpdatedAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getRecruitmentNews');
    },
  },
  getHighLightNews: {
    tags: ['api', `${moduleName}`],
    description: `getExpertNews ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0).max(99999),
        limit: Joi.number().default(20).min(1).max(100),
        order: Joi.object({
          key: Joi.string().default('stationNewsUpdatedAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getHighLightNews');
    },
  },
  getPartnerPromotionNews: {
    tags: ['api', `${moduleName}`],
    description: `getExpertNews ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0).max(99999),
        limit: Joi.number().default(20).min(1).max(100),
        order: Joi.object({
          key: Joi.string().default('stationNewsUpdatedAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getPartnerPromotionNews');
    },
  },
  getPartnerUtilityNews: {
    tags: ['api', `${moduleName}`],
    description: `getPartnerUtilityNews ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0).max(99999),
        limit: Joi.number().default(20).min(1).max(100),
        order: Joi.object({
          key: Joi.string().default('stationNewsUpdatedAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getPartnerUtilityNews');
    },
  },
  stationHotNewsList: {
    tags: ['api', `${moduleName}`],
    description: `stationHotNewsList ${moduleName}`,
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        stationsUrl: Joi.string().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getHotNewList');
    },
  },
  advanceUserGetHotNewsList: {
    tags: ['api', `${moduleName}`],
    description: `advanceUserGetHotNewsList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdvanceUserToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        stationsUrl: Joi.string().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getHotNewList');
    },
  },
  stationNewsDetail: {
    tags: ['api', `${moduleName}`],
    description: `get details ${moduleName}`,
    validate: {
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getNewsDetail');
    },
  },
  advanceUserGetNewsDetail: {
    tags: ['api', `${moduleName}`],
    description: `get details ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdvanceUserToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getNewsDetail');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
  advanceUserDeleteNew: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdvanceUserToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'advanceUserDeleteNew');
    },
  },
  stationAllNews: {
    tags: ['api', `${moduleName}`],
    description: `stationAllNews ${moduleName}`,
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(5).max(10),
        stationsUrl: Joi.string(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getAllNewsForStation');
    },
  },
};
