.PHONY: dev

dev:
	docker compose -f backend/docker-compose.yml up -d
	cd frontend && pnpm dev

dump:
	@echo "📦 Creating SQL dump..."
	docker exec $$(docker compose -f backend/docker-compose.yml ps -q db) \
		pg_dump -U bijay -d seds --no-owner --no-privileges --clean --if-exists > backend/dump.sql
	@echo "✅ Saved to dump.sql"

restore:
	@echo "📂 Restoring from dump.sql..."
	cat backend/dump.sql | docker exec -i $$(docker compose -f backend/docker-compose.yml ps -q db) psql -U bijay -d mocksewa
	@echo "✅ Restore complete."