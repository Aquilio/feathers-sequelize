const assert = require('assert');
const { expect } = require('chai');

const Sequelize = require('sequelize');
const errors = require('@feathersjs/errors');
const feathers = require('@feathersjs/feathers');

const Service = require('../lib');
const dehydrate = require('../lib/hooks/dehydrate');

const sequelize = new Sequelize('sequelize', '', '', {
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false
});

const Item = sequelize.define('Item', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: Sequelize.STRING
  },

  description: {
    type: Sequelize.STRING
  }
});

before(async () => {
  await Item.sync({ force: true });
});

it('should', async () => {
  const app = feathers();

  app.use('/items', new Service({
    Model: Item
  }));

  app.service('items').hooks({
    after: {
      all: [dehydrate()]
    }
  });

  const item = await app.service('items').create({ name: 'foo', description: 'bar' });
  console.log(item);
});
