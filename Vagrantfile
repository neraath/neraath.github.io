VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.provision :shell, :path => "bootstrap.sh"
  config.vm.network :private_network, ip: '10.0.33.37'
  config.vm.network :forwarded_port, guest: 4000, host: 4000
  config.vm.network :forwarded_port, guest: 35729, host: 35729
  config.ssh.forward_agent = true

  config.vm.synced_folder ".", "/vagrant", create: false

  config.vm.provider :virtualbox do |vb|
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
    vb.customize ["modifyvm", :id, "--memory", "512"]
  end
end
