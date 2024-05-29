/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.createTable("volcanoes", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("region").notNullable();
        table.string("subregion").notNullable();
        table.string("last_eruption").notNullable();
        table.integer("summit").notNullable(); // height in meters
        table.integer("elevation").notNullable(); // height in feet
        table.integer("population_5km").notNullable();
        table.integer("population_10km").notNullable();
        table.integer("population_30km").notNullable();
        table.integer("population_100km").notNullable();
        table.decimal("latitude", 10, 7).notNullable();
        table.decimal("longitude", 10, 7).notNullable();
        table.timestamps(true, true); // created_at and updated_at
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("volcanoes");
};
