deploy:
	docker build -t registry.gitlab.com/hmc-dev/hm-tool-83-tieu-chi-web:latest . &&\
	docker push registry.gitlab.com/hmc-dev/hm-tool-83-tieu-chi-web:latest
