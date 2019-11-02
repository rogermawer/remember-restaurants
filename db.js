const express = require('express');
const {Pool} = require('pg');

var exports = module.exports = {};

exports.pool = new Pool({
  user: 'ilio-marketing',
  host: 'localhost',
  database: 'test',
  password: 'password',
  port: 5432,
})