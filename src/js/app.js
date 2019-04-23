

App = {
  web3Provider: null,
  contracts: {},
  account: '0v0',
  voteSubmitted: false,
  societyVoteSubmitted: false,


//The app is intitialised and the web3 is also initialised
  init: function(){
    return App.initWeb3();
  },
//intialised from the client side to the local block chain
  initWeb3: function() {
    if(typeof web3 !== 'undefined'){
      //instance of web3 provided by MetaMask
      //MetaMask changes the chrome browser into a block chain browser
      //This browser can connet to the ethereum network
      //web3 provider is provided when you log into MetaMask
      App.web3Provider = web3.currentProvider;
      //web3 provider is set to the applications web3 provider
      web3 = new Web3(web3.currentProvider);
    } else{
      //default web3 provider is set if that does not happen
      //from local block chain instance
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3.Provider);
    }
    return App.initContract();
  },
//Contract is inititalised after the Web3 is initialised
//Loads contract to the front end to allow interactions to be made
  initContract: function(){
    $.getJSON("Voting.json", function(voting){
      //The JSON is used to generate TruffleContract
      //the contract that can interact inside of app
      App.contracts.Voting = TruffleContract(voting);
      App.contracts.Voting.setProvider(App.web3Provider);
      //The content of the page is rendered
      App.listenForEvents();
      return App.render();
    });
  },

   listenForEvents: function() {
    App.contracts.Voting.deployed().then(function(instance){
      instance.voted({}, {
        fromBlock: 0,
        toBlock:'latest'
      }).watch(function(error, event){
        console.log("trigger event", event)
        App.render();
      });
    });
  },


