FROM node:16

USER root
ARG USER_ID="1000"
ARG GROUP_ID="1000"

RUN if [ "$GROUP_ID" != "1000" ]; then groupadd node${USER_ID} -g ${GROUP_ID}; fi
RUN if [ "$USER_ID" != "1000" ]; then useradd node${USER_ID} -u ${USER_ID} -g ${GROUP_ID}; fi

RUN if [ "$USER_ID" != "1000" ]; then mkdir /home/node${USER_ID} && chown ${USER_ID}:${GROUP_ID} /home/node${USER_ID}; fi

