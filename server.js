const express= require("express");

const db= require("./models/index");

db.sequelize.sync();