//Lays out all the contents on the page
  render: function(){

    var qmvotingInstance;
    var guidelines = $("#guidelines");
    var content = $("#content");
    var secondTable = $("#secondTable");
    var loginbox = $("#loginbox");
    var accountAddressDisplay = $('#accountAddress');
    var displaylogout = $("#displaylogout");
    var popup = $("#popup-overlay");
    var maxLogo = $("#maxLogo");
    var miniLogo = $("#miniLogo");

      guidelines.hide();
      accountAddressDisplay.hide();
      displaylogout.hide();
      content.hide();
      secondTable.hide();
      popup.hide();
      miniLogo.hide();
      maxLogo.show();
      loginbox.show();

    //This loads the account
    //eth used to fetch the accountAddress
    //getCoinbase provides with the account that we connect
    //the block chain with
    web3.eth.getCoinbase(function(err, account){
      if(err == null){
        //If there is no errors the account that we have is set
        //to the current account in our application
        App.account = account;
        //The account will be displayed in the accountAddress
        //section of the application
        $("#accountAddress").html("Account: " + account);
      }
    });

    //The candidates on the page will be listed out
    //A copy of the deployed contract is obtained first
    App.contracts.Voting.deployed().then(function(instance){
      //we assign the copy to the qmvotingInstance variable
      qmvotingInstance = instance;

      return qmvotingInstance.candidateNumber() ;

      //So we obtain the count that the candidate has
      //count keeps track of the number of candidates in the mapping
    }).then(function(candidateNumber){
      var results = $("#results");
      results.empty();
        //A loop is used to list out all the possible people you can nominate
        for (var i = 1; i<= candidateNumber; i++){
          //The following calls the candidate function in our contract
          //Then passes the i value which corresponds to the Id
          //of the candidate
          qmvotingInstance.candidates(i).then(function(candidate){
            //Fetches the candidates: id, name and number of votes
            var id = candidate[0];
            var candidateName = candidate[1];
            var voteNumber = candidate[2];

          //  var position= i;
            //Render results
            var voteTemplate = "<tr><th>"+ id +"</th><td>"+ candidateName +"</td><td>"+ voteNumber +"</td><td><input class ='selectedCandidate' type='checkbox' name='testname' id='selectedCandid' value="+ id +"></td></tr>"
            //appends to the table on the page
            results.append(voteTemplate);

          });
        }

      console.log(candidateNumber);
        //Ensures that voter can only select one vote
      $(results).on('change',function(){
        $('.selectedCandidate').on('change',function(){
          $('.selectedCandidate').not(this).prop("checked",false);
        });
      });



      return qmvotingInstance.student(App.account);

    }).then(function(voteSubmitted){
       if(voteSubmitted){
         $('.selectedCandidate').hide();
       }
       $(".login").click(function(){
           var email = document.getElementById('email');
           var password = document.getElementById('password');

            if((email.value =="123@qmul.ac.uk")&&(password.value =="123")){
              maxLogo.hide();
              miniLogo.show();
              guidelines.show();
              popup.hide();
              accountAddressDisplay.show();
              displaylogout.show();
              loginbox.hide();
            }
            else{
              popup.show();
              $(".close").click(function(){
                popup.hide();
              });
              console.log("The information you have entered is incorrect");
            }
       });

       $(".logout").click(function(){
         loginbox.show();
         displaylogout.hide();
         guidelines.hide();
         accountAddressDisplay.hide();
         content.hide();
       });

       $(".StudentUnion").click(function(){
         loginbox.hide()
         guidelines.hide();
         accountAddressDisplay.show();
         content.show();
       });

      $(".return").click(function(){
          maxLogo.show();
          miniLogo.hide();
          loginbox.hide();
          guidelines.show();
          accountAddressDisplay.show();
          content.hide();
          secondTable.hide();
        });


     }).catch(function(error) {
       console.warn(error);

     });

     App.contracts.Voting.deployed().then(function(instance){

       qmvotingInstance = instance;

       return qmvotingInstance.badmintonNumber();
     }).then(function(badmintonNumber){

       var badmintonResults = $("#badmintonResults");
       badmintonResults.empty();

       for(var j=1; j<=badmintonNumber; j++){

         qmvotingInstance.badmintonCandidates(j).then(function(badmintonCandidate){
           //Fetches the candidates: id, name and number of votes
           var id = badmintonCandidate[0];
           var candidateName = badmintonCandidate[1];
           var voteNumber = badmintonCandidate[2];

         //  var position= i;
           //Render results
           var voteTemplate2 = "<tr><th>"+ id +"</th><td>"+ candidateName +"</td><td>"+ voteNumber +"</td><td><input class ='selectedCandidate2' type='checkbox' name='testname' id='selectedCandid2' value="+ id +"></td></tr>"
           //appends to the table on the page
           badmintonResults.append(voteTemplate2);
         });

       }
       //Ensures that voter can only select one vote
     $(badmintonResults).on('change',function(){
       $('.selectedCandidate').on('change',function(){
         $('.selectedCandidate').not(this).prop("checked",false);
       });
     });

     return qmvotingInstance.studentSociety(App.account);

   }).then(function(societyVoteSubmitted){
      if(societyVoteSubmitted){
        $('.selectedCandidate2').hide();
      }

     $(".Socities").click(function(){
       maxLogo.hide();
       miniLogo.show();
       guidelines.hide();
       secondTable.show();
       });
     $(".return").click(function(){
       maxLogo.hide();
       miniLogo.show();
       guidelines.show();
       secondTable.hide();
       content.hide();
       });
      $(".logout").click(function(){
          maxLogo.show();
          miniLogo.hide();
          secondTable.hide();
          guidelines.hide();
      });

    }).catch(function(error) {
      console.warn(error);

    });

  },




  submitVote:function(id){
    var chosenCandidateID =id;
    App.contracts.Voting.deployed().then(function(instance){
      return instance.elect(chosenCandidateID, {from: App.account});
    }).then(function(result){
      //Allow SU votes to be updated
      $('maxLogo').hide();
      $('miniLogo').show();
      $('guidelines').show();
    }).catch(function(err){
      console.error(err);
    });

  },

    submitSocietyVote:function(id){
      var chosenCandidateID =id;
      App.contracts.Voting.deployed().then(function(instance){
        return instance.societyElection(chosenCandidateID, {from: App.account});
      }).then(function(result){
        //Allow student votes to be updated
        $('maxLogo').hide();
        $('miniLogo').show();
        $('guidelines').show();
      }).catch(function(err){
        console.error(err);
      });
    },

};


$(".votingAbility").click(function(){
  var chosenCandidateID = $("input[name='testname']:checked").val();
    App.submitVote(chosenCandidateID);
    console.log('You must fill the text area!');
    // $('guidlines').show();
    // $('content').hide();
    return false;
});


$(".votingAbility2").click(function(){
  var chosenCandidateID = $("input[name='testname']:checked").val();
    App.submitSocietyVote(chosenCandidateID);
    console.log('You must fill the text area!');
    // $('guidlines').show();
    // $('content').hide();
    return false;
});

$(function() {

  $(window).load(function() {
    //App is intialised whenever the window loads
   App.init();
  });
});
