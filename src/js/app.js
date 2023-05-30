App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../people.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].sex);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      // try {
      //   // Request account access
      //   await window.ethereum.enable();
      // } catch (error) {
      //   // User denied account access...
      //   console.error("User denied account access")
      // }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('CustomerKYC.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var customerArtifact = data;
      App.contracts.CustomerKYC = TruffleContract(customerArtifact);
    
      // Set the provider for our contract
      App.contracts.CustomerKYC.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
      console.log('markAdopted')
    });
    
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.CustomerRegistration);
  },

  markAdopted: function() {
    var CustomerKYCInstance;

    App.contracts.CustomerKYC.deployed().then(function(instance) {
      CustomerKYCInstance = instance;
    
      return CustomerKYCInstance.getCustomer.call();
    }).then(function(customer) {
      for (i = 0; i < customer.length; i++) {
        if (customer[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Accepted').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
    
  },

  CustomerRegistration: function(event) {
    event.preventDefault();

    //var petId = parseInt($(event.target).data('id'));
    var CustomerKYCInstance;

    // web3.eth.getAccounts(function(error, accounts) {
    //   if (error) {
    //     console.log(error);
    //   }
    
    //   var account = accounts[0];
    //   console.log(`acc: ${account}`);
    
    //   App.contracts.CustomerKYC.deployed().then(function(instance) {
    //     CustomerKYCInstance = instance;
    
    //     // Execute adopt as a transaction by sending account
    //     return CustomerKYCInstance.registerCustomer('name X', "emailNameX@gmail.com");
    //   }).then(function(result) {
    //     // return App.markAdopted();
    //     console.log(`After customer registration`)
    //   }).catch(function(err) {
    //     console.log(err.message);
    //   });
    // });

    App.contracts.CustomerKYC.deployed().then(function(instance) {
      CustomerKYCInstance = instance;
  
      // Execute adopt as a transaction by sending account
      return CustomerKYCInstance.registerCustomer('name X', "emailNameX@gmail.com");
    }).then(function(result) {
      // return App.markAdopted();
      console.log(`After customer registration`)
    }).catch(function(err) {
      console.log(err.message);
    });
    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
