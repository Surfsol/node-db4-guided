
exports.up = function(knex) {
    return knex.schema
    .creatTable('species', tble =>{
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
    .creatTable('zoos', tble =>{
        // unsigned integer, cannot be negative
        tbl.increments()  //type: integer
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
           .onDelete('RESTRICT')
           .onUpdate('CASCADE')
        
        tbl
           .integer(animal_id)
           .unsigned()
           .reference('id')
           .inTable('animals')
           .onDelete('RESTRICT')
           .onUpdate('CASCADE')
    })
  
};

exports.down = function(knex) {
  
};
