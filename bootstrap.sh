#!/usr/bin/env bash
HOME="/home/vagrant"
PROV_FILE=.vagrant_provision.lock

#inspired by https://github.com/junwatu/nodejs-vagrant 
if [ -f $PROV_FILE ];
then
    echo "Already Provisioned"
else
    touch $PROV_FILE

    sudo apt-get install -y git make

    git clone https://github.com/sstephenson/rbenv.git $HOME/.rbenv

    # Install ruby-build
    git clone https://github.com/sstephenson/ruby-build.git $HOME/.rbenv/plugins/ruby-build

    $HOME/.rbenv/bin/rbenv install 2.2.2
    $HOME/.rbenv/bin/rbenv global 2.2.2

    #Add rbenv to PATH
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> $HOME/.profile
    echo 'eval "$(rbenv init -)"' >> $HOME/.profile

    #own rbenv as the vagrant user
    sudo chown -Rf vagrant $HOME/.rbenv

    gem install jekyll jekyll-tagging jekyll-paginate redcarpt
fi
