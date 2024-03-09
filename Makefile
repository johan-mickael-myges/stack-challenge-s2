run:
	docker compose up -d

stop:
	docker compose down --remove-orphans

restart:stop\
    run