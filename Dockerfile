#FROM debian:buster-slim
FROM alpine
WORKDIR /tmp
EXPOSE 8000
COPY bin/server-linux ./bin/server-linux
COPY data.json .
ENV ORIGIN_ALLOWED="http://localhost:8080"
CMD [ "./bin/server-linux"]
