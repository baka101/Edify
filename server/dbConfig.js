var dbUrl = {};

if(process.env.NODE_ENV == "production"){
  dbUrl.deploy = true; // FALSE = LOCAL
}else{
  dbUrl.deploy = false; // TRUE = DEPLOYED
}

var url_parse = function(url){ // I wrote this parse function, you're welcome. (<-- "Thanks Mike!")
  if(url){
    dbUrl.user = url.split(':')[1].substring(2);
    dbUrl.password = url.split(':')[2].split("@")[0];
    dbUrl.host = url.split('@')[1].split("/")[0];
    dbUrl.database = url.split('/')[3].split("?")[0];
  }
};

url_parse(process.env.CLEARDB_DATABASE_URL);

var knex;

if(dbUrl.deploy){
  knex = require('knex')({
    client: 'mysql',
    connection: {
      host: dbUrl.host,
      user: dbUrl.user,
      password: dbUrl.password,
      database: dbUrl.database,
      charset: 'utf8'
    }
  });
}else{
  knex = require('knex')({
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'edify',
      charset: 'utf8'
    }
  });
}


var db = require('bookshelf')(knex);
db.plugin('registry');

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 255).unique();
      user.string('email', 255);
      user.string('github_id', 255);
      user.string('blurb', 255);
      user.string('avatar', 255);
      user.string('zip', 5);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('skills').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('skills', function (skill) {
      skill.increments('id').primary();
      skill.string('skill_name', 255).unique();
      skill.string('skill_description', 255);
      skill.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users_learn_skills').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users_learn_skills', function (entry) {
      entry.increments('id').primary();
      entry.integer('user_id', 255);
      entry.integer('skill_id', 255);
      entry.string('blurb', 255);
      entry.integer('skill_level', 255);

      // "stars" is the number of upvotes received by a teacher or learner from other users
      //    This is part of an incomplete feature for upvoting other users.
      //    This column of the schema should likely be removed in favor of
      //    tabulating the number of upvotes through "user_like_teachers" and "users_like_learners"   
      entry.integer('stars', 255);

      entry.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users_teach_skills').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users_teach_skills', function (entry) {
      entry.increments('id').primary();
      entry.integer('user_id', 255);
      entry.integer('skill_id', 255);
      entry.string('blurb', 255);
      entry.integer('skill_level', 255);

      // "stars" is the number of upvotes received by a teacher or learner from other users
      //    This is part of an incomplete feature for upvoting other users.
      //    This column of the schema should likely be removed in favor of
      //    tabulating the number of upvotes through "user_like_teachers" and "users_like_learners"  
      entry.integer('stars', 255);

      entry.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});


/////////////////////////////////////////////////////////////////////////////////////
//  Database Schema for incomplete feature: UPVOTING OTHER USERS
//                   
db.knex.schema.hasTable('users_like_teachers').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users_like_teachers', function (entry) {
      entry.increments('id').primary();
      entry.integer('voter_id', 255);
      entry.integer('teach_skill_id', 255);
      entry.integer('teacher_id', 255);
      entry.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////
//  Database Schema for incomplete feature: UPVOTING OTHER USERS
//                  
db.knex.schema.hasTable('users_like_learners').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users_like_learners', function (entry) {
      entry.increments('id').primary();
      entry.integer('voter_id', 255);
      entry.integer('learn_skill_id', 255);
      entry.integer('learner_id', 255);
      entry.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////

module.exports = db;
