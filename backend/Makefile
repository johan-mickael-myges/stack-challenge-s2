# Define variables for commonly used commands
DOCKER_COMPOSE = docker compose exec backend
SEQUELIZE = npx sequelize-cli --migrations-path src/migrations --seeders-path src/seeders --config src/config/config.js

.PHONY: db-create db-drop db-migrate db-undo-migrate db-undo-all-migrations db-seed db-undo-seed db-undo-all-seeds db-reset db-clear db-clean db-generate-migration db-sync db-init db-drop-and-sync db-status

# Command to create the database
db-create:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:create

# Command to drop the database
db-drop:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:drop

# Command to run migrations
db-migrate:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate

# Command to undo the last migration
db-undo-migrate:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo

# Command to undo all migrations
db-undo-all-migrations:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo:all

# Command to generate a new seed file with a dynamic name
generate-seed:
	@read -p "Seed name: " name; \
	$(DOCKER_COMPOSE) sh -c "npx sequelize-cli seed:generate --name '$$name' --seeders-path src/seeders --config src/config/config.js"

# Command to run seeders
db-seed:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:all

# Command to undo the last seed
db-undo-seed:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:undo

# Command to undo all seeds
db-undo-all-seeds:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:undo:all

# Command to reset the database (undo all migrations, migrate, and seed)
db-reset:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo:all
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:all

# Command to clear the database (undo all migrations)
db-clear:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo:all

# Command to clean the database (undo all migrations and seeds)
db-clean:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo:all
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:undo:all

# Command to generate a new migration with a dynamic name
db-generate-migration:
	@read -p "Migration name: " name; \
	$(DOCKER_COMPOSE) sh -c "npx sequelize-cli migration:generate --name '$$name' --migrations-path src/migrations --config src/config/config.js"

# Command to synchronize models with the database
db-sync:
	$(DOCKER_COMPOSE) sh -c "node -e 'require(\"./src/models\").sequelize.sync()'"

# Command to initialize the database (migrate and sync)
db-init:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate
	$(DOCKER_COMPOSE) sh -c "node -e 'require(\"./src/models\").sequelize.sync()'"

# Command to drop all tables and resync the database
db-drop-and-sync:
	$(DOCKER_COMPOSE) sh -c "node ./scripts/drop-and-sync.js"

# Command to check the status of migrations
db-status:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:status

# Command to recreate everything (drop, create, migrate, and seed the database)
db-recreate:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:drop
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:create
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:all

# Run tests
test:
	$(DOCKER_COMPOSE) npm test

test-watch:
	$(DOCKER_COMPOSE) npm run test-watch