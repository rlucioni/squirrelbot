include .env
export $(shell sed 's/=.*//' .env)

deploy:
	@echo "generating .env.yaml from .env..."
	@echo "UNIFI_API_KEY: ${UNIFI_API_KEY}" > .env.yaml
	@echo "SLACK_BOT_TOKEN: ${SLACK_BOT_TOKEN}" >> .env.yaml
	@echo "SLACK_CHANNEL_ID: ${SLACK_CHANNEL_ID}" >> .env.yaml
	@echo "deploying to GCP..."
	npm run deploy
	@rm .env.yaml
	@echo "deployment complete!"

enable:
	gcloud services enable \
	cloudfunctions.googleapis.com \
	run.googleapis.com \
	cloudbuild.googleapis.com \
	artifactregistry.googleapis.com \
	cloudscheduler.googleapis.com

lint:
	npm run lint

ping:
	curl localhost:8080

prettier:
	npm run prettier

reschedule:
	npm run reschedule

schedule:
	npm run schedule

serve:
	npm run serve
