const omit = require('lodash.omit');
const Proto = require('uberproto');
const errors = require('@feathersjs/errors');
const { select, filterQuery } = require('@feathersjs/commons');

class Service {
  constructor (options) {
    if (!options) {
      throw new Error('Sequelize options have to be provided');
    }

    if (!options.Model) {
      throw new Error('You must provide a Sequelize Model');
    }

    this.paginate = options.paginate || {};
    this.Model = options.Model;
    this.id = options.id || 'id';
    this.events = options.events;
  }

  getOptions(query) {
    return {
      // where: {}
      // other options
    };
  }

  //We can go meta with a `makeMethod` function, returning
  //a function that parses options and invokes a callback

  //const o = queryString.parse('includes[associations][items]=foo&includes[associations][items]=bar&includes[associations]=other&includes[associations]=items');
  async find(params) {
    const options = this.getOptions(params.query);

    //if !paginated .findAll()
    return await this.Model.findAndCount(options);
  }

  async get(id, params) {
    const options = this.getOptions(params.query);

    return await this.Model.findById(id, options);
  }

  async create(data, params) {
    const options = this.getOptions(params.query);

    return await this.Model.create(data, options);
  }

  //User.findAll({ include: [{ association: 'Instruments' }] })
  //https://github.com/sequelize/sequelize/pull/6512/files
  async update(id, data, params) {
    const options = this.getOptions(params.query);

    const item = await this.get(id, options);
    return await item.update(new this.Model(data).toJSON(), options);
  }

  //params.query === where clause?
  //params.query.$includes === includes structure
  //params.query.$options === sequelize options
  async patch(id, data, params) {
    const options = this.getOptions(params.query);
    const item = await this.get(id, options);

    return await item.update(data, options);
  }

  //Should this consider bulk operations?
  async remove(id, params) {
    const options = this.getOptions(params.query);
    const item = await this.get(id, options);

    return await item.destroy(options);
  }
};

module.exports = Service;
