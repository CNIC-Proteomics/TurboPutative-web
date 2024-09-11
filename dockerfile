FROM ubuntu:22.04

# set working directory
WORKDIR /root

# install ubuntu dependencies
RUN apt-get update
RUN yes | apt-get install git
RUN yes | apt-get install build-essential
RUN yes | apt-get install curl

# install node
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=20.17.0

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH=$NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# get TurboPutative
RUN git clone --depth 1 --branch v1.0.8 https://github.com/CNIC-Proteomics/TurboPutative-web

# copy micromamba environment
COPY micromamba.tar.gz /root/
RUN tar -xvzf micromamba.tar.gz
RUN rm micromamba.tar.gz
RUN mkdir bin

# get Micromamba
# ENV PATH=/root/bin:$PATH
# ENV MAMBA_EXE=/root/bin/micromamba
# ENV MAMBA_ROOT_PREFIX=/root/micromamba

# RUN curl -Ls https://micro.mamba.pm/api/micromamba/linux-64/latest | tar -xvj bin/micromamba

# create R environment
# RUN micromamba create -n R
# ENV PATH=/root/micromamba/envs/R/bin:$PATH
# RUN yes | micromamba run -n R micromamba install r-base=4.1.2 -c conda-forge
RUN ln -s /root/micromamba/envs/R/bin/Rscript /root/bin/Rscript
# RUN Rscript TurboPutative-web/install-R-dependencies.R

# create python environment
# RUN micromamba create -n python
# ENV PATH=/root/micromamba/envs/python/bin:$PATH
# RUN yes | micromamba run -n python micromamba install python=3.9 -c conda-forge
# RUN micromamba run -n python pip install -r TurboPutative-web/requirements.txt
RUN ln -s /root/micromamba/envs/python/bin/python /root/bin/python

# create PathIntegrate environment
# RUN micromamba create -n PathIntegrate
# ENV PATH=/root/micromamba/envs/PathIntegrate/bin:$PATH
# RUN yes | micromamba run -n PathIntegrate micromamba install python=3.10 -c conda-forge
# RUN micromamba run -n PathIntegrate pip install -r TurboPutative-web/requirements_PathIntegrate.txt
RUN ln -s /root/micromamba/envs/PathIntegrate/bin/python /root/bin/pythonPathIntegrate


# install node modules
WORKDIR /root/TurboPutative-web
RUN npm install

ENV PATH=/root/bin:$PATH

# start server
EXPOSE 8080
CMD ["npm", "run", "start"]