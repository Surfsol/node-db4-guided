# Requirements

A client has hired you to track zoo animals.
For each animal, you must track that their name, species, and all zoos in which they have resided (including zoo name and address).

Determine the database tables necessary to track this information.

Label any relationships between table.

//create two tables
//Note that the foreign key can only be created after the reference table.
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('farms', tbl => {
      tbl.increments();
      tbl.string('farm_name', 128)
        .notNullable();
    })
    // we can chain together createTable
    .createTable('ranchers', tbl => {
      tbl.increments();
      tbl.string('rancher_name', 128);
      tbl.integer('farm_id')
        // forces integer to be positive
        .unsigned()
        .notNullable()
        .references('id')
        // this table must exist already
        .inTable('farms')
    })
};
<!-- Note that the foreign key can only be created after the reference table.

In the down function, the opposite is true. We always want to drop a table with a foreign key before dropping the table it references. -->


exports.down = function(knex, Promise) {
  // drop in the opposite order
  return knex.schema
    .dropTableIfExists('ranchers')
    .dropTableIfExists('farms')
};


<!-- In the case of a many-to-many relationship, the syntax for creating a intermediary table is identical, except for one additional piece. We need a way to make sure our combination of foreign keys in unique. -->

.createTable('farm_animals', tbl => {
  tbl.integer('farm_id')
    .unsigned()
    .notNullable()
    .references('id')
    // this table must exist already
    .inTable('farms')
  tbl.integer('animal_id')
    .unsigned()
    .notNullable()
    .references('id')
    // this table must exist already
    .inTable('animals')

  // the combination of the two keys becomes our primary key
  // will enforce unique combinations of ids
  tbl.primary(['farm_id', 'animal_id']);
});

-------------------------------------------------------------------------------
Seeds
Order is also a concern when seeding.
 We want to create seeds in the same order we created our tables.
  In other words, don’t create a seed with a foreign key, until that reference record exists.

In our example, make sure to write the 01-farms seed file and then the 02-ranchers seed file.

However, we will run into a problem with truncating our seeds, because we want to truncate 02-ranchers before 01-farms. A library called:
 knex-cleaner that provides as easy solution.

Run knex seed:make 00-cleanup 
and npm install knex-cleaner. 

Inside the cleanup seed use the following code.
---------
const cleaner = require('knex-cleaner');

exports.seed = function(knex) {
  return cleaner.clean(knex, {
    mode: 'truncate', // resets ids
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'], // don't empty migration tables
  });
};

-----

----------------------------------------------------------------------
Cascading
If a user attempt to delete a record that is references by another record (such as attempting to delete Morton Ranch when entries in our ranchers table references that record), by default the database will prevent it from being deleted. The same thing can happen when updating a record when a foreign key reference.

If we want that delete or update to cascade, in other words deleting a record also deletes all referencing records, we can set that up in our schema.

.createTable('ranchers', tbl => {
    tbl.increments();
    tbl.string('rancher_name', 128);
    tbl.integer('farm_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('farms')
    .onUpdate('CASCADE');
    .onDelete('CASCADE')
})

a good data model:
- captures only information system needs
- flexible
- guarantee data integrity, without too much sacrifice
- driven by way will use data

components 
-entities (nouns: zoo, animal, species), a resource --> tables
- properties --> columns or fields
- relationships --> Foreign Keys 

workflow
-identify entities
-identify properties
-identify relationships

- every table must have a primary key
        -more efficient to use #
        - postgres: type:serial
- work on 2 or 3 entities at a time

zoos:
id - serial
name - varchar //optional unique
address - could be null

animals:
id
name
species_id  - foregin key --> mark pointing to Species
                - foregin key must be same type as primary key

Relationships:
- one to one
- one to many - most common
    - need foreign key
    - foreign key always goes on many 
- many to many

with a many to many need a 3rd table
zoo/animals
two foreign keys 
1. foreign key to zoo
2. foreign key to animals

3rd table could include other columns

knex migrate:make bootstrap

exports.up = function(knex){
    return knex.schema.creatTable('species', tble =>{
        // unsigned integer, cannot be negative
        tbl.increments()  //type: integer

        tbl.string('name').notNullable()
    })
    .createTable('animals', tbl => {
        tbl.increments()

        tbl.string('name', 255).notNullable()

        //define out Foreign key
        tbl
            .integer('species_id')
            .unsigned()
            .references('id')
            .inTable('species')
            //cascading
            .onDelete('RESTRICT') // about deleting the record from primary key table
            .onUpdate('CASCADE')// about changing the value of the primary key
    })
}

.createTable('zoo', tbl => {
    tbl.increments()
    tbl.string('Zoo_name', 64).notNullable()
    tbl.string('address')
})
.createTable('animal_zoo', tbl => {
    tbl.increments(),
    tbl
       .integer(zoo_id)
       .unsigned()
       .reference('id')
       .inTable('zoos')
       ..onDelete('RESTRICT')
       .onUpdate('CASCADE')
    
    tbl
       .integer(animal_id)
       .unsigned()
       .reference('id')
       .inTable('animals')
       ..onDelete('RESTRICT')
       .onUpdate('CASCADE')
})



cascading - what to do with child of parent that is modified
CASCADE // change value if primary key value changes