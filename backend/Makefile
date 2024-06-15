# Define variables for commonly used commands
DOCKER_COMPOSE = docker compose exec backend
SEQUELIZE = npx sequelize-cli --migrations-path src/migrations --config src/config/config.js

.PHONY: migrate undo-migrate undo-all-migrations seed undo-seed undo-all-seeds reset-db clear-db clean-db generate-migration

# Command to run migrations
migrate:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate

# Command to undo the last migration
undo-migrate:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo

# Command to undo all migrations
undo-all-migrations:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo:all

# Command to run seeders
seed:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:all

# Command to undo the last seed
undo-seed:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:undo

# Command to undo all seeds
undo-all-seeds:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:undo:all

# Command to reset the database (undo all migrations, migrate, and seed)
reset-db:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo:all
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:all

# Command to clear the database (undo all migrations)
clear-db:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo:all

# Command to clean the database (undo all migrations and seeds)
clean-db:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate:undo:all
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:seed:undo:all

# Command to generate a new migration with a dynamic name
generate-migration:
	@read -p "Migration name: " name; \
	$(DOCKER_COMPOSE) sh -c "npx sequelize-cli migration:generate --name '$$name' --migrations-path src/migrations"

sync-db:
	$(DOCKER_COMPOSE) sh -c "node -e 'require(\"./src/models\").sequelize.sync()'"

init-db:
	$(DOCKER_COMPOSE) $(SEQUELIZE) db:migrate
	$(DOCKER_COMPOSE) sh -c "node -e 'require(\"./src/models\").sequelize.sync()'"