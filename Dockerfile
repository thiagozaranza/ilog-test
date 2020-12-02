FROM nginx:1.17.6
LABEL MAINTAINER="<thiagozaranza@gmail.com>"

EXPOSE 80 443

WORKDIR /usr/share/nginx/html